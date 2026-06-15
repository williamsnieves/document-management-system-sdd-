## 1. Data Model & API

- [x] 1.1 Define WorkflowInstance schema (documentId, steps, reviewers, currentStep, status)
- [x] 1.2 Define WorkflowEvent schema for activity timeline
- [x] 1.3 Implement `GET /api/approvals` pending queue endpoint
- [x] 1.4 Implement `GET /api/approvals/[documentId]` workflow detail endpoint
- [x] 1.5 Implement `POST /api/documents/[id]/submit` submit for approval
- [x] 1.6 Implement `POST /api/approvals/[documentId]/approve`
- [x] 1.7 Implement `POST /api/approvals/[documentId]/reject`
- [x] 1.8 Implement `POST /api/approvals/[documentId]/request-changes`
- [x] 1.9 Implement `POST /api/approvals/[documentId]/comments` with optional attachment

## 2. Approvals UI

- [x] 2.1 Create ApprovalsQueuePage listing pending documents
- [x] 2.2 Create ApprovalDetailPage split layout (preview + sidebar)
- [x] 2.3 Create WorkflowProgressBar with step labels
- [x] 2.4 Create ReviewersList with status badges
- [x] 2.5 Create ActivityTimeline with comment input
- [x] 2.6 Create Approve/Reject/Request Changes action footer
- [x] 2.7 Render internal notes as highlighted callout boxes in preview

## 3. State Transitions

- [x] 3.1 Wire approve to advance reviewer chain and update document status
- [x] 3.2 Wire reject to halt workflow and notify author
- [x] 3.3 Wire request-changes to return document to draft
- [x] 3.4 Disable actions for non-pending reviewers

## 4. Integration

- [x] 4.1 Record all workflow actions as audit events
- [x] 4.2 Update dashboard pending approvals metric on status change
- [x] 4.3 Create in-app notification stubs for author and next reviewer
