'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, Printer, Maximize2, Download } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import type { Document, Version } from '@/lib/documents/types';
import styles from './DocumentPreview.module.css';

interface DocumentPreviewProps {
  document: Document;
  currentVersion: Version;
}

export function DocumentPreview({ document, currentVersion }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100);

  const isPdf = document.fileType === 'pdf';

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.controls}>
          <Button className={styles.iconBtn} onClick={() => setZoom(z => Math.max(50, z - 10))} aria-label="Zoom out">
            <ZoomOut size={18} />
          </Button>
          <span className={styles.zoomText}>{zoom}%</span>
          <Button className={styles.iconBtn} onClick={() => setZoom(z => Math.min(200, z + 10))} aria-label="Zoom in">
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
        {isPdf ? (
          <div className={styles.pdfPlaceholder} style={{ transform: `scale(${zoom / 100})` }}>
            <div className={styles.pdfPage}>
              <h3>{document.name}</h3>
              <p>Document preview content would render here using react-pdf or an iframe.</p>
              <p>Version: {currentVersion.versionNumber}</p>
            </div>
          </div>
        ) : (
          <div className={styles.unsupportedPlaceholder}>
            <div className={styles.unsupportedContent}>
              <p>Preview not available for {document.fileType.toUpperCase()} files.</p>
              <Button className={styles.downloadBtn} onClick={() => window.open(`/api/documents/${document.id}/download`, '_blank')}>
                <Download size={16} />
                Download to view
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
