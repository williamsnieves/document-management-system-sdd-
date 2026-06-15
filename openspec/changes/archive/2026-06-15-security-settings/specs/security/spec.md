# Security Specification

## Purpose

Organization-wide security policy configuration (screen06).

## ADDED Requirements

### Requirement: Security Control Center page

The system SHALL display a Security Control Center under Settings with four configuration cards.

#### Scenario: Security page header

- **WHEN** an admin navigates to `/settings/security`
- **THEN** the page shows title "Security Control Center" and subtitle describing authentication, cryptographic, and SSO configuration scope

### Requirement: Authentication configuration

The system SHALL allow administrators to configure authentication policies.

#### Scenario: Two-factor authentication toggle

- **WHEN** an admin views the Authentication card
- **THEN** a 2FA toggle is displayed showing current state (On/Off)
- **AND** description states mandatory scope for administrator and auditor roles when enabled

#### Scenario: Session management settings

- **WHEN** an admin views Session Management
- **THEN** dropdowns for Inactivity Timeout and Max Session Duration are editable
- **AND** changes are auto-saved or staged until Save Security Policy is clicked

### Requirement: Encryption status and key rotation

The system SHALL display encryption status and allow key rotation for administrators.

#### Scenario: AES-256 enabled display

- **WHEN** encryption is active
- **THEN** the Encryption card shows "AES-256 Enabled" with shield indicator
- **AND** shows last key rotation timestamp
- **AND** provides a Rotate Keys button

#### Scenario: Key rotation warning

- **WHEN** an admin clicks Rotate Keys
- **THEN** a warning alert explains that rotation invalidates session tokens and requires re-index
- **AND** the admin must confirm before proceeding

#### Scenario: Key rotation audit

- **WHEN** key rotation completes
- **THEN** an audit event records the rotation with timestamp and initiating admin

### Requirement: IP whitelisting

The system SHALL allow administrators to manage allowed IP ranges.

#### Scenario: View IP whitelist table

- **WHEN** the admin views IP Whitelisting card
- **THEN** a table lists IP Range, Label, and delete action per entry

#### Scenario: Add IP range

- **WHEN** the admin clicks "+ Add Range" and submits a valid CIDR or IP with label
- **THEN** the new range is added to the whitelist
- **AND** an audit event records the change

#### Scenario: Remove IP range

- **WHEN** the admin deletes an IP range
- **THEN** the range is removed from the whitelist
- **AND** an audit event records the removal

### Requirement: Single Sign-On configuration

The system SHALL display SSO integration status and management options.

#### Scenario: Okta integration active

- **WHEN** Okta SSO is connected
- **THEN** the SSO card shows Okta with ACTIVE badge and connection details (SAML 2.0 endpoint)

#### Scenario: Azure AD configurable

- **WHEN** Azure AD is not yet connected
- **THEN** the SSO card shows Azure AD with CONFIGURABLE badge and setup description

#### Scenario: Manage custom SAML provider

- **WHEN** the admin clicks "Manage Custom SAML Provider"
- **THEN** the system navigates to SAML provider configuration

### Requirement: Save security policy

The system SHALL require explicit save for security policy changes.

#### Scenario: Save changes

- **WHEN** the admin modifies security settings and clicks Save Security Policy
- **THEN** all staged changes are persisted
- **AND** audit events record each changed policy field

#### Scenario: Cancel changes

- **WHEN** the admin clicks Cancel Changes
- **THEN** all unsaved modifications are discarded
- **AND** the form reverts to last saved state

### Requirement: Security changes audit footer

The system SHALL display a footer note linking security changes to the immutable audit log.

#### Scenario: Audit log link in footer

- **WHEN** the security page loads
- **THEN** a green status dot and message state that security changes are recorded in the Immutable Audit Log
- **AND** the audit log text links to `/audit-log`

### Requirement: Security settings access control

The system SHALL restrict Security Control Center to administrators.

#### Scenario: Non-admin denied

- **WHEN** a non-admin user navigates to `/settings/security`
- **THEN** the system denies access
