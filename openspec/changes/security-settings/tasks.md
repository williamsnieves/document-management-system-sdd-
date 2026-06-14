## 1. Data Model & API

- [ ] 1.1 Define SecurityPolicy and IpWhitelistEntry schemas
- [ ] 1.2 Define SsoProviderConfig schema
- [ ] 1.3 Implement `GET /api/security/policy`
- [ ] 1.4 Implement `PUT /api/security/policy` with atomic save and audit events
- [ ] 1.5 Implement `POST /api/security/rotate-keys` with session invalidation
- [ ] 1.6 Implement IP whitelist CRUD within policy update
- [ ] 1.7 Seed default policy with AES-256 enabled and sample SSO entries

## 2. Security UI

- [ ] 2.1 Create SecurityControlCenterPage with four cards layout
- [ ] 2.2 Create AuthenticationCard with 2FA toggle and session dropdowns
- [ ] 2.3 Create EncryptionCard with status box, rotation timestamp, Rotate Keys button
- [ ] 2.4 Create IpWhitelistingCard with table and Add Range modal
- [ ] 2.5 Create SsoCard with provider status badges and Manage SAML link
- [ ] 2.6 Create footer with audit log link, Cancel Changes, Save Security Policy
- [ ] 2.7 Implement key rotation confirmation warning modal

## 3. Enforcement

- [ ] 3.1 Apply session timeout from policy in auth middleware
- [ ] 3.2 Enforce 2FA requirement for admin/auditor roles when enabled
- [ ] 3.3 Validate client IP against whitelist for admin routes (optional strict mode)

## 4. Integration

- [ ] 4.1 Record all security policy changes as audit events
- [ ] 4.2 Link Immutable Audit Log footer to `/audit-log`
