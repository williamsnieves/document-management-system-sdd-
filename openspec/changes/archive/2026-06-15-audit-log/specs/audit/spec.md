# Audit Specification

## Purpose

Comprehensive immutable audit log for document actions and system events (screen05). PRD success metric: complete audit trail.

## ADDED Requirements

### Requirement: Audit log page

The system SHALL display an Audit Log page with title, description, and export actions.

#### Scenario: Audit log header

- **WHEN** a user with audit log view permission navigates to `/audit-log`
- **THEN** the page shows title "Audit Log" and description "Comprehensive history of all document actions and system events"
- **AND** Export PDF and Export CSV buttons are visible

### Requirement: Audit event table

The system SHALL display audit events in a paginated table.

#### Scenario: Table columns

- **WHEN** the audit log loads
- **THEN** the table shows columns: Timestamp, User, Action, Resource, IP/Location, Status
- **AND** each row represents one auditable event

#### Scenario: Resource links

- **WHEN** an audit event references a single document or folder
- **THEN** the Resource column shows a clickable link to that resource
- **AND** mass operations show "Multiple (N Items)" without individual links

### Requirement: Audit event status badges

The system SHALL classify audit events with status badges: Success, Warning, Critical.

#### Scenario: Success event badge

- **WHEN** an event completed normally (e.g., "Created Version v4.0")
- **THEN** the Status column shows a green Success badge

#### Scenario: Critical event badge

- **WHEN** an event represents a security concern (e.g., "Mass Deletion Attempt")
- **THEN** the Status column shows a Critical badge

### Requirement: Audit log filters

The system SHALL provide filters for Date Range, Event Type, User, and Severity.

#### Scenario: Filter by last 24 hours

- **WHEN** the user selects Date Range "Last 24 Hours"
- **THEN** only events from the last 24 hours are displayed

#### Scenario: Filter by event type

- **WHEN** the user selects a specific event type (e.g., Permission Update)
- **THEN** only matching events are displayed

#### Scenario: Combined filters

- **WHEN** multiple filters are active
- **THEN** results match all active filter criteria

### Requirement: Audit log pagination

The system SHALL paginate audit log results with record count display.

#### Scenario: Pagination controls

- **WHEN** more events exist than the page size
- **THEN** the footer shows "Showing 1-10 of N events"
- **AND** Previous and Next buttons navigate pages
- **AND** Previous is disabled on the first page

### Requirement: Export audit log

The system SHALL allow permitted users to export filtered audit results.

#### Scenario: Export CSV

- **WHEN** the user clicks Export CSV
- **THEN** the system downloads a CSV file containing currently filtered audit events

#### Scenario: Export PDF

- **WHEN** the user clicks Export PDF
- **THEN** the system downloads a PDF report of currently filtered audit events

### Requirement: Audit event recording

The system SHALL automatically record audit events for document and security actions.

#### Scenario: Document upload recorded

- **WHEN** a user uploads a new document
- **THEN** an audit event is created with action "New Upload", user, resource, timestamp, IP/location, and Success status

#### Scenario: Version creation recorded

- **WHEN** a user creates a new document version
- **THEN** an audit event is created with action including version number

#### Scenario: Approval decision recorded

- **WHEN** a reviewer approves or rejects a document
- **THEN** an audit event records the decision, reviewer, and document resource

#### Scenario: Permission change recorded

- **WHEN** document or role permissions are modified
- **THEN** an audit event records "Permission Update" with affected resource

#### Scenario: Failed unauthorized action recorded

- **WHEN** a user attempts an unauthorized action (e.g., mass deletion without permission)
- **THEN** an audit event is recorded with Warning or Critical status

### Requirement: Audit log access control

The system SHALL restrict audit log access to users with View Audit Logs permission.

#### Scenario: Unauthorized audit log access

- **WHEN** a user without audit permission navigates to `/audit-log`
- **THEN** the system denies access with a permission error or redirect
