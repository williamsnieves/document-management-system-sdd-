import { OnboardingConfig } from './types';
import { DEFAULT_ROLE_IDS } from '../roles/store';

export const defaultLegalCounselConfig: OnboardingConfig = {
  roleId: DEFAULT_ROLE_IDS.legalCounsel,
  welcomeHeadline: 'Welcome to LexVault, Counselor',
  welcomeMessage: 'Before you access the vault, please complete these required compliance and training steps.',
  bannerUrl: '/images/onboarding-banner-legal.jpg',
  requiredDocs: [
    { id: 'doc-1', documentId: 'NDA-2026', requirementType: 'e_signature' },
    { id: 'doc-2', documentId: 'AUP-2026', requirementType: 'read_confirmation' },
    { id: 'doc-3', documentId: 'DPA-2026', requirementType: 'e_signature' },
  ],
  trainingModules: [
    { id: 'mod-1', title: 'DMS Basics', description: 'Learn how to navigate and search the system.', durationMinutes: 15, isRequired: true, order: 1 },
    { id: 'mod-2', title: 'Security & Encryption', description: 'Understand how your documents are protected.', durationMinutes: 30, isRequired: true, order: 2 },
  ],
  publishedAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
