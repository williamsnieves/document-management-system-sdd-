## Context

RBAC is a core PRD requirement (screen07). Roles drive permission checks across library, documents, approvals, and audit.

## Goals / Non-Goals

**Goals:**
- Four default system roles with configurable permissions
- Custom role creation
- Permission matrix editor with unsaved state tracking
- Middleware/guard enforcement on API and UI

**Non-Goals:**
- Per-document ACL override (document permissions panel is separate, in documents change)
- Attribute-based access control (ABAC)
- Dynamic policy scripting

## Decisions

### Decision: Permission enum with categories

```typescript
enum Permission {
  VIEW_DOCUMENTS, UPLOAD, EDIT_METADATA, DELETE, RESTORE_VERSIONS,
  APPROVE, REJECT_ARCHIVE, REQUEST_CHANGES,
  MANAGE_USERS, VIEW_AUDIT_LOGS
}
```

### Decision: Role-Permission many-to-many

`Role { id, name, description, isSystem, permissions[] }`
`UserRole { userId, roleId }`

### Decision: `hasPermission(user, permission)` utility

Used in API route handlers and UI conditional rendering.

### Decision: Global Admin bypass

Global Admin role skips permission checks entirely.

## Risks / Trade-offs

- **[Risk] Permission drift between UI and API** → Single shared permission constants module
- **[Risk] Unsaved changes lost on navigation** → Floating bar warning per screen07

## Migration Plan

Seed four default roles with permissions matching screen07 Document Editor example on first deploy.

## Open Questions

- Multi-role users: union of permissions (recommended) vs most restrictive — use union
