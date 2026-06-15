'use client';

import Link from 'next/link';
import { FileText, Folder } from 'lucide-react';

import { formatAuditTimestamp } from '@/lib/audit';
import type { AuditEvent } from '@/lib/audit/types';

import styles from './AuditEventTable.module.css';

interface AuditEventTableProps {
  events: AuditEvent[];
}

const SEVERITY_CLASS = {
  success: styles.badgeSuccess,
  warning: styles.badgeWarning,
  critical: styles.badgeCritical,
} as const;

function ResourceCell({ event }: { event: AuditEvent }) {
  if (event.resourceType === 'multiple') {
    return (
      <span className={styles.resourceMultiple}>{event.resourceLabel}</span>
    );
  }

  const href =
    event.resourceType === 'document'
      ? `/documents/${event.resourceId}`
      : event.resourceType === 'folder'
        ? `/library?folder=${event.resourceId}`
        : undefined;

  const Icon = event.resourceType === 'folder' ? Folder : FileText;

  if (!href) {
    return (
      <span className={styles.resource}>
        <Icon size={14} aria-hidden />
        {event.resourceLabel}
      </span>
    );
  }

  return (
    <Link href={href} className={styles.resourceLink}>
      <Icon size={14} aria-hidden />
      {event.resourceLabel}
    </Link>
  );
}

export function AuditEventTable({ events }: AuditEventTableProps) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Resource</th>
            <th>IP / Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.empty}>
                No audit events match the current filters.
              </td>
            </tr>
          ) : (
            events.map((event) => (
              <tr key={event.id}>
                <td className={styles.timestamp}>
                  {formatAuditTimestamp(event.timestamp)}
                </td>
                <td>
                  <div className={styles.userCell}>
                    <span
                      className={styles.avatar}
                      style={{ backgroundColor: event.userAvatarColor }}
                      aria-hidden
                    >
                      {event.userInitials}
                    </span>
                    <span>{event.userName}</span>
                  </div>
                </td>
                <td>{event.action}</td>
                <td>
                  <ResourceCell event={event} />
                </td>
                <td className={styles.ipCell}>
                  {event.ip}
                  <span className={styles.location}>({event.location})</span>
                </td>
                <td>
                  <span
                    className={`${styles.badge} ${SEVERITY_CLASS[event.severity]}`}
                  >
                    {event.severity.charAt(0).toUpperCase() +
                      event.severity.slice(1)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
