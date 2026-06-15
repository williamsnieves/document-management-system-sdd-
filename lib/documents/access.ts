import { PERMISSIONS } from '@/lib/auth/permissions';
import type { AuthUser } from '@/lib/auth/types';
import { getCurrentUser } from '@/lib/auth/middleware';
import { hasPermission, isGlobalAdmin } from '@/lib/roles/hasPermission';

export { getCurrentUser };
export { hasPermission };
export { PERMISSIONS as Permission };

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
