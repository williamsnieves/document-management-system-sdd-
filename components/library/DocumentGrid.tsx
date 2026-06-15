'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  FileType2,
} from 'lucide-react';

import { formatRelativeDate } from '@/lib/documents/format';
import type { Document, Owner } from '@/lib/documents/types';
import { CATEGORY_LABELS } from '@/lib/documents/types';

import styles from './DocumentGrid.module.css';

interface DocumentGridProps {
  documents: Document[];
  owners: Record<string, Owner>;
}

function FileIcon({ fileType }: { fileType: Document['fileType'] }) {
  const props = { size: 24, 'aria-hidden': true as const };
  if (fileType === 'pdf') return <FileText {...props} className={styles.iconPdf} />;
  if (fileType === 'xlsx') {
    return <FileSpreadsheet {...props} className={styles.iconXlsx} />;
  }
  return <FileType2 {...props} className={styles.iconDocx} />;
}

export function DocumentGrid({ documents, owners }: DocumentGridProps) {
  return (
    <div className={styles.grid}>
      {documents.map((doc) => {
        const owner = owners[doc.ownerId];
        return (
          <Link
            key={doc.id}
            href={`/documents/${doc.id}`}
            className={styles.card}
          >
            <div className={styles.iconWrap}>
              <FileIcon fileType={doc.fileType} />
            </div>
            <h3 className={styles.title}>{doc.name}</h3>
            <p className={styles.meta}>
              {doc.documentId} • {CATEGORY_LABELS[doc.category].split(' ')[0]}
            </p>
            <div className={styles.footer}>
              <span
                className={styles.avatar}
                style={{ background: owner?.avatarColor ?? '#6b7280' }}
                aria-hidden
              >
                {owner?.initials ?? '?'}
              </span>
              <span className={styles.ownerName}>{owner?.name ?? 'Unknown'}</span>
              <span className={styles.version}>
                v{doc.currentVersion}
                {doc.hasVersionWarning && (
                  <AlertTriangle size={12} className={styles.warning} aria-hidden />
                )}
              </span>
            </div>
            <span className={styles.date}>{formatRelativeDate(doc.updatedAt)}</span>
          </Link>
        );
      })}
    </div>
  );
}
