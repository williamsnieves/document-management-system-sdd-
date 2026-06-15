import type {
  ActivityEvent,
  Document,
  DocumentCategory,
  Folder,
  Version,
} from './types';
import { OWNERS } from './owners';

const now = Date.now();
const hours = (n: number) => new Date(now - n * 60 * 60 * 1000).toISOString();
const days = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString();

export const SEED_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    name: 'Corporate Risk Assessment 2023',
    documentId: 'MSA-2023-001',
    category: 'legal',
    status: 'approved',
    ownerId: OWNERS['user-james-doe'].id,
    updatedAt: hours(2),
    currentVersion: '4.2.1',
    tags: ['risk', 'assessment', 'legal'],
    fileType: 'pdf',
    accessLevel: 'standard',
  },
  {
    id: 'doc-2',
    name: 'Finance Quarterly Audit Q3',
    documentId: 'FIN-443',
    category: 'finance',
    status: 'in_review',
    ownerId: OWNERS['user-maria-rodriguez'].id,
    updatedAt: days(1),
    currentVersion: '1.0.5',
    tags: ['audit', 'finance', 'quarterly'],
    fileType: 'xlsx',
    accessLevel: 'standard',
  },
  {
    id: 'doc-3',
    name: 'Vendor Agreement Addendum',
    documentId: 'LEG-099',
    category: 'legal',
    status: 'approved',
    ownerId: OWNERS['user-sarah-chen'].id,
    updatedAt: days(3),
    currentVersion: '0.9.2',
    tags: ['vendor', 'agreement', 'legal'],
    fileType: 'docx',
    accessLevel: 'standard',
  },
  {
    id: 'doc-4',
    name: 'Employee Handbook 2024',
    documentId: 'HR-POL-01',
    category: 'hr',
    status: 'draft',
    ownerId: OWNERS['user-admin'].id,
    updatedAt: days(5),
    currentVersion: '1.0.0',
    tags: ['handbook', 'hr', 'policy'],
    fileType: 'pdf',
    hasVersionWarning: true,
    accessLevel: 'restricted',
  },
];

export const SEED_VERSIONS: Version[] = [
  {
    id: 'ver-1',
    documentId: 'doc-1',
    versionNumber: '4.2.1',
    status: 'approved',
    createdBy: OWNERS['user-james-doe'].id,
    createdAt: hours(2),
    fileUrl: '/uploads/doc-1-v4.2.1.pdf',
  },
  {
    id: 'ver-2',
    documentId: 'doc-2',
    versionNumber: '1.0.5',
    status: 'in_review',
    createdBy: OWNERS['user-maria-rodriguez'].id,
    createdAt: days(1),
    fileUrl: '/uploads/doc-2-v1.0.5.xlsx',
  },
  {
    id: 'ver-3',
    documentId: 'doc-3',
    versionNumber: '0.9.2',
    status: 'approved',
    createdBy: OWNERS['user-sarah-chen'].id,
    createdAt: days(3),
    fileUrl: '/uploads/doc-3-v0.9.2.docx',
  },
  {
    id: 'ver-4',
    documentId: 'doc-4',
    versionNumber: '1.0.0',
    status: 'draft',
    createdBy: OWNERS['user-admin'].id,
    createdAt: days(5),
    fileUrl: '/uploads/doc-4-v1.0.0.pdf',
  },
];

export const SEED_FOLDERS: Folder[] = [];

export const SEED_ACTIVITY: ActivityEvent[] = [
  {
    id: 'act-1',
    type: 'approval',
    userId: OWNERS['user-james-doe'].id,
    userName: OWNERS['user-james-doe'].name,
    documentId: 'doc-1',
    documentName: 'Corporate Risk Assessment 2023',
    timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'act-2',
    type: 'review_request',
    userId: OWNERS['user-maria-rodriguez'].id,
    userName: OWNERS['user-maria-rodriguez'].name,
    documentId: 'doc-2',
    documentName: 'Finance Quarterly Audit Q3',
    timestamp: hours(1),
  },
  {
    id: 'act-3',
    type: 'upload',
    userId: OWNERS['user-sarah-chen'].id,
    userName: OWNERS['user-sarah-chen'].name,
    documentId: 'doc-3',
    documentName: 'Vendor Agreement Addendum',
    timestamp: days(3),
  },
  {
    id: 'act-4',
    type: 'edit',
    userId: OWNERS['user-admin'].id,
    userName: OWNERS['user-admin'].name,
    documentId: 'doc-4',
    documentName: 'Employee Handbook 2024',
    timestamp: days(5),
  },
];

/** Display counts matching mockup totals while seed has fewer rows */
export const CATEGORY_DISPLAY_COUNTS: Record<DocumentCategory, number> = {
  legal: 124,
  finance: 82,
  hr: 45,
};

export function generateExtraSeedDocuments(): Document[] {
  const extras: Document[] = [];
  const categories: DocumentCategory[] = ['legal', 'finance', 'hr'];
  const statuses: Document['status'][] = ['approved', 'in_review', 'draft'];
  const ownerIds = Object.keys(OWNERS);
  const fileTypes: Document['fileType'][] = ['pdf', 'docx', 'xlsx'];

  for (let i = 5; i <= 30; i++) {
    const category = categories[i % categories.length];
    const prefix =
      category === 'legal' ? 'LEG' : category === 'finance' ? 'FIN' : 'HR';
    extras.push({
      id: `doc-${i}`,
      name: `${CATEGORY_PREFIX_NAME[category]} Document ${i}`,
      documentId: `${prefix}-${String(i).padStart(3, '0')}`,
      category,
      status: statuses[i % statuses.length],
      ownerId: ownerIds[i % ownerIds.length],
      updatedAt: days(i % 14),
      currentVersion: `1.${i % 5}.0`,
      tags: [category, 'seed'],
      fileType: fileTypes[i % fileTypes.length],
      accessLevel: i % 7 === 0 ? 'restricted' : 'standard',
    });
  }

  return extras;
}

const CATEGORY_PREFIX_NAME: Record<DocumentCategory, string> = {
  legal: 'Legal',
  finance: 'Finance',
  hr: 'HR',
};
