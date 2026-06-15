export type DocumentCategory = 'legal' | 'finance' | 'hr';

export type DocumentStatus = 'approved' | 'in_review' | 'draft' | 'conflict';

export type FileType = 'pdf' | 'docx' | 'xlsx';

export type DocumentView = 'list' | 'grid';

export type DocumentSortField = 'updatedAt' | 'name' | 'documentId';

export type SortOrder = 'asc' | 'desc';

export interface Owner {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Document {
  id: string;
  name: string;
  documentId: string;
  category: DocumentCategory;
  status: DocumentStatus;
  ownerId: string;
  updatedAt: string;
  currentVersion: string;
  tags: string[];
  fileType: FileType;
  folderId?: string;
  hasVersionWarning?: boolean;
  accessLevel: 'standard' | 'restricted';
}

export interface Version {
  id: string;
  documentId: string;
  versionNumber: string;
  status: DocumentStatus;
  createdBy: string;
  createdAt: string;
  fileUrl: string;
  baseVersionId?: string;
  description?: string;
  conflictResolved?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

export interface ActivityEvent {
  id: string;
  type: 'approval' | 'review_request' | 'upload' | 'edit';
  userId: string;
  userName: string;
  documentId: string;
  documentName: string;
  timestamp: string;
}

export interface DocumentListQuery {
  category?: DocumentCategory[];
  status?: DocumentStatus[];
  q?: string;
  sort?: DocumentSortField;
  order?: SortOrder;
  page?: number;
  pageSize?: number;
  view?: DocumentView;
}

export interface DocumentListResponse {
  documents: Document[];
  owners: Record<string, Owner>;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  categoryCounts: Record<DocumentCategory, number>;
  view: DocumentView;
}

export interface UploadDocumentInput {
  file: {
    name: string;
    type: string;
    size: number;
    buffer: Buffer;
  };
  category: DocumentCategory;
  tags?: string[];
  folderId?: string;
  userId: string;
}

export interface CreateFolderInput {
  name: string;
  userId: string;
}

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  legal: 'Legal Documents',
  finance: 'Finance & Audit',
  hr: 'HR & Operations',
};

export const STATUS_LABELS: Record<DocumentStatus, string> = {
  approved: 'Approved',
  in_review: 'In Review',
  draft: 'Draft',
  conflict: 'Conflict',
};

export const ALLOWED_MIME_TYPES: Record<string, FileType> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
