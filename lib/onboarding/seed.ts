import { OnboardingConfig } from './types';
import { DEFAULT_ROLE_IDS } from '../roles/store';

export const defaultLegalCounselConfig: OnboardingConfig = {
  roleId: DEFAULT_ROLE_IDS.legalCounsel,
  welcomeHeadline: 'Welcome to LexVault, Sarah.',
  welcomeMessage:
    'LexVault is your secure document management platform for high-stakes legal and corporate workflows. Complete this short onboarding to activate your account and access the firm vault.',
  bannerUrl: '/images/onboarding-hero.jpg',
  requiredDocs: [
    { id: 'rd-1', documentId: 'doc-nda', requirementType: 'e_signature' },
    { id: 'rd-2', documentId: 'doc-conduct', requirementType: 'read_confirmation' },
    { id: 'rd-3', documentId: 'doc-privacy', requirementType: 'read_confirmation' },
  ],
  trainingModules: [
    {
      id: 'mod-1',
      title: 'DMS Basics & Filing',
      description: 'Interactive guide on folder structures and meta-tagging.',
      durationMinutes: 15,
      isRequired: true,
      order: 1,
    },
    {
      id: 'mod-2',
      title: 'Security & Encryption',
      description: 'Essential training on 2FA and external link sharing protocols.',
      durationMinutes: 20,
      isRequired: true,
      order: 2,
    },
    {
      id: 'mod-3',
      title: 'Versioning & Approvals',
      description: 'Managing document lifecycle and approval workflows.',
      durationMinutes: 25,
      isRequired: true,
      order: 3,
    },
    {
      id: 'mod-4',
      title: 'Advanced Audit Logging',
      description: 'Forensic audit trails and automated reporting.',
      durationMinutes: 10,
      isRequired: false,
      order: 4,
    },
  ],
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
