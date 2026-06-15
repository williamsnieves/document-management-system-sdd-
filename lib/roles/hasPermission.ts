import {
  GLOBAL_ADMIN_ROLE_NAME,
  type Permission,
} from '@/lib/auth/permissions';
import type { AuthUser } from '@/lib/auth/types';
import { getRoleStore } from './store';

export function hasPermission(user: AuthUser, permission: Permission): boolean {
  const store = getRoleStore();
  const roles = store.getRolesByIds(user.roleIds);

  if (roles.some((role) => role.name === GLOBAL_ADMIN_ROLE_NAME)) {
    return true;
  }

  const grantedPermissions = new Set<Permission>();

  for (const role of roles) {
    for (const rolePermission of role.permissions) {
      grantedPermissions.add(rolePermission);
    }
  }

  return grantedPermissions.has(permission);
}

export function getUserPermissions(user: AuthUser): Permission[] {
  const store = getRoleStore();
  const roles = store.getRolesByIds(user.roleIds);

  if (roles.some((role) => role.name === GLOBAL_ADMIN_ROLE_NAME)) {
    return roles.flatMap((role) => role.permissions);
  }

  return Array.from(new Set(roles.flatMap((role) => role.permissions)));
}

export function isGlobalAdmin(user: AuthUser): boolean {
  const store = getRoleStore();
  const roles = store.getRolesByIds(user.roleIds);
  return roles.some((role) => role.name === GLOBAL_ADMIN_ROLE_NAME);
}
