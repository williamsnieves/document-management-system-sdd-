# roles Specification

## Purpose
TBD - created by archiving change roles-permissions. Update Purpose after archive.
## Requirements
### Requirement: Role Management page

The system SHALL display a Role Management page for defining organizational roles and permissions.

#### Scenario: Role management header

- **WHEN** an admin navigates to `/settings/roles`
- **THEN** the page shows title "Role Management", description of impact on audit paths and visibility, and a Create New Role button

### Requirement: System roles list

The system SHALL display predefined and custom roles with descriptions and assigned user counts.

#### Scenario: Default system roles

- **WHEN** the role management page loads
- **THEN** the System Roles panel lists Global Admin, Legal Counsel, Document Editor, and Viewer
- **AND** each role shows description and user count (e.g., "12 Users")

#### Scenario: Select role for editing

- **WHEN** the admin clicks Document Editor in the roles list
- **THEN** that role is highlighted as selected
- **AND** its permission matrix loads in the right panel

### Requirement: Permission matrix editor

The system SHALL allow editing granular permissions per role across three categories.

#### Scenario: Document Access permissions

- **WHEN** a role is selected
- **THEN** the Document Access section shows checkboxes for: View Documents, Upload New Files, Edit Metadata & Content, Delete Documents, Restore Versions
- **AND** checked state reflects the role's saved permissions

#### Scenario: Workflow permissions

- **WHEN** a role is selected
- **THEN** the Workflow section shows checkboxes for: Approve Documents, Reject & Archive, Request Changes

#### Scenario: Administration permissions

- **WHEN** a role is selected
- **THEN** the Administration section shows checkboxes for: Manage Users, View Audit Logs
- **AND** restricted permissions show explanatory notes (e.g., reserved for Legal Counsel and Admins)

### Requirement: Save role permissions

The system SHALL persist permission changes when the admin saves.

#### Scenario: Save permissions

- **WHEN** the admin modifies checkboxes and clicks Save Permissions
- **THEN** the role's permissions are persisted
- **AND** an audit event records the permission update
- **AND** the unsaved changes indicator clears

#### Scenario: Unsaved changes indicator

- **WHEN** the admin modifies permissions without saving
- **THEN** a floating bar shows "Unsaved Changes" with Reset and Sync Permissions actions

#### Scenario: Reset unsaved changes

- **WHEN** the admin clicks Reset on the unsaved changes bar
- **THEN** checkboxes revert to last saved state

### Requirement: Create custom role

The system SHALL allow administrators to create new custom roles.

#### Scenario: Create new role flow

- **WHEN** the admin clicks Create New Role
- **THEN** the system prompts for role name and description
- **AND** creates a new Custom Role with default permissions upon confirmation
- **AND** the new role appears in the System Roles list

### Requirement: RBAC enforcement on document actions

The system SHALL enforce role permissions on all document operations.

#### Scenario: Viewer cannot upload

- **WHEN** a user with Viewer role attempts to upload a document
- **THEN** the system denies the action

#### Scenario: Document Editor can upload and edit

- **WHEN** a user with Document Editor role has Upload and Edit permissions
- **THEN** the user can upload files and edit metadata
- **AND** cannot delete documents if Delete permission is unchecked

#### Scenario: Viewer cannot view audit logs

- **WHEN** a Viewer attempts to access audit log
- **THEN** access is denied even if they navigate directly to `/audit-log`

### Requirement: Role assignment to users

The system SHALL associate each user with one or more roles determining their permissions.

#### Scenario: User inherits role permissions

- **WHEN** a user is assigned the Legal Counsel role
- **THEN** the user receives all permissions configured for Legal Counsel
- **AND** permission changes to the role apply to all assigned users on next authorization check

### Requirement: Global Admin full access

The system SHALL grant Global Admin role unrestricted system access.

#### Scenario: Global Admin bypasses permission checks

- **WHEN** a Global Admin performs any system action
- **THEN** the action is permitted regardless of individual permission flags

