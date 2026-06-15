## Why

New users must complete a guided onboarding experience before accessing the main dashboard. Admins configure per-role onboarding (screen08); users complete Welcome → Compliance → Training → Launch (screens09–12).

## What Changes

- Add admin Onboarding Configuration page under Settings > Roles
- Add per-role config: welcome headline/message/banner, required docs, training modules
- Add user onboarding flow with 4-step stepper: Welcome, Compliance, Training, Launch
- Add compliance document review and e-signature/read-confirmation gating
- Add training modules with progress tracking and mandatory completion rules
- Add launch screen with access summary and Enter Dashboard CTA
- Block dashboard access until onboarding is complete for the user's role

## Capabilities

### New Capabilities

- `onboarding`: Admin onboarding configuration and user multi-step onboarding journey

### Modified Capabilities

- (none)

## Impact

- New routes `/settings/roles/onboarding`, `/onboarding`, `/onboarding/compliance`, `/onboarding/training`, `/onboarding/launch`
- Onboarding config and progress APIs
- Route guard redirecting incomplete users to onboarding
- Depends on `roles-permissions`, `documents` (required docs), and `app-shell`
