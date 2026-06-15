## Context

Greenfield Next.js application. The app shell is the foundation layout used by Dashboard, Library, Approvals, Settings, and Audit Log. Onboarding uses a separate minimal layout per screen09–12. UI reference: screen01–screen07.

## Goals / Non-Goals

**Goals:**
- Single authenticated `(app)` route group layout with sidebar + header
- Consistent navigation and global search entry
- Reusable layout components matching LexVault design language
- Settings sub-navigation for nested settings routes
- CSS Modules for all shell visual styling (scoped, co-located `.module.css` files)
- Base UI (`@base-ui/react`) for unstyled interactive primitives; LexVault look applied via CSS Modules

**Non-Goals:**
- Authentication implementation (handled in security/onboarding changes)
- Feature-specific page content
- Mobile-native app shell (responsive web is sufficient for v1)
- Tailwind utility classes for shell components (reserved for feature pages if needed later)

## Decisions

### Decision: CSS Modules for shell styling

All app-shell components use co-located CSS Modules. No inline styles or Tailwind classes on shell components.

**File convention:** `ComponentName.module.css` next to `ComponentName.tsx`.

**Rationale:** Scoped class names prevent style leakage across the large DMS surface; co-location keeps layout styling easy to find and matches the mockup-driven, component-specific visual rules (sidebar active state, header spacing, FAB position).

**Alternatives considered:** Tailwind utilities — rejected for shell because mockup-specific layout rules (fixed sidebar width, header grid, active nav highlight) are clearer as named module classes; global utility sprawl is harder to maintain for the shared shell.

**Shared tokens:** Define design tokens once in `styles/tokens.css` (CSS custom properties) and consume them inside module files:

```css
/* styles/tokens.css */
:root {
  --color-bg-app: #f4f4f5;
  --color-bg-sidebar: #eef2f6;
  --color-bg-card: #ffffff;
  --color-text-primary: #111827;
  --color-text-muted: #6b7280;
  --color-accent-active: #e6f0ff;
  --color-primary-action: #111827;
  --color-success: #16a34a;
  --color-warning: #ea580c;
  --color-critical: #dc2626;
  --sidebar-width: 240px;
  --header-height: 64px;
  --radius-card: 12px;
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.08);
}
```

Import `tokens.css` in `app/globals.css`. Module files reference tokens via `var(--token-name)`.

**State styling:** Use Base UI `data-*` attributes and `:global` only when necessary. Prefer module selectors such as `.navItem[data-active]` or dynamic `className` callbacks from Base UI state.

**Example pattern:**

```tsx
// components/shell/Sidebar.tsx
import { NavigationMenu } from '@base-ui/react/navigation-menu';
import styles from './Sidebar.module.css';

<NavigationMenu.Link
  className={(state) =>
    state.active ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
  }
  href="/library"
>
  Library
</NavigationMenu.Link>
```

```css
/* components/shell/Sidebar.module.css */
.navItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  color: var(--color-text-primary);
  border-radius: 8px;
  text-decoration: none;
}

.navItemActive {
  background: var(--color-accent-active);
}
```

### Decision: Base UI for unstyled interactive primitives

Use [Base UI](https://base-ui.com/) (`@base-ui/react`) for headless, accessible behavior. Apply all visual design through CSS Modules `className` props.

**Rationale:** Base UI provides keyboard navigation, ARIA, focus management, and portal positioning without prescribing styles — ideal for matching screen01–screen07 exactly via modules.

**Alternatives considered:** Radix primitives directly — viable but Base UI aligns with the project's "unstyled base + CSS Modules" split and documents first-class CSS Modules support.

**Shell component → Base UI mapping:**

| Shell component | Base UI primitive | Styled via module |
|-----------------|-------------------|-------------------|
| `Sidebar` nav links | `NavigationMenu` / plain links with `usePathname` active state | `Sidebar.module.css` |
| `SearchBar` | `Input` | `SearchBar.module.css` |
| `UserMenu` | `Menu` (Root, Trigger, Portal, Positioner, Popup, Item) | `UserMenu.module.css` |
| `Header` Upload button | `Button` | `Header.module.css` |
| `FloatingUploadButton` | `Button` | `FloatingUploadButton.module.css` |
| `SettingsSubNav` | `Tabs` (Root, List, Tab, Panel) | `SettingsSubNav.module.css` |
| Notifications (placeholder) | `Popover` | `Header.module.css` |

**Rules:**
- Never use Base UI default styles; every part receives a `className` from a CSS Module.
- Use `className={(state) => ...}` for checked, active, highlighted, and open states.
- Prefer `Menu.Portal` + `Menu.Positioner` for dropdowns to avoid z-index clipping in the fixed header.
- Icons from Lucide React are decorative or `aria-hidden`; interactive controls get accessible labels.

### Decision: Next.js App Router route groups

Use `app/(app)/layout.tsx` for authenticated shell and `app/(onboarding)/layout.tsx` for onboarding.

**Rationale:** Route groups cleanly separate layouts without affecting URL structure.

**Alternatives considered:** Single layout with conditional rendering — rejected due to complexity and coupling.

### Decision: Sidebar as client component with `usePathname`

Active nav state derived from current pathname.

**Rationale:** Simple, no global state needed for navigation highlighting.

### Decision: Global search redirects to `/library?q=`

Header search submits to library with query param rather than a dedicated search page.

**Rationale:** Matches PRD "basic search" scope; library already has list infrastructure.

### Decision: Component library structure

```
styles/
  tokens.css                  # Global design tokens (CSS variables)
  globals.css                 # Reset, token import, base typography

components/
  shell/
    AppShell.tsx
    AppShell.module.css
    Sidebar.tsx
    Sidebar.module.css
    Header.tsx
    Header.module.css
    SearchBar.tsx
    SearchBar.module.css
    UserMenu.tsx
    UserMenu.module.css
    SettingsSubNav.tsx
    SettingsSubNav.module.css
    FloatingUploadButton.tsx
    FloatingUploadButton.module.css
    StorageUsageWidget.tsx
    StorageUsageWidget.module.css
```

`AppShell.module.css` owns the shell grid: fixed sidebar column, sticky header row, scrollable main content.

```css
/* AppShell.module.css (structural) */
.shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
  background: var(--color-bg-app);
}

.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content {
  flex: 1;
  padding: 1.5rem 2rem;
}
```

## Risks / Trade-offs

- **[Risk] Layout re-renders on navigation** → Keep shell components memoized; use Next.js layouts for persistence
- **[Risk] Search UX limited to library redirect** → Acceptable for v1 per PRD; dedicated search page is future enhancement
- **[Risk] CSS Modules + Base UI state classes drift** → Document `className` callback patterns in shell README; use typed state in callbacks
- **[Risk] Duplicate tokens across future feature modules** → `styles/tokens.css` is the single source of truth; feature changes import the same tokens

## Migration Plan

N/A — greenfield. Implement first before other feature routes. Subsequent changes SHOULD follow the same CSS Modules + Base UI pattern for consistency.

## Open Questions

- None — icon library confirmed as Lucide React
