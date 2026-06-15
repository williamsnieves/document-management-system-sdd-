'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import styles from '@/components/onboarding/UserOnboarding.module.css';
import type { OnboardingConfig } from '@/lib/onboarding/types';

export default function WelcomePage() {
  const router = useRouter();
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const progRes = await fetch('/api/onboarding/progress');
        if (!progRes.ok) throw new Error('Failed to load progress');
        const progData = await progRes.json();

        const confRes = await fetch(`/api/onboarding/config/${progData.roleId}`);
        if (!confRes.ok) throw new Error('Failed to load config');
        setConfig(await confRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <OnboardingStepper currentStep="welcome" />

      <div className={styles.heroBanner}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>
            {config?.welcomeHeadline ?? 'Welcome to LexVault, Sarah.'}
          </h1>
          <p className={styles.heroSubtitle}>
            {config?.welcomeMessage ??
              'LexVault is your secure document management platform for high-stakes legal and corporate workflows.'}
          </p>
          <div className={styles.heroActions}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={() => router.push('/onboarding/compliance')}
            >
              Get Started →
            </button>
            <button type="button" className={`${styles.button} ${styles.buttonGhost}`}>
              View Tutorial
            </button>
          </div>
        </div>
      </div>

      <div className={styles.twoCol}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🛡 Your Security Credentials</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            Your account has enterprise-grade encryption and is monitored for audit purposes.
          </p>
          <ul className={styles.checkList}>
            <li className={styles.checkItem}>
              <span className={styles.checkIcon}>✓</span>
              Account verified via Okta SSO
            </li>
            <li className={styles.checkItem}>
              <span className={styles.checkIcon}>✓</span>
              Regional data residency set to US-East-1
            </li>
          </ul>
          <button
            type="button"
            className={`${styles.button} ${styles.buttonPrimary}`}
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => router.push('/onboarding/compliance')}
          >
            Begin Compliance Review →
          </button>
        </div>

        <div>
          <div className={styles.cardDark}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>What&apos;s Next?</h3>
            <ol className={styles.whatsNextList}>
              <li className={styles.whatsNextItem}>Compliance Attestation — E-sign document handling and NDAs</li>
              <li className={styles.whatsNextItem}>Versioning Training — Learn about concurrent edits and audit logs</li>
              <li className={styles.whatsNextItem}>Secure Vault Access — Initial login to the primary workspace</li>
            </ol>
          </div>
          <div className={styles.estimatedTime}>ESTIMATED TIME: 12 Minutes</div>
        </div>
      </div>
    </div>
  );
}
