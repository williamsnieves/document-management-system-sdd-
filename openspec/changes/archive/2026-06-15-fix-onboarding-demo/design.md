## Context

Onboarding was archived but demo is broken: `getCurrentUser()` returns Global Admin while config is seeded only for Legal Counsel. UI uses generic white cards vs screen09–12 dark hero LexVault branding.

## Goals / Non-Goals

**Goals:**
- Dedicated `getOnboardingUser()` for demo (Sarah Jenkins, Legal Counsel)
- Config fallback to Legal Counsel published config when role config missing
- CSS Modules redesign per screen09–12 using `styles/tokens.css`
- Inline compliance document content (no external PDF dependency)

**Non-Goals:**
- Real e-signature provider
- Full LMS slide player

## Decisions

### Decision: Separate demo onboarding user

`lib/onboarding/demo-user.ts` exports `getOnboardingUser()` used only by onboarding APIs. Main app keeps `getCurrentUser()` as Global Admin for admin demos.

### Decision: Rich seed content

`lib/onboarding/content.ts` holds document display names, icons, and HTML content for NDA, Code of Conduct, Privacy Policy matching screen10.

### Decision: Shared OnboardingShell layout component

Header: LexVault | ONBOARDING, support link, avatar. Footer: copyright + help links on welcome/launch.

## Risks / Trade-offs

- **[Risk] Two user contexts** → Document clearly in demo-user.ts; onboarding APIs only use onboarding user
