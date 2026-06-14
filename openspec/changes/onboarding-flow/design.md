## Context

Onboarding gates dashboard access for new users (screens08–12). Admin configures per role; users complete 4-step journey.

## Goals / Non-Goals

**Goals:**
- Admin config: welcome, required docs, training modules per role
- User flow: Welcome → Compliance → Training → Launch
- Progress persistence and resume
- Route guard blocking main app until complete

**Non-Goals:**
- Full LMS with quiz authoring
- Video hosting infrastructure (banner images for v1)
- Legal e-signature provider integration (click-to-sign stub for v1)

## Decisions

### Decision: OnboardingConfig per role

```
OnboardingConfig { roleId, welcomeHeadline, welcomeMessage, bannerUrl, requiredDocs[], trainingModules[], publishedAt }
OnboardingProgress { userId, roleId, currentStep, completedDocs[], moduleProgress{}, completedAt }
```

### Decision: Route guard middleware

Check `OnboardingProgress.completedAt` — if null, redirect to current step route.

### Decision: Required doc completion types

- `e_signature`: user clicks "I agree and sign" with timestamp recorded
- `read_confirmation`: user scrolls to end or clicks "I have read"

### Decision: Training module progress

Track `moduleId → percentComplete`. Mandatory modules must reach 100% to proceed.

### Decision: Separate onboarding layout

No main app sidebar during onboarding (per app-shell spec).

## Risks / Trade-offs

- **[Risk] E-signature legal validity** → v1 is click-wrap acknowledgment; real e-sign is future
- **[Risk] Config changes mid-onboarding** → Apply published config at start; in-progress users keep snapshot

## Migration Plan

N/A — greenfield. Seed Legal Counsel onboarding config matching screen08 mockup.

## Open Questions

- Preview Flow button: open onboarding in admin preview mode with mock user — recommend `?preview=true` bypass
