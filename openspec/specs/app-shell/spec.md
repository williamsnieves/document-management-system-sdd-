# app-shell Specification

## Purpose
TBD - created by archiving change app-shell-navigation. Update Purpose after archive.
## Requirements
### Requirement: Persistent sidebar navigation

The system SHALL display a fixed left sidebar on all authenticated app pages with branding "LegalCorp DMS" and subtitle "Enterprise Edition".

#### Scenario: Sidebar displays primary navigation items

- **WHEN** an authenticated user views any app page
- **THEN** the sidebar shows navigation links for Dashboard, Library, Approvals, and Settings
- **AND** the sidebar shows bottom links for Audit Log and Support
- **AND** the sidebar shows a "New Workspace" primary action button

#### Scenario: Active navigation item is highlighted

- **WHEN** the user is on the Library page
- **THEN** the Library navigation item is visually highlighted with a light blue active state

#### Scenario: Sidebar navigation routes correctly

- **WHEN** the user clicks a sidebar navigation item
- **THEN** the system navigates to the corresponding route without full page reload

### Requirement: Top header with global actions

The system SHALL display a top header on all authenticated app pages with product name "LexVault DMS", a centered search bar, and right-side utility actions.

#### Scenario: Header displays global utilities

- **WHEN** an authenticated user views any app page
- **THEN** the header shows a search input with placeholder text for document search
- **AND** the header shows notification bell, help icon, History link, Upload button, and user profile avatar

#### Scenario: Upload button is accessible globally

- **WHEN** the user clicks the Upload button in the header
- **THEN** the system opens the document upload flow

### Requirement: Global search entry

The system SHALL provide a global search bar in the header that accepts text queries and navigates to search results.

#### Scenario: Submit search from header

- **WHEN** the user enters a query in the header search bar and submits
- **THEN** the system navigates to the Library page with the search query applied
- **AND** matching documents are displayed in the library list

#### Scenario: Empty search submission

- **WHEN** the user submits an empty search query
- **THEN** the system navigates to the Library page without filters applied

### Requirement: Authenticated app layout wrapper

The system SHALL wrap all main application routes in a shared layout providing sidebar and header.

#### Scenario: App pages use shared layout

- **WHEN** the user navigates to Dashboard, Library, Approvals, Settings, or Audit Log
- **THEN** the page content renders inside the shared layout main content area
- **AND** sidebar and header remain visible and consistent

#### Scenario: Onboarding routes exclude main app sidebar

- **WHEN** the user is on an onboarding route (`/onboarding/*`)
- **THEN** the main app sidebar and header are NOT displayed
- **AND** the onboarding-specific header is shown instead

### Requirement: Floating action button for quick upload

The system SHALL display a floating action button (FAB) on Dashboard and Library pages for quick document upload.

#### Scenario: FAB visible on supported pages

- **WHEN** the user is on the Dashboard or Library page
- **THEN** a floating action button with upload icon is visible in the bottom-right corner

#### Scenario: FAB triggers upload

- **WHEN** the user clicks the FAB
- **THEN** the system opens the same upload flow as the header Upload button

### Requirement: Storage usage indicator in sidebar

The system SHALL display organization storage usage in the sidebar on applicable screens (screen02 pattern).

#### Scenario: Storage widget displays usage

- **WHEN** the user views the Library page sidebar area
- **THEN** a storage usage widget shows used amount, total allocation, and a progress bar

### Requirement: Settings section sub-navigation

The system SHALL provide sub-navigation tabs within Settings for Overview, Users, Role Management, and Security (screen06–screen07).

#### Scenario: Settings sub-nav highlights active section

- **WHEN** the user navigates to Settings > Security
- **THEN** the Security sub-navigation tab is underlined as active
- **AND** other settings tabs remain accessible

