export interface ComplianceDocumentContent {
  id: string;
  title: string;
  subtitle: string;
  icon: 'document' | 'quill' | 'shield';
  statusLabel: 'READY TO REVIEW' | 'PENDING' | 'COMPLETED';
  requirementType: 'e_signature' | 'read_confirmation';
  body: string;
}

export const COMPLIANCE_DOCUMENTS: ComplianceDocumentContent[] = [
  {
    id: 'doc-nda',
    title: 'Non-Disclosure Agreement (NDA)',
    subtitle: 'E-Signature Required',
    icon: 'document',
    statusLabel: 'READY TO REVIEW',
    requirementType: 'e_signature',
    body: `INTERNAL COMPLIANCE DOCUMENT: Non-Disclosure Agreement (NDA)

Document ID: LXV-2024-001-NDA
Effective Date: October 24, 2024

1. PURPOSE AND DEFINITION
This Agreement prevents unauthorized disclosure of confidential information belonging to LegalCorp and its clients.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public information disclosed by either party, including business plans, client data, litigation materials, and technical specifications.

The Receiving Party shall limit disclosure to authorized representatives with a need to know and who are bound by confidentiality obligations.

3. EXCLUSIONS FROM CONFIDENTIAL INFORMATION
Information that is publicly available, independently developed, or rightfully received from a third party without restriction is excluded.`,
  },
  {
    id: 'doc-conduct',
    title: 'Corporate Code of Conduct',
    subtitle: 'Read Confirmation',
    icon: 'quill',
    statusLabel: 'PENDING',
    requirementType: 'read_confirmation',
    body: `CORPORATE CODE OF CONDUCT

All personnel must uphold the highest ethical standards when handling client matters and internal records.

• Maintain integrity in all document handling
• Report suspected violations through the compliance channel
• Protect client privilege and sensitive matter data`,
  },
  {
    id: 'doc-privacy',
    title: 'Data Privacy Policy',
    subtitle: 'Read Confirmation',
    icon: 'shield',
    statusLabel: 'PENDING',
    requirementType: 'read_confirmation',
    body: `DATA PRIVACY POLICY

LegalCorp processes personal and client data under regional residency controls and encryption at rest and in transit.

• Data residency: US-East-1
• Retention aligned with matter lifecycle policies
• Access limited to role-based permissions within LexVault`,
  },
];

export const TRAINING_MODULES_DISPLAY = [
  {
    id: 'mod-1',
    title: 'DMS Basics & Filing',
    description:
      'Foundational knowledge for navigating LexVault and organizing your personal vault.',
    durationMinutes: 15,
    isRequired: true,
    skills: ['Enterprise Filing Logic'],
  },
  {
    id: 'mod-2',
    title: 'Security & Encryption',
    description:
      "Understanding LexVault's zero-knowledge architecture and secure sharing protocols.",
    durationMinutes: 20,
    isRequired: true,
    skills: ['End-to-End Encryption'],
  },
  {
    id: 'mod-3',
    title: 'Versioning & Approvals',
    description:
      'Managing document lifecycle, conflict resolution, and digital signature workflows.',
    durationMinutes: 25,
    isRequired: true,
    skills: ['Version Conflict Resolution'],
  },
  {
    id: 'mod-4',
    title: 'Advanced Audit Logging',
    description:
      'Deep dive into forensic audit trails and automated reporting for admins.',
    durationMinutes: 10,
    isRequired: false,
    skills: ['Audit Log Interpretation'],
  },
];
