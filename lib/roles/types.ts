import type { Permission } from '@/lib/auth/permissions';

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
}

export interface RoleListItem {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  userCount: number;
}

export interface RoleDetail extends Role {
  userCount: number;
}

export interface CreateRoleInput {
  name: string;
  description: string;
}

export interface UpdateRolePermissionsInput {
  permissions: Permission[];
}
