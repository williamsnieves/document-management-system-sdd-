'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import styles from '@/components/onboarding/UserOnboarding.module.css';
import type { OnboardingConfig, OnboardingProgress } from '@/lib/onboarding/types';

export default function CompliancePage() {
  const router = useRouter();
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

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
      
      if (confData.requiredDocs.length > 0 && !activeDocId) {
        setActiveDocId(confData.requiredDocs[0].documentId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSign = async (docId: string) => {
    try {
      await fetch(`/api/onboarding/progress/compliance/${docId}/complete`, { method: 'POST' });
      await loadData(); // reload progress
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div>Loading...</div>;

  const requiredDocsCount = config?.requiredDocs.length || 0;
  const completedDocsCount = progress?.completedDocs.length || 0;
  const isComplete = requiredDocsCount === completedDocsCount && requiredDocsCount > 0;

  return (
    <div className={styles.container}>
      <OnboardingStepper currentStep="compliance" />
      
      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <h3 style={{ margin: '0 0 1rem' }}>Required Documents</h3>
          <div className={styles.progressContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${(completedDocsCount / Math.max(requiredDocsCount, 1)) * 100}%` }} 
            />
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            {completedDocsCount} of {requiredDocsCount} completed
          </div>

          {config?.requiredDocs.map(doc => {
            const isCompleted = progress?.completedDocs.some(d => d.documentId === doc.documentId);
            const isActive = activeDocId === doc.documentId;
            
            return (
              <div 
                key={doc.id}
                className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ''} ${isCompleted ? styles.sidebarItemCompleted : ''}`}
                onClick={() => setActiveDocId(doc.documentId)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{doc.documentId}</strong>
                  {isCompleted && <span style={{ color: '#10b981' }}>✓</span>}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {doc.requirementType === 'e_signature' ? 'E-Signature Required' : 'Read Confirmation'}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.mainArea}>
          <div style={{ flex: 1 }}>
            {activeDocId ? (
              <>
                <h2 style={{ margin: '0 0 1rem' }}>Document Viewer: {activeDocId}</h2>
                <div style={{ padding: '2rem', background: '#f3f4f6', borderRadius: '0.375rem', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  [PDF / Document Content for {activeDocId}]
                </div>
              </>
            ) : (
              <div>Select a document to review</div>
            )}
          </div>

          <div className={styles.actions} style={{ marginTop: 'auto' }}>
            {activeDocId && !progress?.completedDocs.some(d => d.documentId === activeDocId) && (
              <button 
                className={`${styles.button} ${styles.buttonPrimary}`}
                style={{ marginRight: 'auto' }}
                onClick={() => handleSign(activeDocId)}
              >
                {config?.requiredDocs.find(d => d.documentId === activeDocId)?.requirementType === 'e_signature' 
                  ? 'I agree and sign' 
                  : 'I have read this document'}
              </button>
            )}

            <button 
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={!isComplete}
              onClick={() => router.push('/onboarding/training')}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
