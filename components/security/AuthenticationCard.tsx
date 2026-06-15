'use client';

import type { SecurityPolicy } from '@/lib/security/types';
import styles from './Card.module.css';

interface Props {
  policy: SecurityPolicy;
  onChange: (updates: Partial<SecurityPolicy>) => void;
}

export function AuthenticationCard({ policy, onChange }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Authentication</h2>
        <p className={styles.description}>Manage 2FA and session timeouts.</p>
      </div>
      <div className={styles.content}>
        <div className={styles.field}>
          <div className={styles.fieldHeader}>
            <label className={styles.label}>Two-Factor Authentication</label>
            <div className={styles.toggle}>
              <input
                type="checkbox"
                checked={policy.twoFactorRequired}
                onChange={(e) => onChange({ twoFactorRequired: e.target.checked })}
              />
              <span>{policy.twoFactorRequired ? 'On' : 'Off'}</span>
            </div>
          </div>
          <p className={styles.helpText}>
            Mandatory for administrator and auditor roles when enabled.
          </p>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Inactivity Timeout (minutes)</label>
          <select
            className={styles.select}
            value={policy.inactivityTimeoutMin}
            onChange={(e) => onChange({ inactivityTimeoutMin: Number(e.target.value) })}
          >
            <option value={5}>5 minutes</option>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Max Session Duration (hours)</label>
          <select
            className={styles.select}
            value={policy.maxSessionHours}
            onChange={(e) => onChange({ maxSessionHours: Number(e.target.value) })}
          >
            <option value={4}>4 hours</option>
            <option value={8}>8 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
          </select>
        </div>
      </div>
    </div>
  );
}
