import { CheckCircle2, Link2, Shield } from 'lucide-react';

import type { SystemStatus } from '@/lib/dashboard/types';

import styles from './SystemStatusPanel.module.css';

interface SystemStatusPanelProps {
  status: SystemStatus;
}

export function SystemStatusPanel({ status }: SystemStatusPanelProps) {
  return (
    <section className={styles.panel} aria-label="System status">
      <h2 className={styles.heading}>System Status</h2>
      <div className={styles.operational}>
        <span
          className={`${styles.dot} ${status.operational ? styles.dotGreen : styles.dotRed}`}
          aria-hidden
        />
        <span className={styles.operationalText}>
          {status.operational
            ? 'All systems operational'
            : 'System issues detected'}
        </span>
      </div>
      <ul className={styles.indicators}>
        <li className={styles.indicator}>
          <Shield size={16} aria-hidden />
          <span>Encryption Engine</span>
          <span className={styles.indicatorValue}>
            {status.encryption === 'active' ? 'Active' : 'Inactive'}
          </span>
        </li>
        <li className={styles.indicator}>
          <Link2 size={16} aria-hidden />
          <span>Blockchain Audit</span>
          <span className={styles.indicatorValue}>
            {status.blockchainAudit === 'verified' ? 'Verified' : 'Pending'}
          </span>
        </li>
      </ul>
      <div className={styles.banner} aria-hidden>
        <CheckCircle2 size={24} className={styles.bannerIcon} />
      </div>
    </section>
  );
}
