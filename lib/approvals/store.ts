import { randomUUID } from 'crypto';

import { recordAuditEvent } from '@/lib/audit/record';
import { getCurrentUser } from '@/lib/auth/middleware';
import { PERMISSIONS } from '@/lib/auth/permissions';
import { documentStore } from '@/lib/documents/store';
import { OWNERS } from '@/lib/documents/owners';
import type { Document, Version } from '@/lib/documents/types';
import { hasPermission, isGlobalAdmin } from '@/lib/roles/hasPermission';

import {
  notifyAuthor,
  notifyNextReviewer,
} from './notifications';
import {
  SEED_ANNOTATIONS,
  SEED_WORKFLOW_EVENTS,
  SEED_WORKFLOWS,
  SERVICE_AGREEMENT_DOCUMENT,
  SERVICE_AGREEMENT_VERSION,
} from './seed';
import type {
  AddCommentInput,
  ApprovalDetailResponse,
  ApprovalQueueItem,
  DocumentAnnotation,
  ReviewActionInput,
  SubmitApprovalInput,
  WorkflowEvent,
  WorkflowInstance,
  WorkflowReviewer,
} from './types';
import { DEFAULT_WORKFLOW_STEPS } from './types';

export class ApprovalError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'ApprovalError';
  }
}

class ApprovalStore {
  private workflows: WorkflowInstance[] = [...SEED_WORKFLOWS];

  private events: WorkflowEvent[] = [...SEED_WORKFLOW_EVENTS];

  private annotations: DocumentAnnotation[] = [...SEED_ANNOTATIONS];

  constructor() {
    this.syncDocumentStatuses();
  }

  private getDocument(documentId: string): Document | undefined {
    if (documentId === SERVICE_AGREEMENT_DOCUMENT.id) {
      return { ...SERVICE_AGREEMENT_DOCUMENT };
    }
    return documentStore.getDocumentById(documentId);
  }

  private syncDocumentStatuses(): void {
    for (const workflow of this.workflows) {
      this.applyDocumentStatus(workflow.documentId, workflow.status);
    }
  }

  private applyDocumentStatus(
    documentId: string,
    workflowStatus: WorkflowInstance['status'],
  ): Document['status'] {
    let status: Document['status'] = 'draft';

    if (workflowStatus === 'approved') {
      status = 'approved';
    } else if (
      workflowStatus === 'in_review' ||
      workflowStatus === 'submitted'
    ) {
      status = 'in_review';
    } else if (
      workflowStatus === 'rejected' ||
      workflowStatus === 'changes_requested'
    ) {
      status = 'draft';
    }

    this.updateDocumentStatus(documentId, status);
    return status;
  }

  private updateDocumentStatus(
    documentId: string,
    status: Document['status'],
  ): void {
    if (documentId === SERVICE_AGREEMENT_DOCUMENT.id) {
      (SERVICE_AGREEMENT_DOCUMENT as Document).status = status;
      SERVICE_AGREEMENT_DOCUMENT.updatedAt = new Date().toISOString();
      return;
    }

    const doc = documentStore.getDocumentById(documentId);
    if (!doc) return;
    doc.status = status;
    doc.updatedAt = new Date().toISOString();
  }

  getWorkflowByDocumentId(documentId: string): WorkflowInstance | undefined {
    return this.workflows.find((wf) => wf.documentId === documentId);
  }

  getOrCreateWorkflow(documentId: string): WorkflowInstance {
    const existing = this.getWorkflowByDocumentId(documentId);
    if (existing) return existing;

    const workflow: WorkflowInstance = {
      id: randomUUID(),
      documentId,
      status: 'draft',
      steps: DEFAULT_WORKFLOW_STEPS.map((step) => ({ ...step })),
      reviewers: DEFAULT_WORKFLOW_STEPS.map((step, index) => ({
        id: randomUUID(),
        userId: `reviewer-${index + 1}`,
        name: `Reviewer ${index + 1}`,
        title: step.label,
        initials: `R${index + 1}`,
        avatarColor: '#6b7280',
        status: 'upcoming',
      })),
      currentStep: 0,
    };

    this.workflows.push(workflow);
    return workflow;
  }

  getPendingQueue(userId: string): ApprovalQueueItem[] {
    const user = getCurrentUser();
    const isAdmin = isGlobalAdmin(user);

    const items: ApprovalQueueItem[] = [];

    for (const wf of this.workflows) {
      if (wf.status !== 'in_review' && wf.status !== 'submitted') {
        continue;
      }

      const doc = this.getDocument(wf.documentId);
      if (!doc) continue;

      const pendingReviewer = wf.reviewers.find((r) => r.status === 'pending');
      const currentStepLabel =
        wf.steps.find((s) => s.order === wf.currentStep)?.label ?? 'In Review';

      items.push({
        documentId: doc.id,
        documentName: doc.name,
        documentRef: doc.documentId,
        fileType: doc.fileType,
        updatedAt: doc.updatedAt,
        ownerName: OWNERS[doc.ownerId]?.name ?? 'Unknown',
        workflowId: wf.id,
        currentStep: wf.currentStep,
        totalSteps: wf.steps.length,
        currentStepLabel,
        pendingReviewerName: pendingReviewer?.name ?? 'Unassigned',
        isPendingForCurrentUser:
          pendingReviewer?.userId === userId || isAdmin,
      });
    }

    return items.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  getDetail(documentId: string, userId: string): ApprovalDetailResponse {
    const workflow = this.getWorkflowByDocumentId(documentId);
    const doc = this.getDocument(documentId);

    if (!workflow || !doc) {
      throw new ApprovalError('Approval workflow not found', 404);
    }

    const events = this.events
      .filter((event) => event.documentId === documentId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    const annotations = this.annotations.filter(
      (annotation) => annotation.documentId === documentId,
    );

    const owner = OWNERS[doc.ownerId];
    const modifiedBy =
      workflow.reviewers.find((r) => r.status === 'pending') ??
      workflow.reviewers.find((r) => r.status === 'approved');

    return {
      workflow,
      events,
      annotations,
      document: {
        id: doc.id,
        name: doc.name,
        documentId: doc.documentId,
        fileType: doc.fileType,
        status: doc.status,
        updatedAt: doc.updatedAt,
        ownerName: owner?.name ?? 'Unknown',
        modifiedByName: modifiedBy?.name ?? owner?.name ?? 'Unknown',
        fileSizeLabel: '4.2 MB',
      },
      currentUserId: userId,
      canAct: this.canUserAct(workflow, userId),
    };
  }

  canUserAct(workflow: WorkflowInstance, userId: string): boolean {
    const user = getCurrentUser();
    const pendingReviewer = workflow.reviewers.find(
      (reviewer) => reviewer.status === 'pending',
    );

    if (!pendingReviewer || pendingReviewer.userId !== userId) {
      return false;
    }

    return (
      hasPermission(user, PERMISSIONS.APPROVE) ||
      hasPermission(user, PERMISSIONS.REJECT_ARCHIVE) ||
      hasPermission(user, PERMISSIONS.REQUEST_CHANGES)
    );
  }

  submit(input: SubmitApprovalInput): WorkflowInstance {
    const user = getCurrentUser();
    if (
      !hasPermission(user, PERMISSIONS.UPLOAD) &&
      !hasPermission(user, PERMISSIONS.EDIT_METADATA)
    ) {
      throw new ApprovalError('Permission denied', 403);
    }

    const doc = this.getDocument(input.documentId);
    if (!doc) {
      throw new ApprovalError('Document not found', 404);
    }

    if (doc.status !== 'draft') {
      throw new ApprovalError(
        'Only draft documents can be submitted for approval',
        400,
      );
    }

    const workflow = this.getOrCreateWorkflow(input.documentId);
    if (workflow.status !== 'draft' && workflow.status !== 'changes_requested') {
      throw new ApprovalError('Document is already in an active workflow', 400);
    }

    this.resetReviewers(workflow);
    workflow.status = 'in_review';
    workflow.currentStep = 1;
    workflow.submittedAt = new Date().toISOString();
    workflow.submittedBy = input.userId;
    workflow.submittedByName = input.userName;

    this.updateDocumentStatus(input.documentId, 'in_review');

    this.events.unshift({
      id: randomUUID(),
      workflowId: workflow.id,
      documentId: input.documentId,
      type: 'submission',
      userId: input.userId,
      userName: input.userName,
      comment: 'Submitted document for approval.',
      timestamp: new Date().toISOString(),
    });

    const pendingReviewer = workflow.reviewers.find(
      (reviewer) => reviewer.status === 'pending',
    );
    if (pendingReviewer) {
      notifyNextReviewer(pendingReviewer.userId, doc.id, doc.name);
    }

    recordAuditEvent({
      userId: input.userId,
      actionType: 'document.version',
      resourceType: 'document',
      resourceId: doc.id,
      resourceLabel: doc.name,
      metadata: { workflowAction: 'submit' },
    });

    return workflow;
  }

  approve(input: ReviewActionInput): WorkflowInstance {
    const workflow = this.assertPendingReviewer(input);

    const doc = this.getDocument(input.documentId);
    if (!doc) {
      throw new ApprovalError('Document not found', 404);
    }

    const pendingIndex = workflow.reviewers.findIndex(
      (reviewer) => reviewer.status === 'pending',
    );
    if (pendingIndex === -1) {
      throw new ApprovalError('No pending reviewer', 400);
    }

    workflow.reviewers[pendingIndex].status = 'approved';
    workflow.reviewers[pendingIndex].approvedAt = new Date().toISOString();

    this.events.unshift({
      id: randomUUID(),
      workflowId: workflow.id,
      documentId: input.documentId,
      type: 'approval',
      userId: input.userId,
      userName: input.userName,
      comment: input.comment,
      timestamp: new Date().toISOString(),
    });

    recordAuditEvent({
      userId: input.userId,
      actionType: 'document.approve',
      resourceType: 'document',
      resourceId: doc.id,
      resourceLabel: doc.name,
      metadata: {
        step: workflow.currentStep,
        reviewer: workflow.reviewers[pendingIndex].name,
      },
    });

    const nextReviewer = workflow.reviewers[pendingIndex + 1];
    if (nextReviewer) {
      nextReviewer.status = 'pending';
      workflow.currentStep = pendingIndex + 2;
      workflow.status = 'in_review';
      this.updateDocumentStatus(input.documentId, 'in_review');
      notifyNextReviewer(nextReviewer.userId, doc.id, doc.name);
    } else {
      workflow.status = 'approved';
      workflow.currentStep = workflow.steps.length;
      this.updateDocumentStatus(input.documentId, 'approved');
      notifyAuthor(
        doc.ownerId,
        doc.id,
        doc.name,
        'Your document has been fully approved.',
      );
    }

    return workflow;
  }

  reject(input: ReviewActionInput): WorkflowInstance {
    const workflow = this.assertPendingReviewer(input, PERMISSIONS.REJECT_ARCHIVE);

    const doc = this.getDocument(input.documentId);
    if (!doc) {
      throw new ApprovalError('Document not found', 404);
    }

    workflow.status = 'rejected';
    workflow.reviewers.forEach((reviewer) => {
      if (reviewer.status === 'pending') {
        reviewer.status = 'upcoming';
      }
    });

    this.events.unshift({
      id: randomUUID(),
      workflowId: workflow.id,
      documentId: input.documentId,
      type: 'rejection',
      userId: input.userId,
      userName: input.userName,
      comment: input.comment ?? 'Document rejected.',
      timestamp: new Date().toISOString(),
    });

    this.updateDocumentStatus(input.documentId, 'draft');

    notifyAuthor(
      doc.ownerId,
      doc.id,
      doc.name,
      input.comment ?? 'Your document was rejected during review.',
    );

    recordAuditEvent({
      userId: input.userId,
      actionType: 'document.reject',
      resourceType: 'document',
      resourceId: doc.id,
      resourceLabel: doc.name,
      metadata: { reason: input.comment, workflowAction: 'reject' },
    });

    return workflow;
  }

  requestChanges(input: ReviewActionInput): WorkflowInstance {
    const workflow = this.assertPendingReviewer(
      input,
      PERMISSIONS.REQUEST_CHANGES,
    );

    const doc = this.getDocument(input.documentId);
    if (!doc) {
      throw new ApprovalError('Document not found', 404);
    }

    workflow.status = 'changes_requested';
    workflow.currentStep = 0;
    this.resetReviewers(workflow, { keepUpcoming: true });

    this.events.unshift({
      id: randomUUID(),
      workflowId: workflow.id,
      documentId: input.documentId,
      type: 'request_changes',
      userId: input.userId,
      userName: input.userName,
      comment: input.comment ?? 'Changes requested.',
      timestamp: new Date().toISOString(),
    });

    this.updateDocumentStatus(input.documentId, 'draft');

    notifyAuthor(
      doc.ownerId,
      doc.id,
      doc.name,
      input.comment ?? 'Changes were requested on your document.',
    );

    recordAuditEvent({
      userId: input.userId,
      actionType: 'document.reject',
      resourceType: 'document',
      resourceId: doc.id,
      resourceLabel: doc.name,
      metadata: {
        reason: input.comment,
        workflowAction: 'request_changes',
      },
    });

    return workflow;
  }

  addComment(input: AddCommentInput): WorkflowEvent {
    const workflow = this.getWorkflowByDocumentId(input.documentId);
    if (!workflow) {
      throw new ApprovalError('Approval workflow not found', 404);
    }

    const event: WorkflowEvent = {
      id: randomUUID(),
      workflowId: workflow.id,
      documentId: input.documentId,
      type: 'comment',
      userId: input.userId,
      userName: input.userName,
      comment: input.comment,
      attachmentName: input.attachmentName,
      timestamp: new Date().toISOString(),
    };

    this.events.unshift(event);
    return event;
  }

  private assertPendingReviewer(
    input: ReviewActionInput,
    permission: (typeof PERMISSIONS)[keyof typeof PERMISSIONS] = PERMISSIONS.APPROVE,
  ): WorkflowInstance {
    const user = getCurrentUser();
    if (!hasPermission(user, permission)) {
      throw new ApprovalError('Permission denied', 403);
    }

    const workflow = this.getWorkflowByDocumentId(input.documentId);
    if (!workflow) {
      throw new ApprovalError('Approval workflow not found', 404);
    }

    if (!this.canUserAct(workflow, input.userId)) {
      throw new ApprovalError(
        'Only the current pending reviewer can perform this action',
        403,
      );
    }

    return workflow;
  }

  private resetReviewers(
    workflow: WorkflowInstance,
    options?: { keepUpcoming?: boolean },
  ): void {
    workflow.reviewers = workflow.reviewers.map((reviewer, index) => ({
      ...reviewer,
      status: index === 0 ? 'pending' : 'upcoming',
      approvedAt: undefined,
    }));

    if (options?.keepUpcoming) {
      workflow.reviewers = workflow.reviewers.map((reviewer) => ({
        ...reviewer,
        status: 'upcoming',
        approvedAt: undefined,
      }));
    }
  }
}

const globalForStore = globalThis as unknown as {
  approvalStore?: ApprovalStore;
};

export const approvalStore =
  globalForStore.approvalStore ?? new ApprovalStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.approvalStore = approvalStore;
}

export function getDocumentVersionForApproval(
  documentId: string,
): Version | undefined {
  if (documentId === SERVICE_AGREEMENT_DOCUMENT.id) {
    return { ...SERVICE_AGREEMENT_VERSION };
  }

  const versions = documentStore.getVersions(documentId);
  const doc = documentStore.getDocumentById(documentId);
  if (!doc) return undefined;
  return (
    versions.find((version) => version.versionNumber === doc.currentVersion) ??
    versions[0]
  );
}
