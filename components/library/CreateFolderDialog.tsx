'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@base-ui/react/button';

import { getCurrentUser } from '@/lib/auth/middleware';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { hasPermission } from '@/lib/roles/hasPermission';

import styles from './CreateFolderDialog.module.css';

interface CreateFolderDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateFolderDialog({ open, onClose }: CreateFolderDialogProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canCreate = hasPermission(getCurrentUser(), PERMISSIONS.UPLOAD);

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!canCreate) {
      setError('Permission denied.');
      return;
    }
    if (!name.trim()) {
      setError('Folder name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Failed to create folder.');
        setSaving(false);
        return;
      }
      setSaving(false);
      handleClose();
    } catch {
      setError('Network error. Please try again.');
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && handleClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Create Folder</Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close">
              <X size={18} />
            </Dialog.Close>
          </div>

          <label className={styles.field}>
            <span>Folder name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Enter folder name"
              disabled={!canCreate || saving}
            />
          </label>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <div className={styles.actions}>
            <Button type="button" className={styles.cancelBtn} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={saving || !canCreate}
            >
              {saving ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
