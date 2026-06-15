'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, PenLine, Shield } from 'lucide-react';
import { OnboardingStepper } from '@/components/onboarding/OnboardingStepper';
import styles from '@/components/onboarding/UserOnboarding.module.css';
import { COMPLIANCE_DOCUMENTS } from '@/lib/onboarding/content';
import type { OnboardingConfig, OnboardingProgress } from '@/lib/onboarding/types';

const DOC_ICONS = {
  document: FileText,
  quill: PenLine,
  shield: Shield,
} as const;

export default function CompliancePage() {
  const router = useRouter();
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

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
      const confData = await confRes.json();
      setConfig(confData);

      if (confData.requiredDocs.length > 0) {
        setActiveDocId((current) => current ?? confData.requiredDocs[0].documentId);
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
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  const requiredDocsCount = config?.requiredDocs.length ?? 0;
  const completedDocsCount = progress?.completedDocs.length ?? 0;
  const isComplete = requiredDocsCount === completedDocsCount && requiredDocsCount > 0;
  const activeDoc = COMPLIANCE_DOCUMENTS.find((d) => d.id === activeDocId);
  const activeConfig = config?.requiredDocs.find((d) => d.documentId === activeDocId);
  const isActiveCompleted = progress?.completedDocs.some((d) => d.documentId === activeDocId);

  return (
    <div className={styles.container}>
      <OnboardingStepper currentStep="compliance" />

      <div className={styles.complianceLayout}>
        <aside className={styles.docSidebar}>
          <h2 className={styles.docSidebarTitle}>Compliance Documents</h2>
          <p className={styles.docSidebarSub}>
            {completedDocsCount} of {requiredDocsCount} completed
          </p>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${(completedDocsCount / Math.max(requiredDocsCount, 1)) * 100}%` }}
            />
          </div>

          {config?.requiredDocs.map((doc) => {
            const display = COMPLIANCE_DOCUMENTS.find((d) => d.id === doc.documentId);
            const isCompleted = progress?.completedDocs.some((d) => d.documentId === doc.documentId);
            const isActive = activeDocId === doc.documentId;
            const Icon = display ? DOC_ICONS[display.icon] : FileText;

            return (
              <button
                key={doc.id}
                type="button"
                className={`${styles.docItem} ${isActive ? styles.docItemActive : ''}`}
                onClick={() => setActiveDocId(doc.documentId)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Icon size={18} style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <div className={styles.docItemTitle}>
                      {display?.title ?? doc.documentId}
                    </div>
                    <div className={styles.docStatus}>
                      {isCompleted ? (
                        <span style={{ color: '#16a34a' }}>COMPLETED</span>
                      ) : (
                        <span className={styles.docStatusReady}>
                          {display?.statusLabel ?? 'READY TO REVIEW'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.docViewer}>
            {activeDoc ? (
              <>
                <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>{activeDoc.title}</h2>
                <p style={{ margin: '0 0 1.5rem', fontSize: '0.8125rem', color: '#6b7280' }}>
                  {activeDoc.subtitle}
                </p>
                <div className={styles.docPaper}>
                  {activeDoc.body}
                  {activeDoc.requirementType === 'e_signature' && (
                    <div className={styles.docHighlight}>
                      By signing below, you acknowledge that you have read and agree to the terms
                      of this Non-Disclosure Agreement.
                    </div>
                  )}
                </div>
                {activeDocId && !isActiveCompleted && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className={`${styles.button} ${styles.buttonPrimary}`}
                      onClick={() => handleSign(activeDocId)}
                    >
                      {activeConfig?.requirementType === 'e_signature'
                        ? 'I Agree & Sign Electronically'
                        : 'I Have Read This Document'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.loading}>Select a document to review</div>
            )}
          </div>

          <div className={styles.progressFooter}>
            <span className={styles.progressLabel}>
              Step 2 of 4 — Compliance Attestation
            </span>
            <button
              type="button"
              className={`${styles.button} ${styles.buttonPrimary}`}
              disabled={!isComplete}
              onClick={() => router.push('/onboarding/training')}
            >
              Save & Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
