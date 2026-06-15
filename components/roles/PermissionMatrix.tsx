'use client';

import { FileText, GitBranch, Shield } from 'lucide-react';
import {
  PERMISSION_CATEGORIES,
  type Permission,
  type PermissionCategoryId,
} from '@/lib/auth/permissions';
import type { RoleDetail } from '@/lib/roles/types';
import styles from './PermissionMatrix.module.css';

interface PermissionMatrixProps {
  role: RoleDetail | null;
  draftPermissions: Permission[];
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onTogglePermission: (permission: Permission, checked: boolean) => void;
  onCancel: () => void;
  onSave: () => void;
}

const CATEGORY_ICONS: Record<PermissionCategoryId, typeof FileText> = {
  document_access: FileText,
  workflow: GitBranch,
  administration: Shield,
};

export function PermissionMatrix({
  role,
  draftPermissions,
  hasUnsavedChanges,
  isSaving,
  onTogglePermission,
  onCancel,
  onSave,
}: PermissionMatrixProps) {
  if (!role) {
    return (
      <section className={styles.panel}>
        <p className={styles.emptyState}>
          Select a role to view and edit its permissions.
        </p>
      </section>
    );
  }

  const permissionSet = new Set(draftPermissions);

  return (
    <section className={styles.panel} aria-label="Permission matrix">
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{role.name}</h2>
            <span className={styles.badge}>
              {role.isSystem ? 'System Role' : 'Custom Role'}
            </span>
          </div>
          <p className={styles.description}>{role.description}</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={!hasUnsavedChanges || isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveButton}
            onClick={onSave}
            disabled={!hasUnsavedChanges || isSaving}
          >
            {isSaving ? 'Saving…' : 'Save Permissions'}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {PERMISSION_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id];

          return (
            <section key={category.id} className={styles.category}>
              <div className={styles.categoryHeader}>
                <Icon className={styles.categoryIcon} size={16} aria-hidden />
                <h3 className={styles.categoryTitle}>{category.label}</h3>
              </div>

              <div className={styles.permissionList}>
                {category.permissions.map((permission) => {
                  const checked = permissionSet.has(permission.id);
                  const inputId = `${role.id}-${permission.id}`;

                  return (
                    <div
                      key={permission.id}
                      className={
                        permission.reservedNote
                          ? `${styles.permissionItem} ${styles.permissionItemReserved}`
                          : styles.permissionItem
                      }
                    >
                      <input
                        id={inputId}
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          onTogglePermission(
                            permission.id,
                            event.target.checked,
                          )
                        }
                        className={styles.checkbox}
                        aria-label={permission.label}
                      />
                      <div className={styles.permissionContent}>
                        <label htmlFor={inputId} className={styles.permissionLabel}>
                          {permission.label}
                        </label>
                        <p className={styles.permissionDescription}>
                          {permission.description}
                        </p>
                        {permission.reservedNote ? (
                          <p className={styles.reservedNote}>
                            {permission.reservedNote}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
