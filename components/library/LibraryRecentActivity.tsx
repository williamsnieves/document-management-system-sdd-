'use client';

import Link from 'next/link';

import { formatActivityTime } from '@/lib/documents/format';
import type { ActivityEvent } from '@/lib/documents/types';

import styles from './LibraryRecentActivity.module.css';

interface LibraryRecentActivityProps {
  events: ActivityEvent[];
}

function activityLabel(event: ActivityEvent): string {
  switch (event.type) {
    case 'approval':
      return 'approved';
    case 'review_request':
      return 'requested review for';
    case 'upload':
      return 'uploaded';
    case 'edit':
      return 'edited';
    default:
      return 'updated';
  }
}

export function LibraryRecentActivity({ events }: LibraryRecentActivityProps) {
  return (
    <section className={styles.panel} aria-label="Recent activity">
      <div className={styles.header}>
        <h2 className={styles.heading}>Recent Activity</h2>
        <Link href="/audit" className={styles.viewAll}>
          View All
        </Link>
      </div>
      <ul className={styles.list}>
        {events.map((event) => (
          <li
            key={event.id}
            className={`${styles.item} ${styles[event.type]}`}
          >
            <p className={styles.text}>
              <strong>{event.userName}</strong> {activityLabel(event)}{' '}
              <Link href={`/documents/${event.documentId}`} className={styles.docLink}>
                {event.documentName}
              </Link>
            </p>
            <time className={styles.time} dateTime={event.timestamp}>
              {formatActivityTime(event.timestamp)}
            </time>
          </li>
        ))}
      </ul>
    </section>
  );
}
