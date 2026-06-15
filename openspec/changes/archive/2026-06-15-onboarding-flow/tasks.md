## 1. Data Model & API

- [x] 1.1 Define OnboardingConfig and OnboardingProgress schemas
- [x] 1.2 Implement `GET /api/onboarding/config/[roleId]` admin read
- [x] 1.3 Implement `PUT /api/onboarding/config/[roleId]` admin save draft
- [x] 1.4 Implement `POST /api/onboarding/config/[roleId]/publish`
- [x] 1.5 Implement `GET /api/onboarding/progress` user progress read
- [x] 1.6 Implement `POST /api/onboarding/progress/compliance/[docId]/complete`
- [x] 1.7 Implement `POST /api/onboarding/progress/training/[moduleId]` update progress
- [x] 1.8 Implement `POST /api/onboarding/progress/complete` mark onboarding done
- [x] 1.9 Seed Legal Counsel config with 3 required docs and 2 training modules

## 2. Admin Onboarding Config UI

- [x] 2.1 Create OnboardingConfigPage with breadcrumbs and header actions
- [x] 2.2 Create RoleTabSelector for target role configuration
- [x] 2.3 Create WelcomeExperienceSection (headline, message, banner upload)
- [x] 2.4 Create RequiredDocsSection with linked document cards
- [x] 2.5 Create TrainingModulesSection with checkboxes
- [x] 2.6 Create UserJourneyPreview stepper component
- [x] 2.7 Wire Preview Flow and Publish Config actions

## 3. User Onboarding UI

- [x] 3.1 Create OnboardingWelcomePage (screen09) with hero, credentials, stepper
- [x] 3.2 Create OnboardingCompliancePage (screen10) with doc sidebar and viewer
- [x] 3.3 Create OnboardingTrainingPage (screen11) with module cards and progress sidebar
- [x] 3.4 Create OnboardingLaunchPage (screen12) with access summary and tips
- [x] 3.5 Create shared OnboardingStepper component across all steps
- [x] 3.6 Implement disabled Continue buttons until step requirements met

## 4. Route Guard & Integration

- [x] 4.1 Implement onboarding completion middleware redirecting incomplete users
- [x] 4.2 Redirect completed users away from `/onboarding/*` to `/dashboard`
- [x] 4.3 Persist and resume progress across sessions
- [x] 4.4 Record onboarding completion as audit event
- [x] 4.5 Link required docs to existing document records from library
