'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import type { ApprovalDetailResponse } from '@/lib/approvals/types';
import type { Version } from '@/lib/documents/types';
import { ActivityTimeline } from './ActivityTimeline';
import { ApprovalActions } from './ApprovalActions';
import { ApprovalDocumentPreview } from './ApprovalDocumentPreview';
import { ReviewersList } from './ReviewersList';
import { WorkflowProgressBar } from './WorkflowProgressBar';
import styles from './ApprovalDetailPage.module.css';

type DetailData = ApprovalDetailResponse & { version?: Version };

export function ApprovalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/approvals/${documentId}`);
      if (response.status === 404) {
        throw new Error('Approval workflow not found.');
      }
      if (!response.ok) {
        throw new Error('Failed to load approval detail.');
      }
      const result = await response.json();
      setData(result);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Failed to load approval detail.',
      );
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const postAction = async (
    action: 'approve' | 'reject' | 'request-changes',
    comment?: string,
  ) => {
    const response = await fetch(`/api/approvals/${documentId}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error ?? 'Action failed.');
    }

    await loadDetail();

    if (action === 'approve' && data?.workflow.status === 'approved') {
      router.push('/approvals');
    }
  };

  const handleAddComment = async (comment: string, attachmentName?: string) => {
    const response = await fetch(`/api/approvals/${documentId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment, attachmentName }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error ?? 'Failed to post comment.');
    }

    await loadDetail();
  };

  if (loading) {
    return <div className={styles.loading}>Loading approval...</div>;
  }

  if (error || !data) {
    return (
      <div className={styles.error}>
        <h2>Unable to load approval</h2>
        <p>{error ?? 'Approval not found.'}</p>
        <Button onClick={() => router.push('/approvals')}>
          Back to Approvals
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumbs}>
        <Link href="/approvals" className={styles.breadcrumbLink}>
          Approvals
        </Link>
        <ChevronRight size={14} className={styles.breadcrumbIcon} />
        <span className={styles.breadcrumbCurrent}>{data.document.name}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.previewColumn}>
          <ApprovalDocumentPreview
            documentId={data.document.id}
            name={data.document.name}
            fileType={data.document.fileType}
            documentRef={data.document.documentId}
            updatedAt={data.document.updatedAt}
            modifiedByName={data.document.modifiedByName}
            fileSizeLabel={data.document.fileSizeLabel}
            version={data.version}
            annotations={data.annotations}
          />
        </div>

        <aside className={styles.sidebar}>
          <WorkflowProgressBar workflow={data.workflow} />
          <ReviewersList
            reviewers={data.workflow.reviewers}
            currentUserId={data.currentUserId}
          />
          <ActivityTimeline
            events={data.events}
            canComment
            onAddComment={handleAddComment}
          />
          <ApprovalActions
            canAct={data.canAct}
            onApprove={(comment) => postAction('approve', comment)}
            onReject={(comment) => postAction('reject', comment)}
            onRequestChanges={(comment) =>
              postAction('request-changes', comment)
            }
          />
        </aside>
      </div>
    </div>
  );
}
