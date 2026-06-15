## Why

The onboarding flow is broken in demo: config API returns 404 for the default user's role (`role-global-admin`), and the user-facing UI does not match design screenshots screen09–screen12 (generic layout, missing hero, wrong branding, placeholder document viewer).

## What Changes

- Fix demo user/role mapping so onboarding config loads for all demo paths
- Seed required documents with human-readable names and inline content per screen10
- Redesign welcome, compliance, training, and launch pages to align with screen09–screen12
- Add onboarding-specific layout header/footer matching LexVault branding
- Fallback config when role-specific config is missing

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `onboarding`: Demo reliability and visual alignment with screen09–screen12

## Impact

- `app/(onboarding)/`, `components/onboarding/`, `lib/onboarding/`
- Onboarding API routes (demo user context)
- No changes to main app shell
