## 1. Data Model & API

- [ ] 1.1 Define OnboardingConfig and OnboardingProgress schemas
- [ ] 1.2 Implement `GET /api/onboarding/config/[roleId]` admin read
- [ ] 1.3 Implement `PUT /api/onboarding/config/[roleId]` admin save draft
- [ ] 1.4 Implement `POST /api/onboarding/config/[roleId]/publish`
- [ ] 1.5 Implement `GET /api/onboarding/progress` user progress read
- [ ] 1.6 Implement `POST /api/onboarding/progress/compliance/[docId]/complete`
- [ ] 1.7 Implement `POST /api/onboarding/progress/training/[moduleId]` update progress
- [ ] 1.8 Implement `POST /api/onboarding/progress/complete` mark onboarding done
- [ ] 1.9 Seed Legal Counsel config with 3 required docs and 2 training modules

## 2. Admin Onboarding Config UI

- [ ] 2.1 Create OnboardingConfigPage with breadcrumbs and header actions
- [ ] 2.2 Create RoleTabSelector for target role configuration
- [ ] 2.3 Create WelcomeExperienceSection (headline, message, banner upload)
- [ ] 2.4 Create RequiredDocsSection with linked document cards
- [ ] 2.5 Create TrainingModulesSection with checkboxes
- [ ] 2.6 Create UserJourneyPreview stepper component
- [ ] 2.7 Wire Preview Flow and Publish Config actions

## 3. User Onboarding UI

- [ ] 3.1 Create OnboardingWelcomePage (screen09) with hero, credentials, stepper
- [ ] 3.2 Create OnboardingCompliancePage (screen10) with doc sidebar and viewer
- [ ] 3.3 Create OnboardingTrainingPage (screen11) with module cards and progress sidebar
- [ ] 3.4 Create OnboardingLaunchPage (screen12) with access summary and tips
- [ ] 3.5 Create shared OnboardingStepper component across all steps
- [ ] 3.6 Implement disabled Continue buttons until step requirements met

## 4. Route Guard & Integration

- [ ] 4.1 Implement onboarding completion middleware redirecting incomplete users
- [ ] 4.2 Redirect completed users away from `/onboarding/*` to `/dashboard`
- [ ] 4.3 Persist and resume progress across sessions
- [ ] 4.4 Record onboarding completion as audit event
- [ ] 4.5 Link required docs to existing document records from library
