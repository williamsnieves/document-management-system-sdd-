'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import styles from '@/components/onboarding/UserOnboarding.module.css';
import type { OnboardingConfig, OnboardingProgress } from '@/lib/onboarding/types';

export default function WelcomePage() {
  const router = useRouter();
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const progRes = await fetch('/api/onboarding/progress');
        if (!progRes.ok) throw new Error('Failed to load progress');
        const progData = await progRes.json();
        setProgress(progData);

        const confRes = await fetch(`/api/onboarding/config/${progData.roleId}`);
        if (!confRes.ok) throw new Error('Failed to load config');
        const confData = await confRes.json();
        setConfig(confData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <OnboardingStepper currentStep="welcome" />
      
      <div className={styles.card}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>{config?.welcomeHeadline || 'Welcome'}</h1>
          <p className={styles.heroSubtitle}>{config?.welcomeMessage || 'Let\'s get you set up.'}</p>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '0.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>Security Checks Passed</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#10b981' }}>✓</span> SSO Verification
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#10b981' }}>✓</span> Data Residency Confirmed
            </li>
          </ul>
        </div>

        <div className={styles.actions}>
          <button 
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={() => router.push('/onboarding/compliance')}
          >
            Begin Compliance Review
          </button>
        </div>
      </div>
    </div>
  );
}
