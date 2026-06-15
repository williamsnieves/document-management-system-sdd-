## Context

Security Control Center for enterprise policy configuration (screen06). Admin-only settings under Settings > Security.

## Goals / Non-Goals

**Goals:**
- 2FA policy toggle
- Session timeout configuration
- Encryption status display and key rotation
- IP whitelist CRUD
- SSO integration status display

**Non-Goals:**
- Full Okta/Azure AD provisioning automation in v1
- Hardware security module integration
- Penetration testing tooling

## Decisions

### Decision: SecurityPolicy singleton per organization

```
SecurityPolicy { twoFactorRequired, inactivityTimeoutMin, maxSessionHours, encryptionEnabled, lastKeyRotation, ipWhitelist[], ssoProviders[] }
```

### Decision: Key rotation invalidates sessions

On rotation, clear all active sessions and require re-authentication (per screen06 warning).

### Decision: SSO as configuration records

Store provider type, status (active/configurable), metadata URL — actual SAML/OIDC handshake is stubbed for v1 with mock ACTIVE state for Okta.

### Decision: Staged edits with explicit save

Form uses dirty state tracking; Save Security Policy commits all changes atomically.

## Risks / Trade-offs

- **[Risk] Key rotation disruption** → Require confirmation modal; schedule maintenance message
- **[Risk] SSO complexity** → v1 focuses on config UI; wire real SAML in follow-up change

## Migration Plan

N/A — greenfield. Seed default SecurityPolicy on org creation.

## Open Questions

- Session storage: JWT vs server sessions — recommend HTTP-only cookies with server session store
