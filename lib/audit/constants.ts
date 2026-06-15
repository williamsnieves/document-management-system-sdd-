import type { AuditActionType, AuditSeverity } from './types';

export const AUDIT_ACTION_LABELS: Record<AuditActionType, string> = {
  'document.upload': 'New Upload',
  'document.upload_denied': 'Upload Denied',
  'document.version': 'Created Version',
  'document.version_upload': 'Created Version',
  'document.version_restore': 'Restored Version',
  'document.conflict_resolved': 'Conflict Resolved',
  'document.shared': 'Document Shared',
  'document.approve': 'Approved',
  'document.reject': 'Rejected',
  'document.delete_attempt': 'Mass Deletion Attempt',
  'folder.create': 'Folder Created',
  'permission.update': 'Permission Update',
  'security.policy': 'Security Policy Change',
};

export const DEFAULT_SEVERITY: Record<AuditActionType, AuditSeverity> = {
  'document.upload': 'success',
  'document.upload_denied': 'warning',
  'document.version': 'success',
  'document.version_upload': 'success',
  'document.version_restore': 'success',
  'document.conflict_resolved': 'success',
  'document.shared': 'success',
  'document.approve': 'success',
  'document.reject': 'warning',
  'document.delete_attempt': 'critical',
  'folder.create': 'success',
  'permission.update': 'warning',
  'security.policy': 'critical',
};

export const EVENT_TYPE_OPTIONS: { value: AuditActionType | 'all'; label: string }[] =
  [
    { value: 'all', label: 'All Events' },
    { value: 'document.upload', label: 'New Upload' },
    { value: 'document.version', label: 'Version Created' },
    { value: 'document.approve', label: 'Approval' },
    { value: 'document.reject', label: 'Rejection' },
    { value: 'permission.update', label: 'Permission Update' },
    { value: 'document.delete_attempt', label: 'Deletion Attempt' },
    { value: 'folder.create', label: 'Folder Created' },
    { value: 'security.policy', label: 'Security Policy' },
  ];

export const DATE_RANGE_OPTIONS: {
  value: '24h' | '7d' | '30d' | 'all';
  label: string;
}[] = [
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: 'all', label: 'All Time' },
];

export const SEVERITY_OPTIONS: {
  value: AuditSeverity | 'all';
  label: string;
}[] = [
  { value: 'all', label: 'Any Severity' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
];

export const DEFAULT_PAGE_SIZE = 10;
