## Why

Enterprise customers require organization-wide security configuration including authentication policies, encryption status, IP restrictions, and SSO integrations (screen06). This supports the PRD non-functional requirement for basic security at an enterprise level.

## What Changes

- Add Security Control Center under Settings
- Add Authentication card: 2FA toggle, session inactivity timeout, max session duration
- Add Encryption card: AES-256 status, last key rotation, rotate keys action with warning
- Add IP Whitelisting card: add/remove IP ranges with labels
- Add SSO card: Okta (active), Azure AD (configurable), custom SAML provider management
- Add Save Security Policy and Cancel Changes actions
- Link footer note to immutable audit log for security change recording

## Capabilities

### New Capabilities

- `security`: Organization security policy configuration (auth, encryption, IP whitelist, SSO)

### Modified Capabilities

- (none)

## Impact

- New route `/settings/security`
- Security policy API (read/update with audit side effects)
- Integration stubs for Okta SAML and Azure AD OIDC
- Depends on `app-shell`, `audit-log`, and `roles-permissions`
