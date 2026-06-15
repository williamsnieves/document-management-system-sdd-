'use client';

import { useState } from 'react';
import { Clock, Upload, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@base-ui/react/button';
import type { Version, Owner } from '@/lib/documents/types';
import { formatRelativeDate, formatAbsoluteDate } from '@/lib/documents/format';
import { StatusBadge } from './StatusBadge';
import styles from './VersionHistorySidebar.module.css';

interface VersionHistorySidebarProps {
  versions: Version[];
  currentVersionNumber: string;
  owners: Record<string, Owner>;
  onRestore: (versionId: string) => void;
  onUploadNew: () => void;
}

export function VersionHistorySidebar({
  versions,
  currentVersionNumber,
  owners,
  onRestore,
  onUploadNew,
}: VersionHistorySidebarProps) {
  const [showAll, setShowAll] = useState(false);

  const displayVersions = showAll ? versions : versions.slice(0, 5);

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Clock size={16} />
          Version History
        </h3>
        <Button className={styles.uploadBtn} onClick={onUploadNew}>
          <Upload size={14} />
          Upload New
        </Button>
      </div>

      <div className={styles.timeline}>
        {displayVersions.map((version, index) => {
          const isCurrent = version.versionNumber === currentVersionNumber;
          const owner = owners[version.createdBy];
          const isConflictResolved = version.conflictResolved;

          return (
            <div key={version.id} className={`${styles.item} ${isCurrent ? styles.current : ''}`}>
              <div className={styles.marker}>
                <div className={`${styles.dot} ${isCurrent ? styles.dotCurrent : ''} ${isConflictResolved ? styles.dotConflict : ''}`} />
                {index < displayVersions.length - 1 && <div className={styles.line} />}
              </div>
              <div className={styles.content}>
                <div className={styles.itemHeader}>
                  <span className={styles.versionNum}>v{version.versionNumber}</span>
                  {isCurrent && <span className={styles.currentBadge}>CURRENT</span>}
                  {isConflictResolved && <span className={styles.conflictBadge}>CONFLICT RESOLVED</span>}
                </div>
                
                {version.description && <p className={styles.description}>{version.description}</p>}
                
                <div className={styles.meta}>
                  <span className={styles.author}>{owner?.name ?? 'Unknown'}</span>
                  <span className={styles.date} title={formatAbsoluteDate(version.createdAt)}>
                    {formatRelativeDate(version.createdAt)}
                  </span>
                </div>

                {!isCurrent && (
                  <div className={styles.actions}>
                    <Button className={styles.restoreBtn} onClick={() => onRestore(version.id)}>
                      <RotateCcw size={14} />
                      Restore
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {versions.length > 5 && !showAll && (
        <Button className={styles.viewAllBtn} onClick={() => setShowAll(true)}>
          View All {versions.length} Versions
        </Button>
      )}
    </div>
  );
}
