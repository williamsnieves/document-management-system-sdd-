## Why

The PRD requires a simple approval workflow (Upload → Review → Approve). Legal teams need multi-step review with assigned reviewers, comments, and explicit approve/reject/request-changes actions (screen04).

## What Changes

- Add Approvals page listing documents pending review
- Add approval detail view with document preview and workflow sidebar
- Add workflow progress indicator (step N of M)
- Add required reviewers list with status (Approved, Pending, Upcoming)
- Add activity and comments timeline
- Add actions: Approve, Reject, Request Changes & Notify Author
- Add internal notes visible during review
- Enforce sequential or parallel reviewer rules per workflow configuration

## Capabilities

### New Capabilities

- `approvals`: Multi-step document approval workflow, reviewer assignment, comments, and decision actions

### Modified Capabilities

- (none)

## Impact

- New routes `/approvals` and `/approvals/[documentId]`
- Workflow state machine API (submit, approve, reject, request-changes)
- Notification hooks for author and next reviewer
- Depends on `documents`, `roles-permissions`, and `audit-log` for event recording
