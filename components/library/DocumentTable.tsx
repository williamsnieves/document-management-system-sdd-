'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  FileType2,
} from 'lucide-react';

import {
  formatAbsoluteDate,
  formatRelativeDate,
} from '@/lib/documents/format';
import type { Document, Owner } from '@/lib/documents/types';
import { CATEGORY_LABELS } from '@/lib/documents/types';

import styles from './DocumentTable.module.css';

interface DocumentTableProps {
  documents: Document[];
  owners: Record<string, Owner>;
}

function FileIcon({ fileType }: { fileType: Document['fileType'] }) {
  const props = { size: 18, 'aria-hidden': true as const };
  if (fileType === 'pdf') return <FileText {...props} className={styles.iconPdf} />;
  if (fileType === 'xlsx') {
    return <FileSpreadsheet {...props} className={styles.iconXlsx} />;
  }
  return <FileType2 {...props} className={styles.iconDocx} />;
}

export function DocumentTable({ documents, owners }: DocumentTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Document Name</th>
            <th scope="col">Owner</th>
            <th scope="col">Last Modified</th>
            <th scope="col">Version</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => {
            const owner = owners[doc.ownerId];
            return (
              <tr key={doc.id} className={styles.row}>
                <td>
                  <Link href={`/documents/${doc.id}`} className={styles.nameCell}>
                    <FileIcon fileType={doc.fileType} />
                    <span className={styles.nameBlock}>
                      <span className={styles.name}>{doc.name}</span>
                      <span className={styles.meta}>
                        {doc.documentId} • {CATEGORY_LABELS[doc.category].split(' ')[0]}
                      </span>
                    </span>
                  </Link>
                </td>
                <td>
                  <div className={styles.owner}>
                    <span
                      className={styles.avatar}
                      style={{ background: owner?.avatarColor ?? '#6b7280' }}
                      aria-hidden
                    >
                      {owner?.initials ?? '?'}
                    </span>
                    <span>{owner?.name ?? 'Unknown'}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.dateCell}>
                    <span>{formatAbsoluteDate(doc.updatedAt)}</span>
                    <span className={styles.relative}>
                      {formatRelativeDate(doc.updatedAt)}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={styles.versionBadge}>
                    v{doc.currentVersion}
                    {doc.hasVersionWarning && (
                      <AlertTriangle
                        size={14}
                        className={styles.warning}
                        aria-label="Version warning"
                      />
                    )}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
