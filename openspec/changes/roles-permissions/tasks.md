## 1. Data Model & API

- [ ] 1.1 Define Role, Permission, and UserRole schemas
- [ ] 1.2 Seed default roles: Global Admin, Legal Counsel, Document Editor, Viewer
- [ ] 1.3 Implement `GET /api/roles` list with user counts
- [ ] 1.4 Implement `GET /api/roles/[id]` with permissions
- [ ] 1.5 Implement `PUT /api/roles/[id]/permissions` update
- [ ] 1.6 Implement `POST /api/roles` create custom role
- [ ] 1.7 Implement `hasPermission()` authorization utility

## 2. Role Management UI

- [ ] 2.1 Create RoleManagementPage with header and Create New Role button
- [ ] 2.2 Create RolesList panel with selection highlighting
- [ ] 2.3 Create PermissionMatrix editor with three category sections
- [ ] 2.4 Implement unsaved changes floating bar (Reset, Sync Permissions)
- [ ] 2.5 Create New Role modal/form

## 3. Enforcement

- [ ] 3.1 Add permission middleware to document API routes
- [ ] 3.2 Add permission middleware to approval API routes
- [ ] 3.3 Add permission guard to audit log page and API
- [ ] 3.4 Conditionally render UI actions based on user permissions
- [ ] 3.5 Implement Global Admin bypass in authorization utility

## 4. Integration

- [ ] 4.1 Record permission changes as audit events
- [ ] 4.2 Display reserved permission notes for admin-only capabilities
