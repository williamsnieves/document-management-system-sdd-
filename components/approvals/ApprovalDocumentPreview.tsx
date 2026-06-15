'use client';

import { useState } from 'react';
import {
  Clock,
  Download,
  FileText,
  Maximize2,
  Printer,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@base-ui/react/button';
import type { DocumentAnnotation } from '@/lib/approvals/types';
import type { Version } from '@/lib/documents/types';
import { formatRelativeDate } from '@/lib/documents/format';
import styles from './ApprovalDocumentPreview.module.css';

interface ApprovalDocumentPreviewProps {
  documentId: string;
  name: string;
  fileType: string;
  documentRef: string;
  updatedAt: string;
  modifiedByName: string;
  fileSizeLabel: string;
  version?: Version;
  annotations: DocumentAnnotation[];
}

export function ApprovalDocumentPreview({
  documentId,
  name,
  fileType,
  documentRef,
  updatedAt,
  modifiedByName,
  fileSizeLabel,
  version,
  annotations,
}: ApprovalDocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const displayName = name.includes('.') ? name : `${name}.${fileType}`;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.fileIcon}>
            <FileText size={20} />
          </div>
          <div>
            <h2 className={styles.fileName}>{displayName}</h2>
            <p className={styles.meta}>
              Modified {formatRelativeDate(updatedAt)} by {modifiedByName} •{' '}
              {fileSizeLabel}
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Button
            className={styles.headerBtn}
            onClick={() =>
              window.open(`/api/documents/${documentId}/download`, '_blank')
            }
          >
            <Download size={16} />
            Download
          </Button>
          <Button className={styles.headerBtn}>
            <Clock size={16} />
            History
          </Button>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.controls}>
          <Button
            className={styles.iconBtn}
            onClick={() => setZoom((value) => Math.max(50, value - 10))}
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </Button>
          <span className={styles.zoomText}>{zoom}%</span>
          <Button
            className={styles.iconBtn}
            onClick={() => setZoom((value) => Math.min(200, value + 10))}
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </Button>
        </div>
        <div className={styles.controls}>
          <span className={styles.pageText}>Page 1 of 1</span>
          <div className={styles.divider} />
          <Button className={styles.iconBtn} aria-label="Print">
            <Printer size={18} />
          </Button>
          <Button className={styles.iconBtn} aria-label="Expand">
            <Maximize2 size={18} />
          </Button>
        </div>
      </div>

      <div className={styles.viewer}>
        <div
          className={styles.pdfPage}
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <p className={styles.docLabel}>MASTER SERVICE AGREEMENT</p>
          <p className={styles.docId}>DOC-ID: {documentRef}</p>

          <section className={styles.docSection}>
            <h3>1. Scope of Services</h3>
            <p>
              The Provider shall deliver professional services as outlined in
              Exhibit A, including advisory support, implementation guidance,
              and ongoing compliance monitoring.
            </p>
          </section>

          <section className={styles.docSection}>
            <h3>2. Fees and Payment</h3>
            <p>
              Fees are payable within thirty (30) days of invoice receipt.
              Late payments may incur interest at the prevailing statutory rate.
            </p>
          </section>

          <section className={styles.docSection}>
            <h3>3. Confidentiality</h3>
            <p>
              Both parties agree to maintain the confidentiality of proprietary
              information exchanged under this agreement for a period of five
              years.
            </p>
          </section>

          {annotations.map((annotation) => (
            <aside key={annotation.id} className={styles.callout}>
              <strong>Internal Legal Note</strong>
              {annotation.section && (
                <span className={styles.calloutSection}>
                  ({annotation.section})
                </span>
              )}
              <p>{annotation.content}</p>
            </aside>
          ))}

          <section className={styles.docSection}>
            <h3>4. Liability</h3>
            <p>
              Liability under this agreement is limited to direct damages and
              shall not exceed the total fees paid in the preceding twelve
              months, except where prohibited by law.
            </p>
          </section>

          {version && (
            <p className={styles.versionNote}>
              Version {version.versionNumber}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
