'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';

import { formatActivityTime } from '@/lib/documents/format';
import type { DashboardActivityRow } from '@/lib/dashboard/types';

import styles from './RecentActivityTable.module.css';

interface RecentActivityTableProps {
  rows: DashboardActivityRow[];
}

const ACTION_BADGE_CLASS: Record<
  DashboardActivityRow['actionType'],
  string
> = {
  new: styles.badgeNew,
  version: styles.badgeVersion,
  uploaded: styles.badgeUploaded,
  conflict: styles.badgeConflict,
  approved: styles.badgeApproved,
  resolved: styles.badgeResolved,
  edit: styles.badgeEdit,
};

export function RecentActivityTable({ rows }: RecentActivityTableProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Recent Activity</h2>
        <Link href="/audit-log" className={styles.viewAll}>
          View All
        </Link>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Document</th>
              <th>Action</th>
              <th>User</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <div className={styles.docCell}>
                    <FileText size={16} className={styles.docIcon} aria-hidden />
                    <div>
                      <Link
                        href={`/documents/${row.documentId}`}
                        className={styles.docName}
                      >
                        {row.documentName}
                      </Link>
                      <div className={styles.tags}>
                        {row.classificationTags.map((tag) => (
                          <span key={tag} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${ACTION_BADGE_CLASS[row.actionType]}`}
                  >
                    {row.action}
                  </span>
                </td>
                <td className={styles.userCell}>{row.userName}</td>
                <td className={styles.timeCell}>
                  <time dateTime={row.timestamp}>
                    {formatActivityTime(row.timestamp)}
                  </time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
