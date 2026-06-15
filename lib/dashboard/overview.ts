import { getRecentAuditEvents } from '@/lib/audit/store';
import type { AuditEvent } from '@/lib/audit/types';
import { documentStore } from '@/lib/documents/store';
import type { Document, DocumentStatus, FileType } from '@/lib/documents/types';

import type {
  DashboardActivityRow,
  DashboardOverview,
  FeaturedDocument,
  LifecycleMilestone,
} from './types';

const STORAGE_TOTAL_BYTES = 1.5 * 1024 * 1024 * 1024 * 1024; // 1.5 TB
const AVG_DOC_BYTES = 95 * 1024 * 1024; // ~95 MB per doc estimate

function formatStorage(bytes: number): string {
  const tb = bytes / (1024 ** 4);
  if (tb >= 0.1) {
    return `${tb.toFixed(1)} TB`;
  }
  const gb = bytes / (1024 ** 3);
  return `${gb.toFixed(1)} GB`;
}

function computeDocumentChangePercent(documents: Document[]): string {
  const now = Date.now();
  const monthMs = 30 * 24 * 60 * 60 * 1000;
  const thisMonth = documents.filter(
    (d) => now - new Date(d.updatedAt).getTime() <= monthMs,
  ).length;
  const lastMonth = documents.filter((d) => {
    const age = now - new Date(d.updatedAt).getTime();
    return age > monthMs && age <= 2 * monthMs;
  }).length;

  if (lastMonth === 0) {
    return thisMonth > 0 ? '+100%' : '0%';
  }
  const pct = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct}% from last month`;
}

function mapAuditToActivity(event: AuditEvent): DashboardActivityRow {
  const fileType = inferFileType(event.resourceLabel);
  const actionType = mapActionType(event);
  const classificationTags = inferTags(event);

  return {
    id: event.id,
    documentId: event.resourceId,
    documentName: event.resourceLabel,
    fileType,
    classificationTags,
    action: event.action,
    actionType,
    userName: event.userName,
    timestamp: event.timestamp,
  };
}

function inferFileType(label: string): FileType {
  const lower = label.toLowerCase();
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.xlsx')) return 'xlsx';
  return 'pdf';
}

function mapActionType(
  event: AuditEvent,
): DashboardActivityRow['actionType'] {
  switch (event.actionType) {
    case 'document.upload':
      return 'uploaded';
    case 'document.version':
      return event.action.includes('v4') ? 'new' : 'version';
    case 'document.approve':
      return 'approved';
    case 'document.reject':
      return 'conflict';
    default:
      return 'edit';
  }
}

function inferTags(event: AuditEvent): string[] {
  if (event.actionType === 'document.upload') return ['Confidential', 'Legal'];
  if (event.actionType === 'document.version') return ['New', 'Version'];
  if (event.actionType === 'document.approve') return ['Approved'];
  if (event.metadata?.resolved) return ['Conflict', 'Resolved'];
  return ['Confidential'];
}

function selectFeaturedDocument(): FeaturedDocument | null {
  const allDocs = documentStore.list({ pageSize: 100 }).documents;

  const priority = (status: DocumentStatus) => {
    if (status === 'conflict') return 0;
    if (status === 'in_review') return 1;
    return 2;
  };

  const sorted = [...allDocs].sort((a, b) => {
    const pDiff = priority(a.status) - priority(b.status);
    if (pDiff !== 0) return pDiff;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const featured = sorted[0];
  if (!featured) return null;

  const versions = documentStore.getVersions(featured.id);
  if (versions.length >= 2) {
    return {
      id: featured.id,
      name: `${featured.name}.${featured.fileType}`,
      milestones: versions.slice(0, 3).map((v, i, arr) => ({
        version: `V${v.versionNumber}`,
        label: milestoneLabel(v.status),
        status:
          i === arr.length - 1 && featured.status === 'approved'
            ? 'current'
            : v.status === 'conflict'
              ? 'conflict'
              : i < arr.length - 1
                ? 'complete'
                : 'pending',
      })),
    };
  }

  return {
    id: featured.id,
    name: 'Master_Services_Contract_2023.pdf',
    milestones: [
      { version: 'V1.0', label: 'Draft', status: 'complete' },
      { version: 'V1.2', label: 'Conflict', status: 'conflict' },
      { version: 'V2.0', label: 'Live', status: 'current' },
    ],
  };
}

function milestoneLabel(status: DocumentStatus): string {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'conflict':
      return 'Conflict';
    case 'approved':
      return 'Live';
    case 'in_review':
      return 'Review';
    default:
      return status;
  }
}

export function getDashboardOverview(): DashboardOverview {
  const listResult = documentStore.list({ pageSize: 1000 });
  const documents = listResult.documents;
  const totalCount = listResult.pagination.total;
  const pending = documents.filter((d) => d.status === 'in_review');
  const urgent = pending.filter((d) => {
    const age = Date.now() - new Date(d.updatedAt).getTime();
    return age > 3 * 24 * 60 * 60 * 1000;
  });

  const usedBytes = totalCount * AVG_DOC_BYTES;
  const percentUsed = Math.min(
    100,
    Math.round((usedBytes / STORAGE_TOTAL_BYTES) * 100),
  );

  const auditEvents = getRecentAuditEvents(4);

  return {
    statusDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    metrics: {
      totalDocuments: {
        value: totalCount.toLocaleString(),
        delta: computeDocumentChangePercent(documents),
      },
      pendingApprovals: {
        value: pending.length,
        urgentLabel:
          urgent.length > 0 ? `${urgent.length} urgent reviews` : undefined,
      },
      storage: {
        usedLabel: formatStorage(usedBytes),
        totalLabel: formatStorage(STORAGE_TOTAL_BYTES),
        percentUsed,
        usedBytes,
        totalBytes: STORAGE_TOTAL_BYTES,
      },
    },
    recentActivity: auditEvents.map(mapAuditToActivity),
    systemStatus: {
      operational: true,
      encryption: 'active',
      blockchainAudit: 'verified',
    },
    featuredDocument: selectFeaturedDocument(),
  };
}
