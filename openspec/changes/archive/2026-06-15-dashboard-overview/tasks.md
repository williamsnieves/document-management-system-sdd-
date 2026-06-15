## 1. API & Data

- [x] 1.1 Define dashboard overview API response schema (metrics, activity, lifecycle, system status)
- [x] 1.2 Implement `GET /api/dashboard/overview` aggregation endpoint
- [x] 1.3 Implement featured document lifecycle query

## 2. UI Components

- [x] 2.1 Create MetricCard component (title, value, delta indicator, icon)
- [x] 2.2 Create RecentActivityTable with action badges and document tags
- [x] 2.3 Create QuickActionsPanel with navigation/action handlers
- [x] 2.4 Create SystemStatusPanel with health indicators
- [x] 2.5 Create DocumentLifecycleTimeline horizontal stepper widget

## 3. Dashboard Page

- [x] 3.1 Implement `/dashboard` page with Organizational Overview header
- [x] 3.2 Wire Filter button (placeholder or date range modal)
- [x] 3.3 Wire Export Report to PDF download endpoint
- [x] 3.4 Add loading skeletons and error states
- [x] 3.5 Wire View All activity → `/audit-log`

## 4. Integration

- [x] 4.1 Connect quick actions to upload, folder creation, and share flows
- [x] 4.2 Wire lifecycle widget document link to `/library/[id]`
