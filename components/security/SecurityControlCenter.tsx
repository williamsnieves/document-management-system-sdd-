'use client';

import { useState, useEffect } from 'react';
import { Button } from '@base-ui/react/button';
import Link from 'next/link';
import { AuthenticationCard } from './AuthenticationCard';
import { EncryptionCard } from './EncryptionCard';
import { IpWhitelistingCard } from './IpWhitelistingCard';
import { SsoCard } from './SsoCard';
import type { SecurityPolicy } from '@/lib/security/types';
import styles from './SecurityControlCenter.module.css';

export function SecurityControlCenter() {
  const [policy, setPolicy] = useState<SecurityPolicy | null>(null);
  const [stagedPolicy, setStagedPolicy] = useState<SecurityPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/security/policy')
      .then((res) => res.json())
      .then((data) => {
        setPolicy(data);
        setStagedPolicy(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!stagedPolicy) return;
    setSaving(true);
    try {
      const res = await fetch('/api/security/policy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stagedPolicy),
      });
      if (res.ok) {
        const updated = await res.json();
        setPolicy(updated);
        setStagedPolicy(updated);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setStagedPolicy(policy);
  };

  if (loading || !stagedPolicy) {
    return <div className={styles.loading}>Loading security policy...</div>;
  }

  const isDirty = JSON.stringify(policy) !== JSON.stringify(stagedPolicy);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Security Control Center</h1>
        <p className={styles.subtitle}>
          Configure organization-wide authentication, cryptographic, and SSO policies.
        </p>
      </header>

      <div className={styles.grid}>
        <AuthenticationCard
          policy={stagedPolicy}
          onChange={(updates) => setStagedPolicy({ ...stagedPolicy, ...updates })}
        />
        <EncryptionCard
          policy={stagedPolicy}
          onRotateKeys={(newDate) =>
            setStagedPolicy({ ...stagedPolicy, lastKeyRotation: newDate })
          }
        />
        <IpWhitelistingCard
          policy={stagedPolicy}
          onChange={(updates) => setStagedPolicy({ ...stagedPolicy, ...updates })}
        />
        <SsoCard policy={stagedPolicy} />
      </div>

      <footer className={styles.footer}>
        <div className={styles.auditInfo}>
          <span className={styles.statusDot}></span>
          <span>
            Security changes are recorded in the{' '}
            <Link href="/audit-log" className={styles.auditLink}>
              Immutable Audit Log
            </Link>
          </span>
        </div>
        <div className={styles.actions}>
          <Button
            className={styles.cancelButton}
            disabled={!isDirty || saving}
            onClick={handleCancel}
          >
            Cancel Changes
          </Button>
          <Button
            className={styles.saveButton}
            disabled={!isDirty || saving}
            onClick={handleSave}
          >
            {saving ? 'Saving...' : 'Save Security Policy'}
          </Button>
        </div>
      </footer>
    </div>
  );
}
