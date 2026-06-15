'use client';

import { useState, useEffect } from 'react';
import styles from './AdminConfig.module.css';
import type { OnboardingConfig, RequiredDocument, TrainingModule } from '@/lib/onboarding/types';

const ROLES = [
  { id: 'role-legal-counsel', name: 'Legal Counsel' },
  { id: 'role-document-editor', name: 'Document Editor' },
  { id: 'role-audit-officer', name: 'Audit Officer' },
  { id: 'role-external-client', name: 'External Client' },
];

export function AdminConfig() {
  const [activeRole, setActiveRole] = useState(ROLES[0].id);
  const [config, setConfig] = useState<OnboardingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchConfig(activeRole);
  }, [activeRole]);

  const fetchConfig = async (roleId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/onboarding/config/${roleId}`);
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      } else {
        setConfig(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      await fetch(`/api/onboarding/config/${activeRole}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      alert('Draft saved');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = async () => {
    try {
      await fetch(`/api/onboarding/config/${activeRole}/publish`, { method: 'POST' });
      alert('Config published successfully');
      fetchConfig(activeRole);
    } catch (e) {
      console.error(e);
    }
  };

  const updateConfig = (updates: Partial<OnboardingConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates });
    } else {
      setConfig({
        roleId: activeRole,
        welcomeHeadline: '',
        welcomeMessage: '',
        bannerUrl: '',
        requiredDocs: [],
        trainingModules: [],
        publishedAt: null,
        updatedAt: new Date().toISOString(),
        ...updates
      });
    }
  };

  const removeDoc = (id: string) => {
    if (!config) return;
    updateConfig({
      requiredDocs: config.requiredDocs.filter(d => d.id !== id)
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
            Roles &gt; Onboarding Config
          </div>
          <h1 className={styles.title}>Onboarding Configuration</h1>
          <p className={styles.subtitle}>Configure the onboarding experience for new users.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.button} onClick={handleSave}>Save Draft</button>
          <button className={styles.button} onClick={() => window.open('/onboarding?preview=true', '_blank')}>Preview Flow</button>
          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handlePublish}>Publish Config</button>
        </div>
      </div>

      <div className={styles.tabs}>
        {ROLES.map(r => (
          <div
            key={r.id}
            className={`${styles.tab} ${activeRole === r.id ? styles.tabActive : ''}`}
            onClick={() => setActiveRole(r.id)}
          >
            {r.name}
          </div>
        ))}
        <div className={styles.tab}>+ New Role</div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.content}>
          <div className={styles.formSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Welcome Experience</h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>Welcome Headline</label>
                <input
                  type="text"
                  className={styles.input}
                  value={config?.welcomeHeadline || ''}
                  onChange={e => updateConfig({ welcomeHeadline: e.target.value })}
                  placeholder="e.g. Welcome to LexVault"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Introductory Message</label>
                <textarea
                  className={styles.textarea}
                  value={config?.welcomeMessage || ''}
                  onChange={e => updateConfig({ welcomeMessage: e.target.value })}
                  placeholder="Enter a welcome message..."
                />
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Required Docs</h2>
              {config?.requiredDocs.map(doc => (
                <div key={doc.id} className={styles.docItem}>
                  <div>
                    <strong>{doc.documentId}</strong> - {doc.requirementType === 'e_signature' ? 'E-Signature Required' : 'Read Confirmation'}
                  </div>
                  <button className={styles.button} onClick={() => removeDoc(doc.id)}>Remove</button>
                </div>
              ))}
              <button className={styles.button} style={{ marginTop: '1rem' }}>+ Link Existing Document</button>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Training Modules</h2>
              {config?.trainingModules.map(mod => (
                <div key={mod.id} className={styles.moduleItem}>
                  <input
                    type="checkbox"
                    checked={mod.isRequired}
                    onChange={e => {
                      const newMods = [...config.trainingModules];
                      const m = newMods.find(m => m.id === mod.id);
                      if (m) m.isRequired = e.target.checked;
                      updateConfig({ trainingModules: newMods });
                    }}
                  />
                  <div>
                    <strong>{mod.title}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{mod.description} ({mod.durationMinutes} min)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>User Journey Preview</h2>
            <div className={styles.previewStepper}>
              <div className={styles.step}>
                <div className={`${styles.stepNumber} ${styles.stepNumberActive}`}>1</div>
                <div>
                  <strong>Welcome</strong>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Personalized intro</div>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div>
                  <strong>Compliance</strong>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{config?.requiredDocs.length || 0} required docs</div>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div>
                  <strong>Training</strong>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {config?.trainingModules.filter(m => m.isRequired).length || 0} mandatory modules
                  </div>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>4</div>
                <div>
                  <strong>Launch</strong>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Access summary</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
