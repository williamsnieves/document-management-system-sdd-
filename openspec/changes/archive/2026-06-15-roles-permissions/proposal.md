## Why

Role-based access control is a core PRD requirement. Administrators must define system roles and granular document, workflow, and administration permissions (screen07).

## What Changes

- Add Role Management page under Settings
- Add system roles list with user counts (Global Admin, Legal Counsel, Document Editor, Viewer)
- Add permission matrix editor for selected role
- Add permission categories: Document Access, Workflow, Administration
- Add Create New Role action
- Add unsaved-changes floating bar with Reset and Sync Permissions
- Enforce permission checks across library, documents, approvals, and audit features

## Capabilities

### New Capabilities

- `roles`: Role definitions, permission matrix, and RBAC enforcement

### Modified Capabilities

- (none)

## Impact

- New route `/settings/roles`
- Roles and permissions API
- Authorization middleware/guards used by all protected routes and APIs
- Depends on `app-shell`; required by `approval-workflow`, `document-library`, and `audit-log`
