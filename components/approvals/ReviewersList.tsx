import { Check } from 'lucide-react';
import type { WorkflowReviewer } from '@/lib/approvals/types';
import styles from './ReviewersList.module.css';

interface ReviewersListProps {
  reviewers: WorkflowReviewer[];
  currentUserId: string;
}

export function ReviewersList({ reviewers, currentUserId }: ReviewersListProps) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>Required Reviewers</h3>
      <ul className={styles.list}>
        {reviewers.map((reviewer) => {
          const isCurrentUser = reviewer.userId === currentUserId;

          return (
            <li key={reviewer.id} className={styles.item}>
              <div
                className={styles.avatar}
                style={{ backgroundColor: reviewer.avatarColor }}
              >
                {reviewer.status === 'approved' ? (
                  <Check size={14} className={styles.checkIcon} />
                ) : (
                  reviewer.initials
                )}
              </div>

              <div className={styles.info}>
                <div className={styles.nameRow}>
                  <span className={styles.name}>
                    {reviewer.name}
                    {isCurrentUser && (
                      <span className={styles.youLabel}> (You)</span>
                    )}
                  </span>
                  <span
                    className={
                      reviewer.status === 'approved'
                        ? styles.statusApproved
                        : reviewer.status === 'pending'
                          ? styles.statusPending
                          : styles.statusUpcoming
                    }
                  >
                    {reviewer.status === 'approved'
                      ? 'Approved'
                      : reviewer.status === 'pending'
                        ? 'Pending'
                        : 'Upcoming'}
                  </span>
                </div>
                <span className={styles.title}>{reviewer.title}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
