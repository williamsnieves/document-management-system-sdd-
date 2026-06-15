## 1. Project Setup

- [x] 1.1 Initialize Next.js App Router project with TypeScript
- [x] 1.2 Add `@base-ui/react` for unstyled shell primitives (Menu, Input, Button, Tabs, Popover)
- [x] 1.3 Create `styles/tokens.css` with LexVault design tokens and import in `app/globals.css`
- [x] 1.4 Add Lucide React for navigation icons

## 2. Layout Structure

- [x] 2.1 Create `AppShell.tsx` + `AppShell.module.css` (sidebar + main grid)
- [x] 2.2 Create `app/(app)/layout.tsx` wrapping AppShell
- [x] 2.3 Create `app/(onboarding)/layout.tsx` minimal onboarding layout
- [x] 2.4 Define route structure for dashboard, library, approvals, settings, audit-log

## 3. Shell Components (Base UI + CSS Modules)

- [x] 3.1 Implement Sidebar + `Sidebar.module.css` with nav links and active state
- [x] 3.2 Implement Header + `Header.module.css` with LexVault title and utility actions
- [x] 3.3 Implement SearchBar using Base UI Input + `SearchBar.module.css`
- [x] 3.4 Implement UserMenu using Base UI Menu + `UserMenu.module.css`
- [x] 3.5 Implement SettingsSubNav using Base UI Tabs + `SettingsSubNav.module.css`
- [x] 3.6 Implement FloatingUploadButton using Base UI Button + `FloatingUploadButton.module.css`
- [x] 3.7 Implement StorageUsageWidget + `StorageUsageWidget.module.css` for sidebar

## 4. Navigation & Search

- [x] 4.1 Wire sidebar links to routes with active state highlighting
- [x] 4.2 Implement global search submit → redirect to `/library?q={query}`
- [x] 4.3 Wire Upload button and FAB to upload flow placeholder/modal

## 5. Placeholder Pages

- [x] 5.1 Create stub pages for each nav route so shell is navigable end-to-end
