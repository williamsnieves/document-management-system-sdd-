## Context

Dashboard aggregates data from documents, approvals, storage, and audit domains. Primary landing page after onboarding (screen01).

## Goals / Non-Goals

**Goals:**
- Metric cards with real aggregated data
- Recent activity feed (subset of audit events)
- Quick actions linking to existing flows
- Document lifecycle widget for featured document

**Non-Goals:**
- Custom report builder
- Real-time WebSocket updates (polling or SSR sufficient for v1)
- Advanced OCR or analytics

## Decisions

### Decision: Server Components for initial data fetch

Dashboard page fetches metrics via server-side data access or API route on load.

**Rationale:** Reduces client bundle; good for aggregated read-only data.

### Decision: `GET /api/dashboard/overview` aggregation endpoint

Single endpoint returns metrics, recent activity, featured lifecycle document, and system status.

**Rationale:** One round-trip for dashboard; backend handles aggregation logic.

### Decision: Featured document selection

Backend selects highest-priority in-progress document (configurable: most recent conflict or longest in review).

## Risks / Trade-offs

- **[Risk] Slow aggregation queries** → Add DB indexes on document status, updated_at; cache overview for 60s
- **[Risk] Empty state for new orgs** → Show zero-state cards with onboarding-appropriate copy

## Migration Plan

N/A — greenfield.

## Open Questions

- Export Report format: default to PDF via server-side generation library
