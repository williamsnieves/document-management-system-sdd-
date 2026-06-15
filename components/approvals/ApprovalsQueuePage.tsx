'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import type { ApprovalQueueItem } from '@/lib/approvals/types';
import { formatRelativeDate } from '@/lib/documents/format';
import styles from './ApprovalsQueuePage.module.css';

export function ApprovalsQueuePage() {
  const [queue, setQueue] = useState<ApprovalQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/approvals');
      if (!response.ok) {
        throw new Error('Failed to load approvals queue.');
      }
      const data = await response.json();
      setQueue(data.queue ?? []);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load approvals queue.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Approvals</h1>
          <p className={styles.subtitle}>
            Documents awaiting review in the approval workflow.
          </p>
        </div>
      </header>

      {loading && <p className={styles.status}>Loading approvals...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && queue.length === 0 && (
        <div className={styles.empty}>
          <p>No documents are pending approval.</p>
        </div>
      )}

      {!loading && !error && queue.length > 0 && (
        <div className={styles.list}>
          {queue.map((item) => (
            <Link
              key={item.documentId}
              href={`/approvals/${item.documentId}`}
              className={styles.card}
            >
              <div className={styles.cardIcon}>
                <FileText size={20} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <h2 className={styles.cardTitle}>
                    {item.documentName}.{item.fileType}
                  </h2>
                  {item.isPendingForCurrentUser && (
                    <span className={styles.actionBadge}>Action Required</span>
                  )}
                </div>
                <p className={styles.cardMeta}>
                  {item.documentRef} • {item.ownerName} • Updated{' '}
                  {formatRelativeDate(item.updatedAt)}
                </p>
                <p className={styles.cardStep}>
                  Step {item.currentStep} of {item.totalSteps}:{' '}
                  {item.currentStepLabel} • Pending: {item.pendingReviewerName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
