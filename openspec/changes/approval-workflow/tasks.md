## 1. Data Model & API

- [ ] 1.1 Define WorkflowInstance schema (documentId, steps, reviewers, currentStep, status)
- [ ] 1.2 Define WorkflowEvent schema for activity timeline
- [ ] 1.3 Implement `GET /api/approvals` pending queue endpoint
- [ ] 1.4 Implement `GET /api/approvals/[documentId]` workflow detail endpoint
- [ ] 1.5 Implement `POST /api/documents/[id]/submit` submit for approval
- [ ] 1.6 Implement `POST /api/approvals/[documentId]/approve`
- [ ] 1.7 Implement `POST /api/approvals/[documentId]/reject`
- [ ] 1.8 Implement `POST /api/approvals/[documentId]/request-changes`
- [ ] 1.9 Implement `POST /api/approvals/[documentId]/comments` with optional attachment

## 2. Approvals UI

- [ ] 2.1 Create ApprovalsQueuePage listing pending documents
- [ ] 2.2 Create ApprovalDetailPage split layout (preview + sidebar)
- [ ] 2.3 Create WorkflowProgressBar with step labels
- [ ] 2.4 Create ReviewersList with status badges
- [ ] 2.5 Create ActivityTimeline with comment input
- [ ] 2.6 Create Approve/Reject/Request Changes action footer
- [ ] 2.7 Render internal notes as highlighted callout boxes in preview

## 3. State Transitions

- [ ] 3.1 Wire approve to advance reviewer chain and update document status
- [ ] 3.2 Wire reject to halt workflow and notify author
- [ ] 3.3 Wire request-changes to return document to draft
- [ ] 3.4 Disable actions for non-pending reviewers

## 4. Integration

- [ ] 4.1 Record all workflow actions as audit events
- [ ] 4.2 Update dashboard pending approvals metric on status change
- [ ] 4.3 Create in-app notification stubs for author and next reviewer
