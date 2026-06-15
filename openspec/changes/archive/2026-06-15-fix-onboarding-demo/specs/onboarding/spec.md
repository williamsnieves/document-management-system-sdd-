## MODIFIED Requirements

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
