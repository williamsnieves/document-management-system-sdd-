# onboarding Specification

## Purpose
TBD - created by archiving change onboarding-flow. Update Purpose after archive.
## Requirements
### Requirement: Admin onboarding configuration page

The system SHALL provide an Onboarding Configuration page for enterprise admins under Settings > Roles.

#### Scenario: Onboarding config header

- **WHEN** an admin navigates to onboarding configuration
- **THEN** breadcrumbs show Roles > Onboarding Config
- **AND** title "Onboarding Configuration" and subtitle are displayed
- **AND** Preview Flow and Publish Config actions are available

### Requirement: Per-role onboarding configuration

The system SHALL allow admins to configure onboarding separately per target role.

#### Scenario: Select target role tab

- **WHEN** the admin views onboarding configuration
- **THEN** role tabs show Legal Counsel, Document Editor, Audit Officer, External Client, and + New Role
- **AND** selecting a tab loads that role's onboarding settings

### Requirement: Welcome experience configuration

The system SHALL allow admins to configure the welcome step content per role.

#### Scenario: Configure welcome headline and message

- **WHEN** the admin edits Welcome Experience section
- **THEN** fields for Welcome Headline and Introductory Message are editable
- **AND** changes are saved when Publish Config is clicked

#### Scenario: Configure welcome banner asset

- **WHEN** the admin uploads or replaces a banner image/video
- **THEN** the asset is associated with the role's welcome step preview

### Requirement: Required documents configuration

The system SHALL allow admins to assign documents users must sign or acknowledge before proceeding.

#### Scenario: Required docs list

- **WHEN** the admin views Required Docs section
- **THEN** linked documents are listed with filename and requirement type (E-Signature Required or Read Confirmation)
- **AND** admin can add documents via "+ Link Existing Document"

#### Scenario: Remove required document

- **WHEN** the admin removes a required document from the list
- **THEN** it is no longer required for new onboarding users of that role

### Requirement: Training modules configuration

The system SHALL allow admins to select mandatory and optional training modules per role.

#### Scenario: Enable training modules

- **WHEN** the admin checks training module checkboxes (e.g., DMS Basics, Security & Encryption)
- **THEN** those modules are required or optional per module settings for the role's onboarding

### Requirement: User journey preview

The system SHALL show admins a preview stepper of the end-user onboarding flow.

#### Scenario: Preview stepper

- **WHEN** the admin views User Journey Preview
- **THEN** a horizontal stepper shows Welcome, Compliance, Training, and Launch steps with subtext summaries

### Requirement: User onboarding welcome step

The system SHALL present new users with a personalized welcome screen as the first onboarding step (screen09).

#### Scenario: Welcome screen content

- **WHEN** a new user with incomplete onboarding signs in
- **THEN** the system redirects to `/onboarding`
- **AND** displays personalized greeting using the user's first name (e.g., "Welcome to LexVault, Sarah")
- **AND** shows role-specific intro message over a dark hero banner
- **AND** shows Get Started and View Tutorial actions
- **AND** displays a four-step progress stepper (Welcome, Compliance, Training, Launch)

#### Scenario: Security credentials status

- **WHEN** the welcome step loads
- **THEN** security credential checks show verified items (e.g., SSO verification, data residency)
- **AND** a What's Next sidebar lists upcoming onboarding steps
- **AND** Begin Compliance Review advances to step 2

#### Scenario: Demo config loads for default user

- **WHEN** the demo user starts onboarding
- **THEN** onboarding config loads without 404 errors
- **AND** required documents and training modules are available

### Requirement: User onboarding compliance step

The system SHALL require users to review and complete all required compliance documents (screen10).

#### Scenario: Compliance document list

- **WHEN** the user enters Compliance Review step
- **THEN** a sidebar lists required documents by name (e.g., Non-Disclosure Agreement) with status indicators
- **AND** overall progress percentage is displayed

#### Scenario: Review and sign document

- **WHEN** the user selects a document marked Ready to Review
- **THEN** the document content is displayed in the main viewer (not a placeholder)
- **AND** the user can acknowledge or e-sign per document requirement type

### Requirement: User onboarding training step

The system SHALL present mandatory training modules with progress tracking (screen11).

#### Scenario: Training module list

- **WHEN** the user enters Training step
- **THEN** modules are listed with status pills (Completed, In Progress, Not Started, Optional), description, duration, and progress bar
- **AND** a sidebar shows overall completion percentage and skills checklist

### Requirement: User onboarding launch step

The system SHALL present a completion screen with access summary before dashboard entry (screen12).

#### Scenario: Launch completion screen

- **WHEN** the user completes all prior onboarding steps
- **THEN** the Launch step shows "System Access Granted" with the user's name
- **AND** displays role-based Access Summary with feature grid and Quick Tips
- **AND** provides Enter LexVault Dashboard action

### Requirement: Onboarding access gating

The system SHALL block access to main app routes until onboarding is complete.

#### Scenario: Redirect incomplete user to onboarding

- **WHEN** a user with incomplete onboarding attempts to access `/dashboard` or other app routes
- **THEN** the system redirects to the appropriate onboarding step based on progress

#### Scenario: Completed user skips onboarding

- **WHEN** a user with completed onboarding navigates to `/onboarding`
- **THEN** the system redirects to `/dashboard`

### Requirement: Onboarding progress persistence

The system SHALL persist onboarding progress per user so they can resume later.

#### Scenario: Resume after logout

- **WHEN** a user logs out during Compliance step and logs back in
- **THEN** they resume at Compliance with prior document completions preserved

### Requirement: Publish onboarding configuration

The system SHALL version onboarding config and apply published config to new users only or per admin choice.

#### Scenario: Publish config

- **WHEN** the admin clicks Publish Config
- **THEN** the current draft configuration becomes the active published version for the selected role
- **AND** an audit event records the publication

