'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import styles from './ApprovalActions.module.css';

interface ApprovalActionsProps {
  canAct: boolean;
  onApprove: (comment?: string) => Promise<void>;
  onReject: (comment?: string) => Promise<void>;
  onRequestChanges: (comment?: string) => Promise<void>;
}

export function ApprovalActions({
  canAct,
  onApprove,
  onReject,
  onRequestChanges,
}: ApprovalActionsProps) {
  const [busy, setBusy] = useState<'approve' | 'reject' | 'changes' | null>(
    null,
  );
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    setBusy('approve');
    try {
      await onApprove();
    } finally {
      setBusy(null);
    }
  };

  const handleReject = async () => {
    setBusy('reject');
    try {
      await onReject(rejectReason.trim() || undefined);
      setShowRejectPrompt(false);
      setRejectReason('');
    } finally {
      setBusy(null);
    }
  };

  const handleRequestChanges = async () => {
    setBusy('changes');
    try {
      await onRequestChanges(rejectReason.trim() || undefined);
      setRejectReason('');
    } finally {
      setBusy(null);
    }
  };

  if (!canAct) {
    return (
      <footer className={styles.footer}>
        <p className={styles.disabledNote}>
          Actions are available only for the current pending reviewer.
        </p>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      {showRejectPrompt && (
        <div className={styles.prompt}>
          <textarea
            className={styles.promptInput}
            placeholder="Optional rejection reason..."
            value={rejectReason}
            onChange={(event) => setRejectReason(event.target.value)}
            rows={2}
          />
          <div className={styles.promptActions}>
            <Button
              className={styles.cancelBtn}
              onClick={() => {
                setShowRejectPrompt(false);
                setRejectReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              className={styles.confirmRejectBtn}
              onClick={handleReject}
              disabled={busy === 'reject'}
            >
              Confirm Reject
            </Button>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button
          className={styles.rejectBtn}
          onClick={() => setShowRejectPrompt(true)}
          disabled={busy !== null}
        >
          <X size={16} />
          REJECT
        </Button>
        <Button
          className={styles.approveBtn}
          onClick={handleApprove}
          disabled={busy !== null}
        >
          <Check size={16} />
          {busy === 'approve' ? 'APPROVING...' : 'APPROVE'}
        </Button>
      </div>

      <button
        type="button"
        className={styles.requestChangesLink}
        onClick={handleRequestChanges}
        disabled={busy !== null}
      >
        {busy === 'changes'
          ? 'Sending request...'
          : 'REQUEST CHANGES & NOTIFY AUTHOR'}
      </button>
    </footer>
  );
}
