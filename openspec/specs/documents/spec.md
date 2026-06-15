# documents Specification

## Purpose
TBD - created by archiving change document-detail-versioning. Update Purpose after archive.
## Requirements
### Requirement: Document detail page

The system SHALL display a document detail page accessible from the library and other references.

#### Scenario: Document header with metadata

- **WHEN** the user navigates to `/library/[documentId]`
- **THEN** breadcrumbs show Library > category path > document filename
- **AND** the document title, status badge, and last-updated metadata are displayed
- **AND** Share, Edit Metadata, and Download Final action buttons are visible

#### Scenario: Approved document status badge

- **WHEN** the document status is Approved
- **THEN** a green "Approved" badge with checkmark is displayed in the header

### Requirement: Document preview viewer

The system SHALL render an in-browser preview of the document with viewer controls.

#### Scenario: PDF preview with controls

- **WHEN** the user views a PDF document
- **THEN** the preview area renders the document content
- **AND** toolbar shows zoom controls, page indicator (Page N of M), print, and expand actions

#### Scenario: Unsupported preview format

- **WHEN** the document format cannot be previewed in-browser
- **THEN** the system shows a placeholder with download option instead of a broken preview

### Requirement: Version history timeline

The system SHALL display a version history sidebar listing all versions in reverse chronological order.

#### Scenario: Current version highlighted

- **WHEN** the version history loads
- **THEN** the current live version is marked CURRENT with a green indicator
- **AND** each entry shows version number, description, author, and timestamp

#### Scenario: Conflict resolved version marker

- **WHEN** a version was created from conflict resolution
- **THEN** that version entry shows a CONFLICT RESOLVED badge with orange indicator

#### Scenario: View all versions

- **WHEN** the user clicks "View All N Versions"
- **THEN** the system expands or navigates to the full version history list

### Requirement: Create new document version

The system SHALL allow permitted users to upload a new version of an existing document.

#### Scenario: Upload new version

- **WHEN** a permitted user uploads a new file for an existing document
- **THEN** the system creates a new version record with incremented version number
- **AND** records the author, timestamp, and optional change description
- **AND** the new version becomes the current draft or live version per workflow rules

### Requirement: Restore previous version

The system SHALL allow permitted users to promote a previous version to live.

#### Scenario: Restore version to live

- **WHEN** a permitted user selects Restore on a historical version
- **THEN** the system promotes that version to the current live version
- **AND** records the restoration in version history and audit log

### Requirement: Version conflict detection

The system SHALL detect version conflicts when concurrent edits produce divergent versions (PRD edge case).

#### Scenario: Concurrent version conflict detected

- **WHEN** two users upload new versions from the same base version concurrently
- **THEN** the system marks the document as having a version conflict
- **AND** displays a conflict indicator on the document in library and detail views

#### Scenario: Conflict blocks automatic promotion

- **WHEN** a version conflict exists
- **THEN** neither conflicting version is automatically promoted to live
- **AND** the document requires manual conflict resolution

### Requirement: Version conflict resolution

The system SHALL provide a manual merge workflow to resolve version conflicts.

#### Scenario: Resolve conflict with manual merge

- **WHEN** a permitted user initiates conflict resolution
- **THEN** the system presents conflicting versions for comparison
- **AND** allows the user to create a merged version with a description (e.g., "Manual merge of Clause 4.2 updates")
- **AND** the merged version is recorded with CONFLICT RESOLVED status

### Requirement: Access permissions panel

The system SHALL display document access permissions showing users and groups with roles.

#### Scenario: Permissions list

- **WHEN** the document detail page loads
- **THEN** the Access Permissions card lists users/groups with roles (Owner, Editor, Viewer)
- **AND** provides a Manage access link for permitted users

### Requirement: Classification and tags

The system SHALL display and allow management of document tags and confidentiality classification.

#### Scenario: Tags displayed

- **WHEN** the document detail page loads
- **THEN** classification tags (e.g., Legal, Services, FY24) are shown as pills
- **AND** permitted users can add new tags via "+ Add Tag"

#### Scenario: Confidentiality level

- **WHEN** the document has a confidentiality classification
- **THEN** the Classification card shows the level (e.g., Restricted Internal) with appropriate severity indicator

### Requirement: Audit health panel

The system SHALL display document integrity and retention health indicators.

#### Scenario: Audit health indicators

- **WHEN** the document detail page loads
- **THEN** the Audit Health card shows Integrity Check status, Last Backup time, Retention Policy, and Doc Score with progress bar

### Requirement: Download final approved document

The system SHALL allow downloading the current approved/live document binary.

#### Scenario: Download final

- **WHEN** the user clicks Download Final on an approved document
- **THEN** the system downloads the live version file to the user's device

### Requirement: Share document

The system SHALL allow permitted users to share document access with other users.

#### Scenario: Share action opens share dialog

- **WHEN** a permitted user clicks Share
- **THEN** the system opens a dialog to invite users or copy a secure link
- **AND** records the share action in the audit log

