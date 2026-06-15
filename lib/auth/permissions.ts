export const PERMISSIONS = {
  VIEW_DOCUMENTS: 'VIEW_DOCUMENTS',
  UPLOAD: 'UPLOAD',
  EDIT_METADATA: 'EDIT_METADATA',
  DELETE: 'DELETE',
  RESTORE_VERSIONS: 'RESTORE_VERSIONS',
  APPROVE: 'APPROVE',
  REJECT_ARCHIVE: 'REJECT_ARCHIVE',
  REQUEST_CHANGES: 'REQUEST_CHANGES',
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export type PermissionCategoryId =
  | 'document_access'
  | 'workflow'
  | 'administration';

export interface PermissionDefinition {
  id: Permission;
  label: string;
  description: string;
  reservedNote?: string;
}

export interface PermissionCategory {
  id: PermissionCategoryId;
  label: string;
  permissions: PermissionDefinition[];
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'document_access',
    label: 'Document Access',
    permissions: [
      {
        id: PERMISSIONS.VIEW_DOCUMENTS,
        label: 'View Documents',
        description: 'Browse and open documents in the library.',
      },
      {
        id: PERMISSIONS.UPLOAD,
        label: 'Upload New Files',
        description: 'Add new documents and versions to the workspace.',
      },
      {
        id: PERMISSIONS.EDIT_METADATA,
        label: 'Edit Metadata & Content',
        description: 'Modify document titles, tags, and file content.',
      },
      {
        id: PERMISSIONS.DELETE,
        label: 'Delete Documents',
        description: 'Permanently remove documents from the system.',
      },
      {
        id: PERMISSIONS.RESTORE_VERSIONS,
        label: 'Restore Versions',
        description: 'Revert documents to a previous version.',
      },
    ],
  },
  {
    id: 'workflow',
    label: 'Workflow',
    permissions: [
      {
        id: PERMISSIONS.APPROVE,
        label: 'Approve Documents',
        description: 'Sign off on documents in the approval queue.',
      },
      {
        id: PERMISSIONS.REJECT_ARCHIVE,
        label: 'Reject & Archive',
        description: 'Decline submissions and move them to archive.',
      },
      {
        id: PERMISSIONS.REQUEST_CHANGES,
        label: 'Request Changes',
        description: 'Send documents back for revision.',
      },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    permissions: [
      {
        id: PERMISSIONS.MANAGE_USERS,
        label: 'Manage Users',
        description: 'Invite, edit, and deactivate workspace members.',
        reservedNote: 'Reserved for Global Admins.',
      },
      {
        id: PERMISSIONS.VIEW_AUDIT_LOGS,
        label: 'View Audit Logs',
        description: 'Access the system-wide activity and compliance log.',
        reservedNote: 'Reserved for Legal Counsel and Admins.',
      },
    ],
  },
];

export const GLOBAL_ADMIN_ROLE_NAME = 'Global Admin';
