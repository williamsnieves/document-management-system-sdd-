import type {
  DocumentAnnotation,
  WorkflowEvent,
  WorkflowInstance,
  WorkflowReviewer,
} from './types';
import { DEFAULT_WORKFLOW_STEPS } from './types';
import type { Document, Version, DocumentStatus } from '@/lib/documents/types';

const REVIEWER_PROFILES = {
  marcus: {
    userId: 'user-marcus-thorne',
    name: 'Marcus Thorne',
    title: 'General Counsel',
    initials: 'MT',
    avatarColor: '#1d4ed8',
  },
  sarah: {
    userId: 'user-1',
    name: 'Sarah Jenkins',
    title: 'VP of Finance',
    initials: 'SJ',
    avatarColor: '#9333ea',
  },
  david: {
    userId: 'user-david-chen',
    name: 'David Chen',
    title: 'Chief Operations Officer',
    initials: 'DC',
    avatarColor: '#0f766e',
  },
  maria: {
    userId: 'user-maria-rodriguez',
    name: 'Maria Rodriguez',
    title: 'Finance Director',
    initials: 'MR',
    avatarColor: '#7c3aed',
  },
  james: {
    userId: 'user-james-doe',
    name: 'James Doe',
    title: 'Legal Counsel',
    initials: 'JD',
    avatarColor: '#2563eb',
  },
} as const;

function buildReviewers(
  statuses: Array<'approved' | 'pending' | 'upcoming'>,
): WorkflowReviewer[] {
  const profiles = [
    REVIEWER_PROFILES.marcus,
    REVIEWER_PROFILES.sarah,
    REVIEWER_PROFILES.david,
  ];

  return profiles.map((profile, index) => ({
    id: `reviewer-${index + 1}`,
    ...profile,
    status: statuses[index],
    approvedAt:
      statuses[index] === 'approved'
        ? new Date('2023-10-24T10:42:00.000Z').toISOString()
        : undefined,
  }));
}

export const SEED_WORKFLOWS: WorkflowInstance[] = [
  {
    id: 'wf-service-agreement',
    documentId: 'doc-service-agreement',
    status: 'in_review',
    steps: DEFAULT_WORKFLOW_STEPS,
    reviewers: buildReviewers(['approved', 'pending', 'upcoming']),
    currentStep: 2,
    submittedAt: new Date('2023-10-24T09:15:00.000Z').toISOString(),
    submittedBy: REVIEWER_PROFILES.marcus.userId,
    submittedByName: REVIEWER_PROFILES.marcus.name,
  },
  {
    id: 'wf-finance-audit',
    documentId: 'doc-2',
    status: 'in_review',
    steps: DEFAULT_WORKFLOW_STEPS,
    reviewers: buildReviewers(['pending', 'upcoming', 'upcoming']).map(
      (reviewer, index) =>
        index === 0
          ? {
              ...reviewer,
              userId: REVIEWER_PROFILES.maria.userId,
              name: REVIEWER_PROFILES.maria.name,
              title: REVIEWER_PROFILES.maria.title,
              initials: REVIEWER_PROFILES.maria.initials,
              avatarColor: REVIEWER_PROFILES.maria.avatarColor,
            }
          : reviewer,
    ),
    currentStep: 1,
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    submittedBy: REVIEWER_PROFILES.maria.userId,
    submittedByName: REVIEWER_PROFILES.maria.name,
  },
  {
    id: 'wf-handbook',
    documentId: 'doc-4',
    status: 'draft',
    steps: DEFAULT_WORKFLOW_STEPS,
    reviewers: buildReviewers(['upcoming', 'upcoming', 'upcoming']).map(
      (reviewer, index) =>
        index === 0
          ? {
              ...reviewer,
              userId: REVIEWER_PROFILES.james.userId,
              name: REVIEWER_PROFILES.james.name,
              title: REVIEWER_PROFILES.james.title,
              initials: REVIEWER_PROFILES.james.initials,
              avatarColor: REVIEWER_PROFILES.james.avatarColor,
            }
          : reviewer,
    ),
    currentStep: 0,
  },
];

export const SEED_WORKFLOW_EVENTS: WorkflowEvent[] = [
  {
    id: 'evt-1',
    workflowId: 'wf-service-agreement',
    documentId: 'doc-service-agreement',
    type: 'submission',
    userId: REVIEWER_PROFILES.marcus.userId,
    userName: REVIEWER_PROFILES.marcus.name,
    comment: 'Submitted document for executive approval.',
    timestamp: new Date('2023-10-24T09:15:00.000Z').toISOString(),
  },
  {
    id: 'evt-2',
    workflowId: 'wf-service-agreement',
    documentId: 'doc-service-agreement',
    type: 'approval',
    userId: REVIEWER_PROFILES.marcus.userId,
    userName: REVIEWER_PROFILES.marcus.name,
    comment:
      'Legal review complete. Liability clauses in Section 4.2 have been updated per internal audit.',
    timestamp: new Date('2023-10-24T10:42:00.000Z').toISOString(),
  },
  {
    id: 'evt-3',
    workflowId: 'wf-finance-audit',
    documentId: 'doc-2',
    type: 'submission',
    userId: REVIEWER_PROFILES.maria.userId,
    userName: REVIEWER_PROFILES.maria.name,
    comment: 'Submitted Q3 audit for legal review.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const SEED_ANNOTATIONS: DocumentAnnotation[] = [
  {
    id: 'ann-1',
    documentId: 'doc-service-agreement',
    type: 'internal_note',
    section: 'Section 4.2',
    content:
      'Internal Legal Note: Liability clauses in Section 4.2 require executive sign-off before external distribution.',
  },
];

export const SERVICE_AGREEMENT_DOCUMENT: Document = {
  id: 'doc-service-agreement',
  name: 'Service_Agreement_v4_Draft',
  documentId: 'LX-40092',
  category: 'legal',
  status: 'in_review' as DocumentStatus,
  ownerId: 'user-sarah-chen',
  updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  currentVersion: '4.0.0',
  tags: ['service', 'agreement', 'legal'],
  fileType: 'pdf',
  accessLevel: 'standard',
};

export const SERVICE_AGREEMENT_VERSION: Version = {
  id: 'ver-service-agreement',
  documentId: 'doc-service-agreement',
  versionNumber: '4.0.0',
  status: 'in_review',
  createdBy: 'user-sarah-chen',
  createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  fileUrl: '/uploads/doc-service-agreement-v4.0.0.pdf',
};
