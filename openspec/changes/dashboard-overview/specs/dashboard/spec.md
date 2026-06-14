# Dashboard Specification

## Purpose

Organizational overview landing page providing metrics, activity, quick actions, and document lifecycle visibility (screen01).

## ADDED Requirements

### Requirement: Dashboard page header

The system SHALL display an "Organizational Overview" page with subtitle showing status date and header actions.

#### Scenario: Dashboard header renders

- **WHEN** an authenticated user navigates to `/dashboard`
- **THEN** the page title "Organizational Overview" is displayed
- **AND** a subtitle shows status as of the current reporting date
- **AND** Filter and Export Report buttons are visible in the page header

### Requirement: Summary metric cards

The system SHALL display three summary cards: Total Documents, Pending Approvals, and Cloud Storage Usage.

#### Scenario: Total Documents card

- **WHEN** the dashboard loads
- **THEN** the Total Documents card shows the document count for the organization
- **AND** displays a period-over-period change indicator (e.g., percentage from last month)

#### Scenario: Pending Approvals card

- **WHEN** the dashboard loads
- **THEN** the Pending Approvals card shows the count of documents awaiting approval
- **AND** displays an urgent reviews indicator when applicable

#### Scenario: Cloud Storage Usage card

- **WHEN** the dashboard loads
- **THEN** the Cloud Storage Usage card shows used storage, total allocation, and percentage used
- **AND** displays a horizontal progress bar reflecting usage percentage

### Requirement: Recent Activity table

The system SHALL display a Recent Activity table showing the latest document actions across the organization.

#### Scenario: Activity table columns and data

- **WHEN** the dashboard loads
- **THEN** the Recent Activity table shows columns: Document, Action, User, Timestamp
- **AND** each row shows document name, classification tags, action type badge, acting user, and relative or absolute timestamp

#### Scenario: View All activity link

- **WHEN** the user clicks "View All" on Recent Activity
- **THEN** the system navigates to the Audit Log page

### Requirement: Quick Actions panel

The system SHALL display a Quick Actions panel with shortcuts for common tasks.

#### Scenario: Quick Actions list

- **WHEN** the dashboard loads
- **THEN** Quick Actions shows entries for Upload New Document, Create Folder, and Share Workspace
- **AND** each action is clickable and navigates or opens the corresponding flow

### Requirement: System Status panel

The system SHALL display a System Status panel showing operational health indicators.

#### Scenario: All systems operational

- **WHEN** all subsystems are healthy
- **THEN** the System Status panel shows "All systems operational" with a green indicator
- **AND** shows Encryption Engine status as Active
- **AND** shows Blockchain Audit status as Verified

### Requirement: Critical Document Lifecycle widget

The system SHALL display a Critical Document Lifecycle timeline for a featured high-priority document.

#### Scenario: Lifecycle timeline milestones

- **WHEN** the dashboard loads
- **THEN** a featured document name is displayed (e.g., master contract)
- **AND** a horizontal timeline shows version milestones with status dots (Draft, Conflict, Live)
- **AND** the current live version milestone is visually distinguished

#### Scenario: Navigate to featured document

- **WHEN** the user clicks the featured document name in the lifecycle widget
- **THEN** the system navigates to that document's detail page

### Requirement: Dashboard data refresh

The system SHALL load dashboard metrics from aggregated backend data on page load.

#### Scenario: Loading state

- **WHEN** dashboard data is being fetched
- **THEN** metric cards show skeleton or loading placeholders
- **AND** content replaces placeholders when data arrives

#### Scenario: Error state

- **WHEN** dashboard data fails to load
- **THEN** the system displays an error message with retry option
- **AND** does not show stale fabricated metrics

### Requirement: Export Report action

The system SHALL allow users with appropriate permissions to export an organizational overview report.

#### Scenario: Export report download

- **WHEN** a permitted user clicks Export Report
- **THEN** the system generates and downloads a report containing current dashboard metrics
