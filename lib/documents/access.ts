import { PERMISSIONS } from '@/lib/auth/permissions';
import type { AuthUser } from '@/lib/auth/types';
import {
  getCurrentUser,
  requirePermission,
  type PermissionCheckResult,
} from '@/lib/auth/middleware';
import { hasPermission, isGlobalAdmin } from '@/lib/roles/hasPermission';

export { getCurrentUser };
export { hasPermission };
export { PERMISSIONS as Permission };

export function requireViewDocuments(): PermissionCheckResult {
  return requirePermission(PERMISSIONS.VIEW_DOCUMENTS);
}

export function requireUpload(): PermissionCheckResult {
  return requirePermission(PERMISSIONS.UPLOAD);
}

export function requireEditMetadata(): PermissionCheckResult {
  return requirePermission(PERMISSIONS.EDIT_METADATA);
}

export function requireRestoreVersions(): PermissionCheckResult {
  return requirePermission(PERMISSIONS.RESTORE_VERSIONS);
}

export function canViewDocument(user: AuthUser, accessLevel: string): boolean {
  if (!hasPermission(user, PERMISSIONS.VIEW_DOCUMENTS)) {
    return false;
  }

  if (accessLevel === 'restricted') {
    return (
      isGlobalAdmin(user) ||
      hasPermission(user, PERMISSIONS.EDIT_METADATA) ||
      hasPermission(user, PERMISSIONS.APPROVE)
    );
  }

  return true;
}
