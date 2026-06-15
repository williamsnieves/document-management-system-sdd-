'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
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
        <div className={styles.launchHero}>
          <div className={styles.shieldIcon}>
            <ShieldCheck size={32} color="#16a34a" />
          </div>
          <h1 style={{ margin: '0 0 0.75rem', fontSize: '1.75rem' }}>System Access Granted</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem' }}>
            You have successfully completed all onboarding requirements.
          </p>
        </div>

        <div className={styles.twoCol} style={{ marginTop: '2rem' }}>
          <div>
            <h3 style={{ margin: '0 0 1rem' }}>Access Summary</h3>
            <div className={styles.featureGrid}>
              <div className={styles.featureBox}>
                <strong>Secure Vault</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#6b7280' }}>
                  Full read/write access to assigned matters
                </p>
              </div>
              <div className={styles.featureBox}>
                <strong>Versioning</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#6b7280' }}>
                  Create and restore document versions
                </p>
              </div>
              <div className={styles.featureBox}>
                <strong>Audit Logs</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#6b7280' }}>
                  View activity on your documents
                </p>
              </div>
              <div className={styles.featureBox}>
                <strong>Signature Rights</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#6b7280' }}>
                  E-sign compliance documents
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ margin: '0 0 1rem' }}>Quick Tips</h3>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: '#374151' }}>
              <li>Use the global search bar (Cmd+K) to find documents quickly.</li>
              <li>Drag and drop files directly into the vault from your desktop.</li>
              <li>Download the desktop sync client for offline access.</li>
            </ul>
            <button type="button" className={`${styles.button} ${styles.buttonOutline}`} style={{ marginTop: '1rem' }}>
              Download Desktop Sync
            </button>

            <div className={styles.proTip}>
              <strong>Pro Tip:</strong> Pin frequently used folders to your dashboard for one-click
              access during active matters.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
            onClick={handleComplete}
            disabled={loading}
          >
            {loading ? 'Finalizing...' : 'Enter LexVault Dashboard →'}
          </button>
        </div>
      </div>
    </div>
  );
}
