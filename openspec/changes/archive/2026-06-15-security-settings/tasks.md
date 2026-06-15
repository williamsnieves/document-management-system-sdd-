## 1. Data Model & API

- [x] 1.1 Define SecurityPolicy and IpWhitelistEntry schemas
- [x] 1.2 Define SsoProviderConfig schema
- [x] 1.3 Implement `GET /api/security/policy`
- [x] 1.4 Implement `PUT /api/security/policy` with atomic save and audit events
- [x] 1.5 Implement `POST /api/security/rotate-keys` with session invalidation
- [x] 1.6 Implement IP whitelist CRUD within policy update
- [x] 1.7 Seed default policy with AES-256 enabled and sample SSO entries

## 2. Security UI

- [x] 2.1 Create SecurityControlCenterPage with four cards layout
- [x] 2.2 Create AuthenticationCard with 2FA toggle and session dropdowns
- [x] 2.3 Create EncryptionCard with status box, rotation timestamp, Rotate Keys button
- [x] 2.4 Create IpWhitelistingCard with table and Add Range modal
- [x] 2.5 Create SsoCard with provider status badges and Manage SAML link
- [x] 2.6 Create footer with audit log link, Cancel Changes, Save Security Policy
- [x] 2.7 Implement key rotation confirmation warning modal

## 3. Enforcement

- [x] 3.1 Apply session timeout from policy in auth middleware
- [x] 3.2 Enforce 2FA requirement for admin/auditor roles when enabled
- [x] 3.3 Validate client IP against whitelist for admin routes (optional strict mode)

## 4. Integration

- [x] 4.1 Record all security policy changes as audit events
- [x] 4.2 Link Immutable Audit Log footer to `/audit-log`
