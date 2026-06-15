import Link from 'next/link';

import type { FeaturedDocument } from '@/lib/dashboard/types';

import styles from './DocumentLifecycleTimeline.module.css';

interface DocumentLifecycleTimelineProps {
  document: FeaturedDocument;
}

const DOT_CLASS = {
  complete: styles.dotComplete,
  current: styles.dotCurrent,
  pending: styles.dotPending,
  conflict: styles.dotConflict,
} as const;

export function DocumentLifecycleTimeline({
  document,
}: DocumentLifecycleTimelineProps) {
  return (
    <section className={styles.panel} aria-label="Critical document lifecycle">
      <div className={styles.header}>
        <h2 className={styles.heading}>Critical Document Lifecycle</h2>
        <Link href={`/documents/${document.id}`} className={styles.docLink}>
          {document.name}
        </Link>
      </div>
      <div className={styles.timeline}>
        <div className={styles.track} aria-hidden />
        <ol className={styles.milestones}>
          {document.milestones.map((milestone, index) => (
            <li key={`${milestone.version}-${index}`} className={styles.milestone}>
              <span
                className={`${styles.dot} ${DOT_CLASS[milestone.status]}`}
                aria-hidden
              />
              <div className={styles.milestoneContent}>
                <span className={styles.version}>{milestone.version}</span>
                <span className={styles.label}>{milestone.label}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
