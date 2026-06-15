# approvals Specification

## Purpose
TBD - created by archiving change approval-workflow. Update Purpose after archive.
## Requirements
### Requirement: Approvals queue page

The system SHALL display an Approvals page listing documents pending the current user's review or organization-wide pending items.

#### Scenario: Approvals navigation active

- **WHEN** the user navigates to `/approvals`
- **THEN** the Approvals sidebar and top navigation item are highlighted as active
- **AND** pending documents awaiting action are listed

### Requirement: Approval detail view

The system SHALL display a split view with document preview on the left and workflow panel on the right.

#### Scenario: Document preview in approval context

- **WHEN** the user opens an approval for `Service_Agreement_v4_Draft.pdf`
- **THEN** the document preview shows content including internal legal notes highlighted in callout boxes
- **AND** Download and History actions are available in the document header

### Requirement: Workflow progress indicator

The system SHALL display workflow progress showing current step of total steps.

#### Scenario: Step 2 of 3 in progress

- **WHEN** a document is in executive approval stage
- **THEN** the workflow panel shows "Step 2 of 3"
- **AND** a progress bar indicates completed stages (e.g., Legal Review Complete) and pending stages (e.g., Executive Approval)

### Requirement: Required reviewers list

The system SHALL list all required reviewers with individual status.

#### Scenario: Reviewer statuses

- **WHEN** the approval detail loads
- **THEN** each required reviewer shows name, title, avatar, and status: Approved (green), Pending (bold), or Upcoming (gray)
- **AND** the current user is labeled "(You)" when they are a reviewer

### Requirement: Activity and comments timeline

The system SHALL display a chronological activity feed for the approval workflow.

#### Scenario: Submission and approval entries

- **WHEN** the approval detail loads
- **THEN** the timeline shows events such as submission and prior approvals with user, timestamp, and comments

#### Scenario: Add comment

- **WHEN** a reviewer enters a comment and submits
- **THEN** the comment is appended to the activity timeline
- **AND** optional file attachment is supported via Attach File link

### Requirement: Approve document

The system SHALL allow the current pending reviewer to approve the document.

#### Scenario: Successful approval advances workflow

- **WHEN** the pending reviewer clicks APPROVE
- **THEN** the reviewer's status changes to Approved
- **AND** if more reviewers remain, the workflow advances to the next reviewer as Upcoming/Pending
- **AND** if all reviewers approve, the document status changes to Approved
- **AND** an audit event is recorded

### Requirement: Reject document

The system SHALL allow the current pending reviewer to reject the document.

#### Scenario: Rejection halts workflow

- **WHEN** the pending reviewer clicks REJECT
- **THEN** the system prompts for optional rejection reason
- **AND** the workflow status changes to Rejected
- **AND** the document author is notified
- **AND** an audit event is recorded

### Requirement: Request changes

The system SHALL allow reviewers to send the document back to the author for revisions.

#### Scenario: Request changes and notify author

- **WHEN** the reviewer selects "Request Changes & Notify Author"
- **THEN** the document returns to Draft or In Review status for the author
- **AND** the author receives notification with reviewer comments
- **AND** the workflow resets or returns to the drafting stage per configuration

### Requirement: Submit document for approval

The system SHALL allow document owners/editors to submit documents into the approval workflow.

#### Scenario: Submit draft for review

- **WHEN** a permitted user submits a draft document for approval
- **THEN** the document enters In Review status
- **AND** the first reviewer in the workflow is set to Pending
- **AND** an audit event records the submission

### Requirement: Approval permission enforcement

The system SHALL enforce that only assigned pending reviewers can approve, reject, or request changes.

#### Scenario: Non-reviewer cannot approve

- **WHEN** a user who is not the current pending reviewer attempts to approve
- **THEN** the system denies the action with a permission error
- **AND** Approve/Reject buttons are disabled or hidden for that user

