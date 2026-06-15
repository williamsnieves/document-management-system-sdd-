'use client';

import { Pencil } from 'lucide-react';
import type { RoleListItem } from '@/lib/roles/types';
import styles from './RolesList.module.css';

interface RolesListProps {
  roles: RoleListItem[];
  selectedRoleId: string | null;
  onSelectRole: (roleId: string) => void;
}

export function RolesList({
  roles,
  selectedRoleId,
  onSelectRole,
}: RolesListProps) {
  return (
    <section className={styles.panel} aria-label="System roles">
      <div className={styles.header}>
        <h2 className={styles.title}>System Roles</h2>
        <span className={styles.badge}>{roles.length} Total</span>
      </div>

      <div className={styles.list} role="listbox" aria-label="Role list">
        {roles.length === 0 ? (
          <p className={styles.emptyState}>No roles configured yet.</p>
        ) : (
          roles.map((role) => {
            const isSelected = role.id === selectedRoleId;

            return (
              <button
                key={role.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={
                  isSelected
                    ? `${styles.roleItem} ${styles.roleItemSelected}`
                    : styles.roleItem
                }
                onClick={() => onSelectRole(role.id)}
              >
                <div className={styles.roleContent}>
                  <p className={styles.roleName}>{role.name}</p>
                  <p className={styles.roleDescription}>{role.description}</p>
                  <p className={styles.userCount}>
                    {role.userCount} {role.userCount === 1 ? 'User' : 'Users'}
                  </p>
                </div>
                <Pencil
                  className={styles.editIcon}
                  size={16}
                  aria-hidden="true"
                />
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}
