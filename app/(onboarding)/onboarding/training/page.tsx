'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import styles from '@/components/onboarding/UserOnboarding.module.css';
import { TRAINING_MODULES_DISPLAY } from '@/lib/onboarding/content';
import type { OnboardingConfig, OnboardingProgress } from '@/lib/onboarding/types';

export default function TrainingPage() {
  const router = useRouter();
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const progRes = await fetch('/api/onboarding/progress');
      if (!progRes.ok) throw new Error('Failed to load progress');
      const progData = await progRes.json();
      setProgress(progData);

      const confRes = await fetch(`/api/onboarding/config/${progData.roleId}`);
      if (!confRes.ok) throw new Error('Failed to load config');
      setConfig(await confRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateProgress = async (moduleId: string, percentComplete: number) => {
    try {
      await fetch(`/api/onboarding/progress/training/${moduleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ percentComplete }),
      });
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  const mandatoryModules = config?.trainingModules.filter((m) => m.isRequired) ?? [];
  const completedMandatoryCount = mandatoryModules.filter((m) => {
    const p = progress?.moduleProgress.find((mp) => m.id === mp.moduleId);
    return p?.percentComplete === 100;
  }).length;
  const overallPercent = Math.round(
    (completedMandatoryCount / Math.max(mandatoryModules.length, 1)) * 100,
  );
  const isComplete = mandatoryModules.length === completedMandatoryCount;

  return (
    <div className={styles.container}>
      <OnboardingStepper currentStep="training" />

      <div className={styles.trainingLayout}>
        <div>
          <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.25rem' }}>Training Modules</h2>

          {config?.trainingModules.map((mod) => {
            const display = TRAINING_MODULES_DISPLAY.find((d) => d.id === mod.id);
            const prog = progress?.moduleProgress.find((p) => p.moduleId === mod.id);
            const percent = prog?.percentComplete ?? 0;
            const isActive = percent > 0 && percent < 100;

            return (
              <div
                key={mod.id}
                className={`${styles.moduleCard} ${isActive ? styles.moduleCardActive : ''}`}
              >
                <div className={styles.moduleHeader}>
                  <div>
                    <h3 className={styles.moduleTitle}>{mod.title}</h3>
                    <p style={{ color: '#6b7280', margin: '0.5rem 0 0', fontSize: '0.875rem' }}>
                      {display?.description ?? mod.description}
                    </p>
                  </div>
                  <span
                    className={`${styles.pill} ${
                      percent === 100
                        ? styles.pillDone
                        : percent > 0
                          ? styles.pillProgress
                          : styles.pillPending
                    }`}
                  >
                    {percent === 100 ? 'Completed' : percent > 0 ? 'In Progress' : mod.isRequired ? 'Required' : 'Optional'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className={styles.progressContainer} style={{ flex: 1, margin: 0 }}>
                    <div className={styles.progressBar} style={{ width: `${percent}%` }} />
                  </div>
                  <span style={{ fontSize: '0.8125rem', width: '2.5rem' }}>{percent}%</span>
                  {percent < 100 ? (
                    <button
                      type="button"
                      className={`${styles.button} ${styles.buttonOutline}`}
                      onClick={() => handleUpdateProgress(mod.id, percent === 0 ? 50 : 100)}
                    >
                      {percent === 0 ? 'Start Module' : 'Complete Module'}
                    </button>
                  ) : (
                    <button type="button" className={`${styles.button} ${styles.buttonOutline}`} disabled>
                      Done
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={!isComplete}
              onClick={() => router.push('/onboarding/launch')}
            >
              Continue to Launch →
            </button>
          </div>
        </div>

        <aside>
          <div className={`${styles.card} ${styles.ringCard}`}>
            <div className={styles.ringValue}>{overallPercent}%</div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
              Training Progress
            </p>
            <div className={styles.progressContainer} style={{ marginTop: '1rem' }}>
              <div className={styles.progressBar} style={{ width: `${overallPercent}%` }} />
            </div>
            <p style={{ margin: '1rem 0 0', fontSize: '0.8125rem', color: '#6b7280' }}>
              {completedMandatoryCount} of {mandatoryModules.length} mandatory modules
            </p>
          </div>

          <div className={styles.card} style={{ marginTop: '1rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.9375rem' }}>Skills Checklist</h3>
            <ul className={styles.checkList} style={{ margin: 0 }}>
              <li className={styles.checkItem}>
                <span className={styles.checkIcon}>✓</span>
                Navigating Vault
              </li>
              <li className={styles.checkItem}>
                <span className={styles.checkIcon}>✓</span>
                Secure Sharing
              </li>
              <li className={styles.checkItem}>
                <span className={styles.checkIcon}>✓</span>
                Audit Logs Review
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
