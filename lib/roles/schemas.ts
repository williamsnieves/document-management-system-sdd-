import { ALL_PERMISSIONS, type Permission } from '@/lib/auth/permissions';
import type { CreateRoleInput, UpdateRolePermissionsInput } from './types';

const PERMISSION_SET = new Set<string>(ALL_PERMISSIONS);

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateCreateRoleInput(
  input: unknown,
): ValidationResult<CreateRoleInput> {
  if (!input || typeof input !== 'object') {
    return { success: false, error: 'Request body must be an object.' };
  }

  const body = input as Record<string, unknown>;

  if (!isNonEmptyString(body.name)) {
    return { success: false, error: 'Role name is required.' };
  }

  if (!isNonEmptyString(body.description)) {
    return { success: false, error: 'Role description is required.' };
  }

  return {
    success: true,
    data: {
      name: body.name.trim(),
      description: body.description.trim(),
    },
  };
}

export function validateUpdateRolePermissionsInput(
  input: unknown,
): ValidationResult<UpdateRolePermissionsInput> {
  if (!input || typeof input !== 'object') {
    return { success: false, error: 'Request body must be an object.' };
  }

  const body = input as Record<string, unknown>;

  if (!Array.isArray(body.permissions)) {
    return { success: false, error: 'Permissions must be an array.' };
  }

  const permissions: Permission[] = [];

  for (const permission of body.permissions) {
    if (typeof permission !== 'string' || !PERMISSION_SET.has(permission)) {
      return {
        success: false,
        error: `Invalid permission: ${String(permission)}`,
      };
    }
    permissions.push(permission as Permission);
  }

  return {
    success: true,
    data: { permissions: Array.from(new Set(permissions)) },
  };
}
