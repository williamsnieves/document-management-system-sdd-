## Why

A complete audit trail is the PRD success metric. Administrators and auditors must view, filter, and export a comprehensive history of document actions and system events (screen05).

## What Changes

- Add Audit Log page with filterable event table
- Add filters: Date Range, Event Type, User, Severity
- Add table columns: Timestamp, User, Action, Resource, IP/Location, Status
- Add status badges: Success, Warning, Critical
- Add pagination with record count display
- Add Export PDF and Export CSV actions
- Record audit events for all document lifecycle actions (upload, version, approve, reject, permission change, delete attempt)

## Capabilities

### New Capabilities

- `audit`: Immutable audit event log with filtering, pagination, and export

### Modified Capabilities

- (none)

## Impact

- New route `/audit-log`
- Audit event ingestion from all feature modules
- Audit query API with filters and export endpoints
- Depends on `app-shell`; consumed by security and roles changes for cross-links
