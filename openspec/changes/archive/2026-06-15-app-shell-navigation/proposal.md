## Why

LexVault DMS requires a consistent application shell so users can navigate between Dashboard, Library, Approvals, Settings, Audit Log, and Support from any screen. Without a shared layout, header, sidebar, and global search, each feature page would be isolated and the enterprise UX shown in the mockups cannot be delivered.

## What Changes

- Add persistent left sidebar with primary navigation and workspace branding
- Add top header with global search, notifications, help, history, upload action, and user profile
- Add route-level layout wrapping all authenticated app pages
- Add global search entry point (query submission navigates to library with search applied)
- Add floating action button (FAB) for quick upload on applicable screens
- Add responsive shell structure matching screen01–screen07 layout patterns

## Capabilities

### New Capabilities

- `app-shell`: Shared layout, sidebar navigation, top header, global search bar, global actions, and FAB

### Modified Capabilities

- (none — greenfield)

## Impact

- Next.js root layout and authenticated route group `(app)/layout.tsx`
- Shared UI components: Sidebar, Header, SearchBar, UserMenu, FAB
- Navigation routing for Dashboard, Library, Approvals, Settings, Audit Log
- Foundation dependency for all other feature changes
