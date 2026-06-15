'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import styles from '@/components/onboarding/UserOnboarding.module.css';

export default function LaunchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await fetch('/api/onboarding/progress/complete', { method: 'POST' });
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <OnboardingStepper currentStep="launch" />
      
      <div className={styles.card}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>System Access Granted</h1>
          <p className={styles.heroSubtitle}>You have successfully completed all onboarding requirements.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Access Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                <strong>Secure Vault</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Full read/write access</p>
              </div>
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                <strong>Versioning</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Create new versions</p>
              </div>
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                <strong>Audit Logs</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>View activity</p>
              </div>
              <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
                <strong>Signature Rights</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Sign documents</p>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem' }}>Quick Tips</h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>Use the global search bar (Cmd+K) to find documents quickly.</li>
              <li>You can drag and drop files directly into the vault.</li>
              <li>Download the desktop sync client for offline access.</li>
            </ul>
            <button className={styles.button} style={{ marginTop: '1rem' }}>Download Desktop Sync</button>
          </div>
        </div>

        <div className={styles.actions} style={{ justifyContent: 'center' }}>
          <button 
            className={`${styles.button} ${styles.buttonPrimary}`}
            style={{ fontSize: '1.125rem', padding: '1rem 3rem' }}
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? 'Finalizing...' : 'Enter LexVault Dashboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
