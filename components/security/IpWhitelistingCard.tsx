'use client';

import { useState } from 'react';
import { Button } from '@base-ui/react/button';
import { Dialog } from '@base-ui/react/dialog';
import type { SecurityPolicy, IpWhitelistEntry } from '@/lib/security/types';
import styles from './Card.module.css';

interface Props {
  policy: SecurityPolicy;
  onChange: (updates: Partial<SecurityPolicy>) => void;
}

export function IpWhitelistingCard({ policy, onChange }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRange, setNewRange] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleRemove = (id: string) => {
    onChange({
      ipWhitelist: policy.ipWhitelist.filter((entry) => entry.id !== id),
    });
  };

  const handleAdd = () => {
    if (!newRange || !newLabel) return;
    
    const newEntry: IpWhitelistEntry = {
      id: `ip-${Date.now()}`,
      range: newRange,
      label: newLabel,
    };

    onChange({
      ipWhitelist: [...policy.ipWhitelist, newEntry],
    });
    
    setNewRange('');
    setNewLabel('');
    setShowAddModal(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>IP Whitelisting</h2>
        <p className={styles.description}>Restrict access to specific IP ranges.</p>
      </div>
      <div className={styles.content}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>IP Range</th>
                <th>Label</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policy.ipWhitelist.length === 0 ? (
                <tr>
                  <td colSpan={3} className={styles.emptyState}>
                    No IP ranges whitelisted.
                  </td>
                </tr>
              ) : (
                policy.ipWhitelist.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.range}</td>
                    <td>{entry.label}</td>
                    <td>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleRemove(entry.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Button className={styles.actionButton} onClick={() => setShowAddModal(true)}>
          + Add Range
        </Button>

        <Dialog.Root open={showAddModal} onOpenChange={setShowAddModal}>
          <Dialog.Portal>
            <Dialog.Backdrop className={styles.dialogBackdrop} />
            <Dialog.Popup className={styles.dialogPopup}>
              <h3 className={styles.dialogTitle}>Add IP Range</h3>
              <div className={styles.dialogForm}>
                <div className={styles.field}>
                  <label className={styles.label}>IP Range (CIDR)</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={newRange}
                    onChange={(e) => setNewRange(e.target.value)}
                    placeholder="e.g. 192.168.1.0/24"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Label</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Corporate Office"
                  />
                </div>
              </div>
              <div className={styles.dialogActions}>
                <Button className={styles.cancelButton} onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button
                  className={styles.saveButton}
                  onClick={handleAdd}
                  disabled={!newRange || !newLabel}
                >
                  Add Range
                </Button>
              </div>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
