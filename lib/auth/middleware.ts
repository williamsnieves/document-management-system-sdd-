import { NextResponse } from 'next/server';
import { PERMISSIONS, type Permission } from '@/lib/auth/permissions';
import type { AuthUser } from '@/lib/auth/types';
import { hasPermission, isGlobalAdmin } from '@/lib/roles/hasPermission';
import { DEFAULT_ROLE_IDS } from '@/lib/roles/store';

/**
 * Temporary session helper until security/onboarding implements real auth.
 * Defaults to Global Admin for development and role-management flows.
 */
export function getCurrentUser(): AuthUser {
  return {
    id: 'user-1',
    email: 'admin@legalcorp.com',
    name: 'System Administrator',
    roleIds: [DEFAULT_ROLE_IDS.globalAdmin],
  };
}

export interface PermissionCheckResult {
  allowed: boolean;
  user: AuthUser;
  response?: NextResponse;
}

export function checkPermission(
  user: AuthUser,
  permission: Permission,
): PermissionCheckResult {
  if (hasPermission(user, permission)) {
    return { allowed: true, user };
  }

  return {
    allowed: false,
    user,
    response: NextResponse.json(
      { error: 'Forbidden', message: `Missing permission: ${permission}` },
      { status: 403 },
    ),
  };
}

export function requirePermission(
  permission: Permission,
  user: AuthUser = getCurrentUser(),
): PermissionCheckResult {
  return checkPermission(user, permission);
}

export function requireAnyPermission(
  permissions: Permission[],
  user: AuthUser = getCurrentUser(),
): PermissionCheckResult {
  if (permissions.some((permission) => hasPermission(user, permission))) {
    return { allowed: true, user };
  }

  return {
    allowed: false,
    user,
    response: NextResponse.json(
      { error: 'Forbidden', message: 'Missing required permissions.' },
      { status: 403 },
    ),
  };
}

export function canManageRoles(user: AuthUser = getCurrentUser()): boolean {
  return (
    isGlobalAdmin(user) || hasPermission(user, PERMISSIONS.MANAGE_USERS)
  );
}

export function requireRoleManagement(
  user: AuthUser = getCurrentUser(),
): PermissionCheckResult {
  if (canManageRoles(user)) {
    return { allowed: true, user };
  }

  return {
    allowed: false,
    user,
    response: NextResponse.json(
      {
        error: 'Forbidden',
        message: 'Role management requires administrator access.',
      },
      { status: 403 },
    ),
  };
}
