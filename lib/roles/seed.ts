import { PERMISSIONS } from '@/lib/auth/permissions';
import type { Role, UserRole } from './types';

export const DEFAULT_ROLE_IDS = {
  globalAdmin: 'role-global-admin',
  legalCounsel: 'role-legal-counsel',
  documentEditor: 'role-document-editor',
  viewer: 'role-viewer',
} as const;

export function createDefaultRoles(): Role[] {
  const now = new Date().toISOString();

  return [
    {
      id: DEFAULT_ROLE_IDS.globalAdmin,
      name: 'Global Admin',
      description: 'Full system access with unrestricted administrative control.',
      isSystem: true,
      permissions: Object.values(PERMISSIONS),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: DEFAULT_ROLE_IDS.legalCounsel,
      name: 'Legal Counsel',
      description: 'Senior legal oversight with approval and audit capabilities.',
      isSystem: true,
      permissions: [
        PERMISSIONS.VIEW_DOCUMENTS,
        PERMISSIONS.UPLOAD,
        PERMISSIONS.EDIT_METADATA,
        PERMISSIONS.DELETE,
        PERMISSIONS.RESTORE_VERSIONS,
        PERMISSIONS.APPROVE,
        PERMISSIONS.REJECT_ARCHIVE,
        PERMISSIONS.REQUEST_CHANGES,
        PERMISSIONS.VIEW_AUDIT_LOGS,
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: DEFAULT_ROLE_IDS.documentEditor,
      name: 'Document Editor',
      description:
        'Permissions for legal team members who draft and revise active case files.',
      isSystem: true,
      permissions: [
        PERMISSIONS.VIEW_DOCUMENTS,
        PERMISSIONS.UPLOAD,
        PERMISSIONS.EDIT_METADATA,
        PERMISSIONS.RESTORE_VERSIONS,
        PERMISSIONS.APPROVE,
        PERMISSIONS.REQUEST_CHANGES,
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: DEFAULT_ROLE_IDS.viewer,
      name: 'Viewer',
      description: 'Read-only access to approved and published documents.',
      isSystem: true,
      permissions: [PERMISSIONS.VIEW_DOCUMENTS],
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export function createDefaultUserRoles(): UserRole[] {
  const assignments: UserRole[] = [];
  let userCounter = 1;

  const addUsers = (roleId: string, count: number) => {
    for (let index = 0; index < count; index += 1) {
      assignments.push({
        userId: `user-${userCounter}`,
        roleId,
      });
      userCounter += 1;
    }
  };

  addUsers(DEFAULT_ROLE_IDS.globalAdmin, 2);
  addUsers(DEFAULT_ROLE_IDS.legalCounsel, 5);
  addUsers(DEFAULT_ROLE_IDS.documentEditor, 12);
  addUsers(DEFAULT_ROLE_IDS.viewer, 45);

  return assignments;
}
