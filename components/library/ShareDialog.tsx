'use client';

import { useState } from 'react';
import { Share2, X, Copy, Check } from 'lucide-react';
import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@base-ui/react/button';
import type { Document } from '@/lib/documents/types';
import styles from './ShareDialog.module.css';

interface ShareDialogProps {
  document: Document;
  open: boolean;
  onClose: () => void;
}

export function ShareDialog({ document, open, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const handleCopyLink = () => {
    const url = `${window.location.origin}/documents/${document.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/documents/${document.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error('Failed to share', error);
    }
    setEmail('');
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.popup}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>
              <Share2 size={18} />
              Share "{document.name}"
            </Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="Close">
              <X size={18} />
            </Dialog.Close>
          </div>

          <div className={styles.content}>
            <form onSubmit={handleInvite} className={styles.inviteForm}>
              <label className={styles.label}>Invite people</label>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
                <Button type="submit" className={styles.inviteBtn} disabled={!email}>
                  Invite
                </Button>
              </div>
            </form>

            <div className={styles.divider} />

            <div className={styles.linkSection}>
              <label className={styles.label}>Copy link</label>
              <div className={styles.linkBox}>
                <span className={styles.linkText}>
                  {typeof window !== 'undefined' ? `${window.location.origin}/documents/${document.id}` : ''}
                </span>
                <Button type="button" className={styles.copyBtn} onClick={handleCopyLink}>
                  {copied ? <Check size={16} className={styles.successIcon} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
