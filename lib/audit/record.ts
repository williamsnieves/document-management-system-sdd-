/** @deprecated Import from '@/lib/audit' or '@/lib/audit/store' instead. */
export {
  recordAuditEvent,
  getRecentAuditEvents,
  queryAuditEvents,
} from './store';

export type {
  AuditActionType as AuditAction,
  AuditRecordInput,
} from './types';
