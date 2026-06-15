'use client';

import { useState } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import styles from './CreateRoleDialog.module.css';

interface CreateRoleDialogProps {
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: { name: string; description: string }) => Promise<void>;
}

export function CreateRoleDialog({
  open,
  isSubmitting,
  onOpenChange,
  onSubmit,
}: CreateRoleDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setError(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Role name is required.');
      return;
    }

    if (!description.trim()) {
      setError('Role description is required.');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
      });
      resetForm();
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Failed to create role.',
      );
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.overlay} />
        <Dialog.Popup className={styles.popup}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Create New Role</Dialog.Title>
            <Dialog.Description className={styles.description}>
              Define a custom role with a name and description. Default document
              access permissions will be applied and can be edited after creation.
            </Dialog.Description>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="role-name" className={styles.label}>
                Role Name
              </label>
              <input
                id="role-name"
                className={styles.input}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Contract Reviewer"
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="role-description" className={styles.label}>
                Description
              </label>
              <textarea
                id="role-description"
                className={styles.textarea}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the responsibilities for this role."
                disabled={isSubmitting}
              />
            </div>

            {error ? <p className={styles.error}>{error}</p> : null}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating…' : 'Create Role'}
              </button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
