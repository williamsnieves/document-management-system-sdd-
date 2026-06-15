'use client';

import styles from './UnsavedChangesBar.module.css';

interface UnsavedChangesBarProps {
  visible: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSync: () => void;
}

export function UnsavedChangesBar({
  visible,
  isSaving,
  onReset,
  onSync,
}: UnsavedChangesBarProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={styles.bar}
      role="status"
      aria-live="polite"
      aria-label="Unsaved permission changes"
    >
      <div className={styles.indicator}>
        <span className={styles.dot} aria-hidden="true" />
        <span>Unsaved Changes</span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.resetButton}
          onClick={onReset}
          disabled={isSaving}
        >
          Reset
        </button>
        <button
          type="button"
          className={styles.syncButton}
          onClick={onSync}
          disabled={isSaving}
        >
          {isSaving ? 'Syncing…' : 'Sync Permissions'}
        </button>
      </div>
    </div>
  );
}
