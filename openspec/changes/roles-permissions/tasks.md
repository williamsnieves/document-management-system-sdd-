## 1. Data Model & API

- [x] 1.1 Define Role, Permission, and UserRole schemas
- [x] 1.2 Seed default roles: Global Admin, Legal Counsel, Document Editor, Viewer
- [x] 1.3 Implement `GET /api/roles` list with user counts
- [x] 1.4 Implement `GET /api/roles/[id]` with permissions
- [x] 1.5 Implement `PUT /api/roles/[id]/permissions` update
- [x] 1.6 Implement `POST /api/roles` create custom role
- [x] 1.7 Implement `hasPermission()` authorization utility

## 2. Role Management UI

- [x] 2.1 Create RoleManagementPage with header and Create New Role button
- [x] 2.2 Create RolesList panel with selection highlighting
- [x] 2.3 Create PermissionMatrix editor with three category sections
- [x] 2.4 Implement unsaved changes floating bar (Reset, Sync Permissions)
- [x] 2.5 Create New Role modal/form

## 3. Enforcement

- [ ] 3.1 Add permission middleware to document API routes
- [x] 3.2 Add permission middleware to approval API routes
- [ ] 3.3 Add permission guard to audit log page and API
- [ ] 3.4 Conditionally render UI actions based on user permissions
- [x] 3.5 Implement Global Admin bypass in authorization utility

## 4. Integration

- [ ] 4.1 Record permission changes as audit events
- [x] 4.2 Display reserved permission notes for admin-only capabilities
