## 1. Project Setup

- [ ] 1.1 Initialize Next.js App Router project with TypeScript
- [ ] 1.2 Add `@base-ui/react` for unstyled shell primitives (Menu, Input, Button, Tabs, Popover)
- [ ] 1.3 Create `styles/tokens.css` with LexVault design tokens and import in `app/globals.css`
- [ ] 1.4 Add Lucide React for navigation icons

## 2. Layout Structure

- [ ] 2.1 Create `AppShell.tsx` + `AppShell.module.css` (sidebar + main grid)
- [ ] 2.2 Create `app/(app)/layout.tsx` wrapping AppShell
- [ ] 2.3 Create `app/(onboarding)/layout.tsx` minimal onboarding layout
- [ ] 2.4 Define route structure for dashboard, library, approvals, settings, audit-log

## 3. Shell Components (Base UI + CSS Modules)

- [ ] 3.1 Implement Sidebar + `Sidebar.module.css` with nav links and active state
- [ ] 3.2 Implement Header + `Header.module.css` with LexVault title and utility actions
- [ ] 3.3 Implement SearchBar using Base UI Input + `SearchBar.module.css`
- [ ] 3.4 Implement UserMenu using Base UI Menu + `UserMenu.module.css`
- [ ] 3.5 Implement SettingsSubNav using Base UI Tabs + `SettingsSubNav.module.css`
- [ ] 3.6 Implement FloatingUploadButton using Base UI Button + `FloatingUploadButton.module.css`
- [ ] 3.7 Implement StorageUsageWidget + `StorageUsageWidget.module.css` for sidebar

## 4. Navigation & Search

- [ ] 4.1 Wire sidebar links to routes with active state highlighting
- [ ] 4.2 Implement global search submit → redirect to `/library?q={query}`
- [ ] 4.3 Wire Upload button and FAB to upload flow placeholder/modal

## 5. Placeholder Pages

- [ ] 5.1 Create stub pages for each nav route so shell is navigable end-to-end
