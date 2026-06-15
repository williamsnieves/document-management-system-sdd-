'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import styles from '@/components/onboarding/UserOnboarding.module.css';
import type { OnboardingConfig, OnboardingProgress } from '@/lib/onboarding/types';

export default function TrainingPage() {
  const router = useRouter();
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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

  if (loading) return <div>Loading...</div>;

  const mandatoryModules = config?.trainingModules.filter(m => m.isRequired) || [];
  const completedMandatoryCount = mandatoryModules.filter(m => {
    const p = progress?.moduleProgress.find(mp => m.id === mp.moduleId);
    return p?.percentComplete === 100;
  }).length;
  
  const isComplete = mandatoryModules.length === completedMandatoryCount;

  return (
    <div className={styles.container}>
      <OnboardingStepper currentStep="training" />
      
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <h3 style={{ margin: '0 0 1rem' }}>Training Progress</h3>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${(completedMandatoryCount / Math.max(mandatoryModules.length, 1)) * 100}%` }} 
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            {completedMandatoryCount} of {mandatoryModules.length} mandatory modules completed
          </div>

          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem' }}>
            <strong>Skills Checklist</strong>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <li>Navigating Vault</li>
              <li>Secure Sharing</li>
              <li>Audit Logs Review</li>
            </ul>
          </div>
        </div>

        <div className={styles.mainArea}>
          <h2 style={{ margin: '0 0 2rem' }}>Training Modules</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {config?.trainingModules.map(mod => {
              const prog = progress?.moduleProgress.find(p => p.moduleId === mod.id);
              const percent = prog?.percentComplete || 0;
              
              return (
                <div key={mod.id} style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ margin: 0 }}>{mod.title}</h3>
                        {!mod.isRequired && <span style={{ fontSize: '0.75rem', background: '#e5e7eb', padding: '0.125rem 0.5rem', borderRadius: '999px' }}>Optional</span>}
                      </div>
                      <p style={{ color: '#6b7280', margin: '0.5rem 0 0' }}>{mod.description}</p>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{mod.durationMinutes} min</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className={styles.progressContainer} style={{ flex: 1, marginTop: 0 }}>
                      <div className={styles.progressBar} style={{ width: `${percent}%` }} />
                    </div>
                    <div style={{ fontSize: '0.875rem', width: '40px' }}>{percent}%</div>
                    
                    {percent < 100 ? (
                      <button 
                        className={styles.button}
                        onClick={() => handleUpdateProgress(mod.id, percent === 0 ? 50 : 100)}
                      >
                        {percent === 0 ? 'Start Module' : 'Resume Module'}
                      </button>
                    ) : (
                      <button className={styles.button} disabled style={{ background: '#f3f4f6' }}>Completed</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.actions} style={{ marginTop: 'auto' }}>
            <button 
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={!isComplete}
              onClick={() => router.push('/onboarding/launch')}
            >
              Continue to Launch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
