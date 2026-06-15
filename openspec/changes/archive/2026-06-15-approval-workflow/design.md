## Context

Approval workflow implements PRD Upload → Review → Approve (screen04). Multi-reviewer sequential workflow with comments.

## Goals / Non-Goals

**Goals:**
- Configurable multi-step reviewer chain
- Approve, Reject, Request Changes actions
- Activity timeline with comments
- Status transitions on document and workflow

**Non-Goals:**
- Complex BPMN workflow designer
- External e-signature providers (DocuSign) in v1
- Parallel approval quorum logic (sequential for v1)

## Decisions

### Decision: Workflow state machine

```
States: draft → submitted → in_review → approved | rejected | changes_requested
```

Each workflow instance has ordered `reviewers[]` with individual status.

### Decision: Sequential reviewer activation

Only one reviewer is Pending at a time; others are Upcoming until prior approves.

**Rationale:** Matches screen04 UX exactly.

### Decision: Default 3-step workflow template

Legal Review → Executive Approval → Final Sign-off (configurable count).

### Decision: Internal notes as document annotations

Stored as `DocumentAnnotation` linked to document, visible in approval preview.

## Risks / Trade-offs

- **[Risk] Notification delivery** → v1 uses in-app notifications; email is stub/log only
- **[Risk] Workflow rigidity** → Template-based; custom per-document workflow is v2

## Migration Plan

N/A — greenfield.

## Open Questions

- Auto-submit on upload or manual submit — recommend manual submit for control
