export type WorkflowStatus =
  | 'draft'
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'changes_requested';

export type ReviewerStatus = 'approved' | 'pending' | 'upcoming';

export type WorkflowEventType =
  | 'submission'
  | 'approval'
  | 'rejection'
  | 'request_changes'
  | 'comment';

export interface WorkflowReviewer {
  id: string;
  userId: string;
  name: string;
  title: string;
  initials: string;
  avatarColor: string;
  status: ReviewerStatus;
  approvedAt?: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  order: number;
}

export interface WorkflowInstance {
  id: string;
  documentId: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  reviewers: WorkflowReviewer[];
  currentStep: number;
  submittedAt?: string;
  submittedBy?: string;
  submittedByName?: string;
}

export interface WorkflowEvent {
  id: string;
  workflowId: string;
  documentId: string;
  type: WorkflowEventType;
  userId: string;
  userName: string;
  comment?: string;
  attachmentName?: string;
  timestamp: string;
}

export interface DocumentAnnotation {
  id: string;
  documentId: string;
  content: string;
  type: 'internal_note';
  section?: string;
}

export interface ApprovalQueueItem {
  documentId: string;
  documentName: string;
  documentRef: string;
  fileType: string;
  updatedAt: string;
  ownerName: string;
  workflowId: string;
  currentStep: number;
  totalSteps: number;
  currentStepLabel: string;
  pendingReviewerName: string;
  isPendingForCurrentUser: boolean;
}

export interface ApprovalDetailResponse {
  workflow: WorkflowInstance;
  events: WorkflowEvent[];
  annotations: DocumentAnnotation[];
  document: {
    id: string;
    name: string;
    documentId: string;
    fileType: string;
    status: string;
    updatedAt: string;
    ownerName: string;
    modifiedByName: string;
    fileSizeLabel: string;
  };
  currentUserId: string;
  canAct: boolean;
}

export interface SubmitApprovalInput {
  documentId: string;
  userId: string;
  userName: string;
}

export interface ReviewActionInput {
  documentId: string;
  userId: string;
  userName: string;
  comment?: string;
}

export interface AddCommentInput {
  documentId: string;
  userId: string;
  userName: string;
  comment: string;
  attachmentName?: string;
}

export const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 'step-legal', label: 'Legal Review', order: 1 },
  { id: 'step-executive', label: 'Executive Approval', order: 2 },
  { id: 'step-final', label: 'Final Sign-off', order: 3 },
];
