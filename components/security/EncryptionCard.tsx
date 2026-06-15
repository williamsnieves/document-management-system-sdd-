'use client';

import { useState } from 'react';
import { Button } from '@base-ui/react/button';
import { Dialog } from '@base-ui/react/dialog';
import type { SecurityPolicy } from '@/lib/security/types';
import styles from './Card.module.css';

interface Props {
  policy: SecurityPolicy;
  onRotateKeys: (newDate: string) => void;
}

export function EncryptionCard({ policy, onRotateKeys }: Props) {
  const [isRotating, setIsRotating] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleRotate = async () => {
    setIsRotating(true);
    try {
      const res = await fetch('/api/security/rotate-keys', { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        onRotateKeys(updated.lastKeyRotation);
        setShowWarning(false);
      }
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Encryption</h2>
        <p className={styles.description}>Manage cryptographic settings.</p>
      </div>
      <div className={styles.content}>
        <div className={styles.statusBox}>
          <div className={styles.statusHeader}>
            <span className={styles.shieldIcon}>🛡️</span>
            <span className={styles.statusText}>
              {policy.encryptionEnabled ? 'AES-256 Enabled' : 'Encryption Disabled'}
            </span>
          </div>
          <p className={styles.lastRotation}>
            Last key rotation: {new Date(policy.lastKeyRotation).toLocaleString()}
          </p>
        </div>

        <Button className={styles.actionButton} onClick={() => setShowWarning(true)}>
          Rotate Keys
        </Button>

        <Dialog.Root open={showWarning} onOpenChange={setShowWarning}>
          <Dialog.Portal>
            <Dialog.Backdrop className={styles.dialogBackdrop} />
            <Dialog.Popup className={styles.dialogPopup}>
              <h3 className={styles.dialogTitle}>Warning: Key Rotation</h3>
              <p className={styles.dialogDescription}>
                Rotating encryption keys will invalidate all active session tokens and require a re-index of encrypted data. This may cause temporary disruption.
              </p>
              <div className={styles.dialogActions}>
                <Button className={styles.cancelButton} onClick={() => setShowWarning(false)}>
                  Cancel
                </Button>
                <Button
                  className={styles.dangerButton}
                  onClick={handleRotate}
                  disabled={isRotating}
                >
                  {isRotating ? 'Rotating...' : 'Confirm Rotation'}
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
