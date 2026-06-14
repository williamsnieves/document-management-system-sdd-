## Why

Legal and operations teams need an at-a-glance organizational overview to monitor document volume, pending approvals, storage usage, recent activity, and critical document lifecycle status. The dashboard is the default landing experience after onboarding (screen01).

## What Changes

- Add Dashboard page with "Organizational Overview" title and status date
- Add summary metric cards: Total Documents, Pending Approvals, Cloud Storage Usage
- Add Recent Activity table with document, action, user, and timestamp columns
- Add Quick Actions panel (Upload, Create Folder, Share Workspace)
- Add System Status panel (operational state, encryption, blockchain audit indicators)
- Add Critical Document Lifecycle timeline widget for a featured document
- Add Filter and Export Report actions in page header

## Capabilities

### New Capabilities

- `dashboard`: Organizational overview metrics, activity feed, quick actions, system status, and document lifecycle widget

### Modified Capabilities

- (none)

## Impact

- New route `/dashboard`
- API endpoints for aggregated metrics and recent activity
- Depends on `app-shell` layout and cross-feature data from library, approvals, and audit domains
