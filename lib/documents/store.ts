import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import { recordAuditEvent } from '../audit/record';
import { filterDocumentsBySearch } from '../search/search';
import {
  generateExtraSeedDocuments,
  CATEGORY_DISPLAY_COUNTS,
  SEED_ACTIVITY,
  SEED_DOCUMENTS,
  SEED_FOLDERS,
  SEED_VERSIONS,
} from './seed';
import { OWNERS } from './owners';
import { canViewDocument } from './access';
import { getCurrentUser } from '@/lib/auth/middleware';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { hasPermission } from '@/lib/roles/hasPermission';
import type {
  ActivityEvent,
  CreateFolderInput,
  Document,
  DocumentCategory,
  DocumentListQuery,
  DocumentListResponse,
  DocumentSortField,
  DocumentStatus,
  FileType,
  Folder,
  UploadDocumentInput,
  Version,
} from './types';
import { ALLOWED_MIME_TYPES } from './types';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

class DocumentStore {
  private documents: Document[] = [
    ...SEED_DOCUMENTS,
    ...generateExtraSeedDocuments(),
  ];

  private versions: Version[] = [...SEED_VERSIONS];

  private folders: Folder[] = [...SEED_FOLDERS];

  private activity: ActivityEvent[] = [...SEED_ACTIVITY];

  list(query: DocumentListQuery = {}): DocumentListResponse {
    const user = getCurrentUser();
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, query.pageSize ?? 20));
    const sortField: DocumentSortField = query.sort ?? 'updatedAt';
    const order = query.order ?? 'desc';
    const view = query.view ?? 'list';

    let filtered = this.documents.filter((doc) =>
      canViewDocument(user, doc.accessLevel),
    );

    if (query.category?.length) {
      const categories = new Set(query.category);
      filtered = filtered.filter((doc) => categories.has(doc.category));
    }

    if (query.status?.length) {
      const statuses = new Set(query.status);
      filtered = filtered.filter((doc) => statuses.has(doc.status));
    }

    filtered = filterDocumentsBySearch(filtered, query.q);

    filtered.sort((a, b) => {
      const direction = order === 'asc' ? 1 : -1;
      if (sortField === 'name') {
        return a.name.localeCompare(b.name) * direction;
      }
      if (sortField === 'documentId') {
        return a.documentId.localeCompare(b.documentId) * direction;
      }
      return (
        (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
        direction
      );
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const documents = filtered.slice(start, start + pageSize);

    return {
      documents,
      owners: OWNERS,
      pagination: { page, pageSize, total, totalPages },
      categoryCounts: this.getCategoryCounts(user),
      view,
    };
  }

  getCategoryCounts(user: ReturnType<typeof getCurrentUser>) {
    const visible = this.documents.filter((doc) =>
      canViewDocument(user, doc.accessLevel),
    );
    const actual: Record<DocumentCategory, number> = {
      legal: visible.filter((d) => d.category === 'legal').length,
      finance: visible.filter((d) => d.category === 'finance').length,
      hr: visible.filter((d) => d.category === 'hr').length,
    };

    return {
      legal: Math.max(actual.legal, CATEGORY_DISPLAY_COUNTS.legal),
      finance: Math.max(actual.finance, CATEGORY_DISPLAY_COUNTS.finance),
      hr: Math.max(actual.hr, CATEGORY_DISPLAY_COUNTS.hr),
    };
  }

  getRecentActivity(limit = 5): ActivityEvent[] {
    return [...this.activity]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);
  }

  getDocumentById(id: string): Document | undefined {
    const user = getCurrentUser();
    const doc = this.documents.find((d) => d.id === id);
    if (!doc || !canViewDocument(user, doc.accessLevel)) {
      return undefined;
    }
    return doc;
  }

  getVersions(documentId: string): Version[] {
    return this.versions.filter((v) => v.documentId === documentId).sort((a, b) => {
      // Sort by version number descending, handling semver
      const aParts = a.versionNumber.split('.').map(Number);
      const bParts = b.versionNumber.split('.').map(Number);
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal !== bVal) return bVal - aVal;
      }
      return 0;
    });
  }

  async upload(input: UploadDocumentInput): Promise<Document> {
    const user = getCurrentUser();
    if (!hasPermission(user, PERMISSIONS.UPLOAD)) {
      recordAuditEvent({
        userId: user.id,
        actionType: 'document.upload_denied',
        resourceType: 'document',
        resourceId: 'denied',
        resourceLabel: input.file.name,
        metadata: { reason: 'permission_denied' },
      });
      throw new UploadError('Permission denied', 403);
    }

    const fileType = ALLOWED_MIME_TYPES[input.file.type];
    if (!fileType) {
      throw new UploadError(
        'Unsupported file type. Allowed: PDF, DOCX, XLSX.',
        400,
      );
    }

    if (input.file.size > 50 * 1024 * 1024) {
      throw new UploadError('File exceeds 50MB limit.', 400);
    }

    const id = randomUUID();
    const documentId = this.generateDocumentId(input.category);
    const versionNumber = '1.0.0';
    const fileUrl = await this.persistFile(id, fileType, input.file.buffer);

    const document: Document = {
      id,
      name: input.file.name.replace(/\.[^.]+$/, ''),
      documentId,
      category: input.category,
      status: 'draft',
      ownerId: input.userId,
      updatedAt: new Date().toISOString(),
      currentVersion: versionNumber,
      tags: input.tags ?? [],
      fileType,
      folderId: input.folderId,
      accessLevel: 'standard',
    };

    const version: Version = {
      id: randomUUID(),
      documentId: id,
      versionNumber,
      status: 'draft',
      createdBy: input.userId,
      createdAt: document.updatedAt,
      fileUrl,
    };

    this.documents.unshift(document);
    this.versions.push(version);

    this.activity.unshift({
      id: randomUUID(),
      type: 'upload',
      userId: input.userId,
      userName: OWNERS[input.userId]?.name ?? 'Unknown User',
      documentId: id,
      documentName: document.name,
      timestamp: document.updatedAt,
    });

    recordAuditEvent({
      userId: input.userId,
      actionType: 'document.upload',
      resourceType: 'document',
      resourceId: id,
      resourceLabel: document.name,
      metadata: { documentId: document.documentId, version: versionNumber },
    });

    return document;
  }

  createFolder(input: CreateFolderInput): Folder {
    const user = getCurrentUser();
    if (!hasPermission(user, PERMISSIONS.UPLOAD)) {
      throw new UploadError('Permission denied', 403);
    }

    const folder: Folder = {
      id: randomUUID(),
      name: input.name.trim(),
      createdAt: new Date().toISOString(),
      createdBy: input.userId,
    };

    this.folders.push(folder);

    recordAuditEvent({
      userId: input.userId,
      actionType: 'folder.create',
      resourceType: 'folder',
      resourceId: folder.id,
      resourceLabel: folder.name,
    });

    return folder;
  }

  getFolders(): Folder[] {
    return [...this.folders];
  }

  createVersion(
    documentId: string,
    versionNumber: string,
    userId: string,
  ): Version | undefined {
    const doc = this.documents.find((d) => d.id === documentId);
    if (!doc) return undefined;

    const version: Version = {
      id: randomUUID(),
      documentId,
      versionNumber,
      status: 'draft',
      createdBy: userId,
      createdAt: new Date().toISOString(),
      fileUrl: `/uploads/${documentId}-v${versionNumber}.${doc.fileType}`,
    };

    this.versions.push(version);
    doc.currentVersion = versionNumber;
    doc.updatedAt = version.createdAt;

    recordAuditEvent({
      userId,
      actionType: 'document.version',
      resourceType: 'document',
      resourceId: documentId,
      resourceLabel: doc.name,
      metadata: { version: versionNumber },
    });

    return version;
  }

  approveDocument(documentId: string, userId: string): Document | undefined {
    const doc = this.documents.find((d) => d.id === documentId);
    if (!doc) return undefined;

    doc.status = 'approved';
    doc.updatedAt = new Date().toISOString();

    this.activity.unshift({
      id: randomUUID(),
      type: 'approval',
      userId,
      userName: OWNERS[userId]?.name ?? 'Unknown User',
      documentId,
      documentName: doc.name,
      timestamp: doc.updatedAt,
    });

    recordAuditEvent({
      userId,
      actionType: 'document.approve',
      resourceType: 'document',
      resourceId: documentId,
      resourceLabel: doc.name,
    });

    return doc;
  }

  rejectDocument(documentId: string, userId: string): Document | undefined {
    const doc = this.documents.find((d) => d.id === documentId);
    if (!doc) return undefined;

    doc.status = 'draft';
    doc.updatedAt = new Date().toISOString();

    recordAuditEvent({
      userId,
      actionType: 'document.reject',
      resourceType: 'document',
      resourceId: documentId,
      resourceLabel: doc.name,
    });

    return doc;
  }

  recordMassDeletionAttempt(userId: string, count: number): void {
    recordAuditEvent({
      userId,
      actionType: 'document.delete_attempt',
      resourceType: 'multiple',
      resourceId: `bulk-${count}`,
      resourceLabel: `Multiple (${count} Items)`,
      resourceCount: count,
      severity: 'critical',
    });
  }

  private generateDocumentId(category: DocumentCategory): string {
    const prefix =
      category === 'legal' ? 'LEG' : category === 'finance' ? 'FIN' : 'HR';
    const count =
      this.documents.filter((d) => d.category === category).length + 1;
    return `${prefix}-${String(count).padStart(3, '0')}`;
  }

  async uploadVersion(
    documentId: string,
    input: {
      file: { name: string; type: string; size: number; buffer: Buffer };
      userId: string;
      baseVersionId?: string;
      description?: string;
    }
  ): Promise<Version> {
    const user = getCurrentUser();
    if (!hasPermission(user, PERMISSIONS.UPLOAD)) {
      throw new UploadError('Permission denied', 403);
    }

    const document = this.getDocumentById(documentId);
    if (!document) {
      throw new UploadError('Document not found', 404);
    }

    const fileType = ALLOWED_MIME_TYPES[input.file.type];
    if (!fileType) {
      throw new UploadError('Unsupported file type.', 400);
    }

    if (input.file.size > 50 * 1024 * 1024) {
      throw new UploadError('File exceeds 50MB limit.', 400);
    }

    // Check for conflict
    const existingVersions = this.getVersions(documentId);
    if (input.baseVersionId) {
      const concurrentVersions = existingVersions.filter(v => v.baseVersionId === input.baseVersionId);
      if (concurrentVersions.length > 0) {
        document.status = 'conflict';
        // We still create the version but mark document as conflict
      }
    }

    // Determine new version number
    let newVersionNumber = '1.0.0';
    if (existingVersions.length > 0) {
      const latest = existingVersions[0].versionNumber;
      const parts = latest.split('.').map(Number);
      parts[1] += 1; // Increment minor version
      newVersionNumber = parts.join('.');
    }

    const versionId = randomUUID();
    const fileUrl = await this.persistFile(documentId, fileType, input.file.buffer, newVersionNumber);

    const version: Version = {
      id: versionId,
      documentId,
      versionNumber: newVersionNumber,
      status: document.status === 'conflict' ? 'conflict' : 'in_review',
      createdBy: input.userId,
      createdAt: new Date().toISOString(),
      fileUrl,
      baseVersionId: input.baseVersionId,
      description: input.description,
    };

    this.versions.unshift(version);
    
    if (document.status !== 'conflict') {
      document.currentVersion = newVersionNumber;
      document.updatedAt = version.createdAt;
      document.status = 'in_review';
    }

    this.activity.unshift({
      id: randomUUID(),
      type: 'upload',
      userId: input.userId,
      userName: OWNERS[input.userId]?.name ?? 'Unknown User',
      documentId: document.id,
      documentName: document.name,
      timestamp: version.createdAt,
    });

    recordAuditEvent({
      userId: input.userId,
      actionType: 'document.version_upload',
      resourceType: 'document',
      resourceId: document.id,
      resourceLabel: document.name,
      metadata: { version: newVersionNumber, conflict: document.status === 'conflict' },
    });

    return version;
  }

  async restoreVersion(documentId: string, versionId: string, userId: string): Promise<Document> {
    const user = getCurrentUser();
    if (!hasPermission(user, PERMISSIONS.UPLOAD)) {
      throw new UploadError('Permission denied', 403);
    }

    const document = this.getDocumentById(documentId);
    if (!document) throw new UploadError('Document not found', 404);

    const version = this.versions.find(v => v.id === versionId && v.documentId === documentId);
    if (!version) throw new UploadError('Version not found', 404);

    document.currentVersion = version.versionNumber;
    document.updatedAt = new Date().toISOString();
    document.status = version.status === 'conflict' ? 'in_review' : version.status;

    recordAuditEvent({
      userId,
      actionType: 'document.version_restore',
      resourceType: 'document',
      resourceId: document.id,
      resourceLabel: document.name,
      metadata: { restoredVersion: version.versionNumber },
    });

    return document;
  }

  async resolveConflict(
    documentId: string,
    input: {
      file: { name: string; type: string; size: number; buffer: Buffer };
      userId: string;
      description: string;
    }
  ): Promise<Version> {
    const user = getCurrentUser();
    if (!hasPermission(user, PERMISSIONS.UPLOAD)) {
      throw new UploadError('Permission denied', 403);
    }

    const document = this.getDocumentById(documentId);
    if (!document) throw new UploadError('Document not found', 404);

    if (document.status !== 'conflict') {
      throw new UploadError('Document is not in conflict state', 400);
    }

    const fileType = ALLOWED_MIME_TYPES[input.file.type];
    if (!fileType) throw new UploadError('Unsupported file type.', 400);

    const existingVersions = this.getVersions(documentId);
    const latest = existingVersions.length > 0 ? existingVersions[0].versionNumber : '1.0.0';
    const parts = latest.split('.').map(Number);
    parts[1] += 1;
    const newVersionNumber = parts.join('.');

    const versionId = randomUUID();
    const fileUrl = await this.persistFile(documentId, fileType, input.file.buffer, newVersionNumber);

    const version: Version = {
      id: versionId,
      documentId,
      versionNumber: newVersionNumber,
      status: 'in_review',
      createdBy: input.userId,
      createdAt: new Date().toISOString(),
      fileUrl,
      description: input.description,
      conflictResolved: true,
    };

    this.versions.unshift(version);
    document.currentVersion = newVersionNumber;
    document.updatedAt = version.createdAt;
    document.status = 'in_review';

    recordAuditEvent({
      userId: input.userId,
      actionType: 'document.conflict_resolved',
      resourceType: 'document',
      resourceId: document.id,
      resourceLabel: document.name,
      metadata: { version: newVersionNumber },
    });

    return version;
  }

  updateMetadata(documentId: string, input: { tags?: string[]; accessLevel?: 'standard' | 'restricted' }): Document {
    const document = this.getDocumentById(documentId);
    if (!document) throw new UploadError('Document not found', 404);

    if (input.tags) document.tags = input.tags;
    if (input.accessLevel) document.accessLevel = input.accessLevel;
    document.updatedAt = new Date().toISOString();

    return document;
  }

  private async persistFile(
    id: string,
    fileType: FileType,
    buffer: Buffer,
    versionNumber: string = '1.0.0'
  ): Promise<string> {
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${id}-v${versionNumber}.${fileType}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    await writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  }
}

export class UploadError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'UploadError';
  }
}

const globalForStore = globalThis as unknown as {
  documentStore?: DocumentStore;
};

export const documentStore =
  globalForStore.documentStore ?? new DocumentStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.documentStore = documentStore;
}

export function parseCategories(
  value: string | null,
): DocumentCategory[] | undefined {
  if (!value) return undefined;
  const valid: DocumentCategory[] = ['legal', 'finance', 'hr'];
  const parsed = value
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is DocumentCategory =>
      valid.includes(s as DocumentCategory),
    );
  return parsed.length ? parsed : undefined;
}

export function parseStatuses(
  value: string | null,
): DocumentStatus[] | undefined {
  if (!value) return undefined;
  const valid: DocumentStatus[] = ['approved', 'in_review', 'draft'];
  const parsed = value
    .split(',')
    .map((s) => s.trim())
    .filter((s): s is DocumentStatus =>
      valid.includes(s as DocumentStatus),
    );
  return parsed.length ? parsed : undefined;
}
