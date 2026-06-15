export type AuditSeverity = 'success' | 'warning' | 'critical';

export type AuditResourceType =
  | 'document'
  | 'folder'
  | 'role'
  | 'system'
  | 'multiple';

export type AuditActionType =
  | 'document.upload'
  | 'document.upload_denied'
  | 'document.version'
  | 'document.version_upload'
  | 'document.version_restore'
  | 'document.conflict_resolved'
  | 'document.shared'
  | 'document.approve'
  | 'document.reject'
  | 'document.delete_attempt'
  | 'folder.create'
  | 'permission.update'
  | 'security.policy';

export interface AuditEvent {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userInitials: string;
  userAvatarColor: string;
  action: string;
  actionType: AuditActionType;
  resourceType: AuditResourceType;
  resourceId: string;
  resourceLabel: string;
  resourceCount?: number;
  ip: string;
  location: string;
  severity: AuditSeverity;
  metadata?: Record<string, unknown>;
}

export interface AuditRecordInput {
  userId: string;
  actionType: AuditActionType;
  resourceType: AuditResourceType;
  resourceId: string;
  resourceLabel: string;
  resourceCount?: number;
  ip?: string;
  location?: string;
  severity?: AuditSeverity;
  metadata?: Record<string, unknown>;
}

export interface AuditQuery {
  dateRange?: '24h' | '7d' | '30d' | 'all';
  eventType?: AuditActionType | 'all';
  userId?: string | 'all';
  severity?: AuditSeverity | 'all';
  page?: number;
  pageSize?: number;
}

export interface AuditQueryResult {
  events: AuditEvent[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export type DateRangeFilter = NonNullable<AuditQuery['dateRange']>;
export type EventTypeFilter = AuditActionType | 'all';
export type SeverityFilter = AuditSeverity | 'all';
