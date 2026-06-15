'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Permission } from '@/lib/auth/permissions';
import type { RoleDetail, RoleListItem } from '@/lib/roles/types';
import { CreateRoleDialog } from './CreateRoleDialog';
import { PermissionMatrix } from './PermissionMatrix';
import { RolesList } from './RolesList';
import { UnsavedChangesBar } from './UnsavedChangesBar';
import styles from './RoleManagementPage.module.css';

function permissionsEqual(left: Permission[], right: Permission[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const leftSet = new Set(left);
  return right.every((permission) => leftSet.has(permission));
}

export function RoleManagementPage() {
  const [roles, setRoles] = useState<RoleListItem[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDetail | null>(null);
  const [savedPermissions, setSavedPermissions] = useState<Permission[]>([]);
  const [draftPermissions, setDraftPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasUnsavedChanges = useMemo(
    () => !permissionsEqual(savedPermissions, draftPermissions),
    [draftPermissions, savedPermissions],
  );

  const loadRoles = useCallback(async () => {
    const response = await fetch('/api/roles');
    if (!response.ok) {
      throw new Error('Failed to load roles.');
    }

    const data = (await response.json()) as { roles: RoleListItem[] };
    setRoles(data.roles);
    return data.roles;
  }, []);

  const loadRoleDetail = useCallback(async (roleId: string) => {
    const response = await fetch(`/api/roles/${roleId}`);
    if (!response.ok) {
      throw new Error('Failed to load role details.');
    }

    const data = (await response.json()) as { role: RoleDetail };
    setSelectedRole(data.role);
    setSavedPermissions(data.role.permissions);
    setDraftPermissions(data.role.permissions);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedRoles = await loadRoles();

        if (cancelled) {
          return;
        }

        const initialRoleId = loadedRoles[0]?.id ?? null;
        setSelectedRoleId(initialRoleId);

        if (initialRoleId) {
          await loadRoleDetail(initialRoleId);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load role management data.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [loadRoleDetail, loadRoles]);

  const handleSelectRole = async (roleId: string) => {
    if (roleId === selectedRoleId) {
      return;
    }

    try {
      setError(null);
      setSelectedRoleId(roleId);
      await loadRoleDetail(roleId);
    } catch (selectError) {
      setError(
        selectError instanceof Error
          ? selectError.message
          : 'Failed to load role details.',
      );
    }
  };

  const handleTogglePermission = (permission: Permission, checked: boolean) => {
    setDraftPermissions((current) => {
      if (checked) {
        return current.includes(permission)
          ? current
          : [...current, permission];
      }

      return current.filter((item) => item !== permission);
    });
  };

  const handleReset = () => {
    setDraftPermissions(savedPermissions);
  };

  const handleSave = async () => {
    if (!selectedRoleId || !hasUnsavedChanges) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch(
        `/api/roles/${selectedRoleId}/permissions`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissions: draftPermissions }),
        },
      );

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? 'Failed to save permissions.');
      }

      const data = (await response.json()) as { role: RoleDetail };
      setSelectedRole(data.role);
      setSavedPermissions(data.role.permissions);
      setDraftPermissions(data.role.permissions);
      await loadRoles();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Failed to save permissions.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRole = async (input: {
    name: string;
    description: string;
  }) => {
    setIsCreating(true);

    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? 'Failed to create role.');
      }

      const data = (await response.json()) as { role: RoleDetail };
      const refreshedRoles = await loadRoles();
      setRoles(refreshedRoles);
      setSelectedRoleId(data.role.id);
      setSelectedRole(data.role);
      setSavedPermissions(data.role.permissions);
      setDraftPermissions(data.role.permissions);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <p className={styles.loading}>Loading role management…</p>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Role Management</h1>
          <p className={styles.subtitle}>
            Define organizational hierarchy and granular document access levels.
            Changes here affect audit paths and system-wide visibility.
          </p>
        </div>
        <button
          type="button"
          className={styles.createButton}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create New Role
        </button>
      </header>

      {error ? <p className={styles.errorBanner}>{error}</p> : null}

      <div className={styles.grid}>
        <RolesList
          roles={roles}
          selectedRoleId={selectedRoleId}
          onSelectRole={(roleId) => void handleSelectRole(roleId)}
        />

        <div className={styles.matrixWrapper}>
          <PermissionMatrix
            role={selectedRole}
            draftPermissions={draftPermissions}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
            onTogglePermission={handleTogglePermission}
            onCancel={handleReset}
            onSave={() => void handleSave()}
          />
          <UnsavedChangesBar
            visible={hasUnsavedChanges}
            isSaving={isSaving}
            onReset={handleReset}
            onSync={() => void handleSave()}
          />
        </div>
      </div>

      <CreateRoleDialog
        open={isCreateDialogOpen}
        isSubmitting={isCreating}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRole}
      />
    </div>
  );
}
