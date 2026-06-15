export type {
  AuditActionType,
  AuditEvent,
  AuditQuery,
  AuditQueryResult,
  AuditRecordInput,
  AuditResourceType,
  AuditSeverity,
  DateRangeFilter,
  EventTypeFilter,
  SeverityFilter,
} from './types';

export {
  AUDIT_ACTION_LABELS,
  DATE_RANGE_OPTIONS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SEVERITY,
  EVENT_TYPE_OPTIONS,
  SEVERITY_OPTIONS,
} from './constants';

export {
  auditStore,
  AUDIT_INDEX_KEYS,
  getAuditUsers,
  getRecentAuditEvents,
  queryAuditEvents,
  recordAuditEvent,
} from './store';

export function formatAuditTimestamp(isoDate: string): string {
  return new Date(isoDate).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export function formatAuditExportTimestamp(isoDate: string): string {
  return new Date(isoDate).toISOString();
}
