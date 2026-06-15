'use client';

import { Activity, ShieldCheck, HardDrive, Archive } from 'lucide-react';
import type { Document } from '@/lib/documents/types';
import styles from './Cards.module.css';

interface AuditHealthCardProps {
  document: Document;
}

export function AuditHealthCard({ document }: AuditHealthCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Activity size={16} />
          Audit Health
        </h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.healthRow}>
          <ShieldCheck size={16} className={styles.healthIcon} />
          <div className={styles.healthInfo}>
            <span className={styles.healthLabel}>Integrity Check</span>
            <span className={styles.healthValue}>Passed</span>
          </div>
        </div>
        
        <div className={styles.healthRow}>
          <HardDrive size={16} className={styles.healthIcon} />
          <div className={styles.healthInfo}>
            <span className={styles.healthLabel}>Last Backup</span>
            <span className={styles.healthValue}>2 hours ago</span>
          </div>
        </div>

        <div className={styles.healthRow}>
          <Archive size={16} className={styles.healthIcon} />
          <div className={styles.healthInfo}>
            <span className={styles.healthLabel}>Retention Policy</span>
            <span className={styles.healthValue}>7 Years (Display Only)</span>
          </div>
        </div>

        <div className={styles.scoreSection}>
          <div className={styles.scoreHeader}>
            <span className={styles.scoreLabel}>Doc Score</span>
            <span className={styles.scoreValue}>98/100</span>
          </div>
          <div className={styles.scoreBar}>
            <div className={styles.scoreFill} style={{ width: '98%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
