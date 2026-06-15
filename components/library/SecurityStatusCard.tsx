'use client';

import { Button } from '@base-ui/react/button';
import { ShieldCheck } from 'lucide-react';

import styles from './SecurityStatusCard.module.css';

export function SecurityStatusCard() {
  return (
    <aside className={styles.card} aria-label="Security status">
      <div className={styles.hero}>
        <ShieldCheck size={32} className={styles.icon} aria-hidden />
        <p className={styles.status}>Vault Status: Secure</p>
      </div>
      <p className={styles.description}>
        All documents are encrypted using 256-bit AES protocol. Active audit
        trails are monitoring all access points.
      </p>
      <Button className={styles.button} type="button">
        Security Report
      </Button>
    </aside>
  );
}
