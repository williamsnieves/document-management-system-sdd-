'use client';

import { useState } from 'react';
import { Paperclip } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import type { WorkflowEvent } from '@/lib/approvals/types';
import styles from './ActivityTimeline.module.css';

interface ActivityTimelineProps {
  events: WorkflowEvent[];
  canComment: boolean;
  onAddComment: (comment: string, attachmentName?: string) => Promise<void>;
}

function formatEventTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function eventLabel(type: WorkflowEvent['type']): string {
  switch (type) {
    case 'submission':
      return 'submitted the document';
    case 'approval':
      return 'approved the document';
    case 'rejection':
      return 'rejected the document';
    case 'request_changes':
      return 'requested changes';
    default:
      return 'commented';
  }
}

export function ActivityTimeline({
  events,
  canComment,
  onAddComment,
}: ActivityTimelineProps) {
  const [comment, setComment] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await onAddComment(comment.trim(), attachmentName);
      setComment('');
      setAttachmentName(undefined);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAttach = () => {
    setAttachmentName('review-attachment.pdf');
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Activity &amp; Comments</h3>

      <ul className={styles.timeline}>
        {sortedEvents.map((event) => (
          <li key={event.id} className={styles.event}>
            <div className={styles.dot} />
            <div className={styles.eventBody}>
              <p className={styles.eventSummary}>
                <strong>{event.userName}</strong> {eventLabel(event.type)}
              </p>
              <time className={styles.eventTime}>
                {formatEventTime(event.timestamp)}
              </time>
              {event.comment && (
                <p className={styles.eventComment}>{event.comment}</p>
              )}
              {event.attachmentName && (
                <span className={styles.attachment}>
                  <Paperclip size={12} />
                  {event.attachmentName}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {canComment && (
        <div className={styles.commentBox}>
          <textarea
            className={styles.textarea}
            placeholder="Add a comment or internal note..."
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={3}
          />
          <div className={styles.commentFooter}>
            <button
              type="button"
              className={styles.attachLink}
              onClick={handleAttach}
            >
              <Paperclip size={14} />
              Attach File
              {attachmentName && `: ${attachmentName}`}
            </button>
            <Button
              className={styles.submitCommentBtn}
              onClick={handleSubmit}
              disabled={!comment.trim() || submitting}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
