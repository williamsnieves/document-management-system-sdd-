# library Specification

## Purpose
TBD - created by archiving change document-library. Update Purpose after archive.
## Requirements
### Requirement: Library workspace page

The system SHALL display a Library Workspace page as the primary document listing surface.

#### Scenario: Library page header

- **WHEN** an authenticated user navigates to `/library`
- **THEN** the page title "Library Workspace" is displayed
- **AND** sort and list view toggle controls are visible

### Requirement: Category filters

The system SHALL provide category filter checkboxes with document counts per category.

#### Scenario: Filter by Legal Documents category

- **WHEN** the user checks "Legal Documents" and unchecks other categories
- **THEN** the document list shows only documents tagged as Legal
- **AND** the category label shows the count of matching documents

#### Scenario: Multiple category selection

- **WHEN** the user selects multiple categories
- **THEN** the document list shows documents matching any selected category

### Requirement: Status legend

The system SHALL display a status legend mapping colors to document states: Approved (green), In Review (orange), Draft (blue).

#### Scenario: Status legend visible

- **WHEN** the library page loads
- **THEN** the status legend is displayed in the filter panel
- **AND** document rows use consistent status color indicators

### Requirement: Document list table

The system SHALL display documents in a table with columns: Document Name, Owner, Last Modified, and Version.

#### Scenario: Document row content

- **WHEN** the library lists documents
- **THEN** each row shows file type icon, document name, document ID, category tag, owner avatar and name, last modified date, and version number
- **AND** draft documents with issues show a warning indicator on the version column

#### Scenario: Navigate to document detail

- **WHEN** the user clicks a document row
- **THEN** the system navigates to that document's detail page

### Requirement: Sort documents

The system SHALL allow users to sort the document list.

#### Scenario: Sort by last modified descending

- **WHEN** the user selects sort by Last Modified (newest first)
- **THEN** documents are ordered with most recently modified at the top

### Requirement: List and grid view toggle

The system SHALL provide a toggle between list and grid view layouts.

#### Scenario: Switch to grid view

- **WHEN** the user toggles to grid view
- **THEN** documents display as cards in a grid layout with the same filter and sort applied

### Requirement: Library recent activity feed

The system SHALL display a Recent Activity feed on the library page showing document-specific events.

#### Scenario: Activity feed entries

- **WHEN** the library page loads
- **THEN** recent activity shows entries such as approvals and review requests with user, document, and relative timestamp
- **AND** entries use color-coded left borders matching event type

### Requirement: Security status card

The system SHALL display a Security Status card on the library page.

#### Scenario: Vault secure status

- **WHEN** the library page loads
- **THEN** a Security Status card shows "Vault Status: Secure"
- **AND** describes encryption protocol and active audit trails
- **AND** provides a Security Report button

### Requirement: Document upload

The system SHALL allow users with upload permission to add new documents to the library.

#### Scenario: Upload via header or FAB

- **WHEN** a permitted user initiates upload from the header or FAB
- **THEN** an upload dialog or page accepts one or more files
- **AND** on successful upload a new document record is created with version v1.0.0 and Draft status

#### Scenario: Upload unsupported file type

- **WHEN** the user attempts to upload a disallowed file type
- **THEN** the system rejects the upload with a clear error message
- **AND** no document record is created

#### Scenario: Upload without permission

- **WHEN** a user without upload permission attempts upload
- **THEN** the system denies the action with a permission error

### Requirement: Create folder action

The system SHALL allow permitted users to create folders in the library workspace.

#### Scenario: Create new folder

- **WHEN** a permitted user selects Create Folder from Quick Actions or library actions
- **THEN** the system prompts for a folder name
- **AND** creates the folder in the current workspace upon confirmation

