import { PERMISSIONS } from '@/lib/auth/permissions';
import {
  createDefaultRoles,
  createDefaultUserRoles,
  DEFAULT_ROLE_IDS,
} from './seed';
import type {
  CreateRoleInput,
  Role,
  RoleDetail,
  RoleListItem,
  UserRole,
} from './types';

function createRoleId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const DEFAULT_CUSTOM_ROLE_PERMISSIONS = [
  PERMISSIONS.VIEW_DOCUMENTS,
  PERMISSIONS.UPLOAD,
];

class RoleStore {
  private roles: Map<string, Role> = new Map();
  private userRoles: UserRole[] = [];

  constructor() {
    this.reset();
  }

  reset(): void {
    this.roles.clear();
    this.userRoles = [];

    for (const role of createDefaultRoles()) {
      this.roles.set(role.id, { ...role });
    }

    this.userRoles = createDefaultUserRoles();
  }

  listRoles(): RoleListItem[] {
    return Array.from(this.roles.values())
      .map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
        userCount: this.getUserCount(role.id),
      }))
      .sort((left, right) => {
        if (left.isSystem !== right.isSystem) {
          return left.isSystem ? -1 : 1;
        }
        return left.name.localeCompare(right.name);
      });
  }

  getRoleById(id: string): RoleDetail | null {
    const role = this.roles.get(id);
    if (!role) {
      return null;
    }

    return {
      ...role,
      userCount: this.getUserCount(role.id),
    };
  }

  getRolesByIds(ids: string[]): Role[] {
    return ids
      .map((id) => this.roles.get(id))
      .filter((role): role is Role => Boolean(role));
  }

  getUserCount(roleId: string): number {
    return this.userRoles.filter((assignment) => assignment.roleId === roleId)
      .length;
  }

  getUserRoles(userId: string): UserRole[] {
    return this.userRoles.filter((assignment) => assignment.userId === userId);
  }

  createRole(input: CreateRoleInput): Role {
    const now = new Date().toISOString();
    const role: Role = {
      id: `role-${createRoleId()}`,
      name: input.name,
      description: input.description,
      isSystem: false,
      permissions: [...DEFAULT_CUSTOM_ROLE_PERMISSIONS],
      createdAt: now,
      updatedAt: now,
    };

    this.roles.set(role.id, role);
    return role;
  }

  updateRolePermissions(id: string, permissions: Role['permissions']): Role | null {
    const role = this.roles.get(id);
    if (!role) {
      return null;
    }

    const updatedRole: Role = {
      ...role,
      permissions: [...permissions],
      updatedAt: new Date().toISOString(),
    };

    this.roles.set(id, updatedRole);
    return updatedRole;
  }

  isGlobalAdminRole(roleId: string): boolean {
    return roleId === DEFAULT_ROLE_IDS.globalAdmin;
  }
}

const globalStore = globalThis as typeof globalThis & {
  __lexvaultRoleStore?: RoleStore;
};

export function getRoleStore(): RoleStore {
  if (!globalStore.__lexvaultRoleStore) {
    globalStore.__lexvaultRoleStore = new RoleStore();
  }

  return globalStore.__lexvaultRoleStore;
}

export { DEFAULT_ROLE_IDS };
