# Architecture

## Purpose

`haderach-home` owns the Haderach platform homepage SPA and the shared UI design system (`@haderach/shared-ui`). It serves as the auth gateway and app launcher at `haderach.ai/`, and provides shared React components consumed by all app repos.

## Repository Tree (ASCII)

```text
haderach-home/
├── .cursor/
│   ├── rules/
│   │   ├── architecture-pointer.mdc
│   │   ├── branch-safety-reminder.mdc
│   │   ├── cross-repo-status.mdc
│   │   ├── pr-conventions.mdc
│   │   ├── repo-hygiene.mdc
│   │   ├── service-oriented-data-access.mdc
│   │   └── todo-conventions.mdc
│   └── skills/
│       └── brand-guidelines/
│           └── SKILL.md         # AI brand/token governance
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-storybook.yml
│       └── publish-artifact.yml
├── docs/
│   └── architecture.md
├── packages/
│   └── shared-ui/            # @haderach/shared-ui design system
│       ├── src/
    │       │   ├── auth/
    │       │   │   ├── app-catalog.ts      # APP_CATALOG, APP_GRANTING_ROLES, RBAC helpers
    │       │   │   ├── base-auth-user.ts   # BaseAuthUser interface
    │       │   │   └── user-doc.ts         # UserDoc, fetchUserDoc, buildDisplayName
    │       │   ├── components/
    │       │   │   ├── admin/     # Admin-specific components
    │       │   │   │   ├── admin-modal.tsx
    │       │   │   │   ├── admin-modal.test.tsx
    │       │   │   │   ├── user-table.tsx
    │       │   │   │   └── user-table.test.tsx
    │       │   │   ├── ui/        # shadcn/ui primitives + DataTable + admin widgets
    │       │   │   │   ├── multi-select.tsx
    │       │   │   │   ├── multi-select.test.tsx
    │       │   │   │   ├── filterable-header.tsx
    │       │   │   │   ├── form-rows.tsx
    │       │   │   │   ├── calendar.tsx
    │       │   │   │   ├── date-range-picker.tsx
    │       │   │   │   ├── tag-badge.tsx
    │       │   │   │   ├── tag-badge.test.tsx
    │       │   │   │   └── ...    # button, card, input, table, etc.
    │       │   │   ├── app-rail.tsx
    │       │   │   ├── chat-panel.tsx
    │       │   │   ├── chat-toggle.tsx
    │       │   │   ├── feedback-popover.tsx
    │       │   │   ├── pane-layout.tsx
    │       │   │   ├── pane-toolbar.tsx
    │       │   │   └── GlobalNav.tsx
    │       │   ├── hooks/
    │       │   │   └── use-mobile.ts
    │       │   ├── lib/
    │       │   │   ├── agent-fetch.ts     # Shared authenticated fetch utility
    │       │   │   ├── agent-fetch.test.ts
    │       │   │   ├── branding.ts        # fetchBranding, useBranding hook
    │       │   │   ├── pivot.ts           # formatCurrency, pivotLongToWide
    │       │   │   └── utils.ts
    │       │   ├── theme/
    │       │   │   └── index.css  # Platform chrome tokens + font imports
    │       │   ├── test-setup.ts  # Vitest + jest-dom setup
    │       │   └── index.ts       # Barrel export
    │       ├── vitest.config.ts
    │       ├── package.json
    │       └── tsconfig.json
├── public/
│   ├── assets/landing/logo.svg
│   └── robots.txt
├── scripts/
│   ├── package-artifacts.sh
│   └── generate-manifest.mjs
├── src/
│   ├── App.tsx
│   ├── SettingsHub.tsx            # Role-gated admin navigation shell at /admin/
│   ├── auth/
│   │   ├── firebase.ts
│   │   ├── roles.ts
│   │   └── use-auth.ts
│   ├── components/
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── LegalPage.tsx          # Renders Termly legal docs in iframe
│   │   └── QuickBooksIntegrationPage.tsx  # QBO connect/disconnected flows
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## Ownership Boundaries

### This repository owns

- Homepage SPA: auth gateway, app launcher, and homepage content at `/`.
- Settings hub: role-gated admin navigation shell at `/admin/`, routing users to admin apps based on their roles.
- QuickBooks integration lifecycle pages at `/integrations/quickbooks/connect` and `/integrations/quickbooks/disconnected` (connect page gates to admin and redirects to `/agent/api/qbo/auth`).
- Shared UI design system: `@haderach/shared-ui` with shadcn/ui primitives, GlobalNav, and theme tokens.
- App CI checks (lint, build).
- Versioned artifact packaging and manifest publication.

### External platform owns

- Promotion decisions from published app versions to environments.
- Global deployment orchestration and environment rollout.
- Cross-app smoke tests and route collision protection.
- Global host/routing policy for production domains.

## Canonical Release Flow

1. Feature branch
2. PR CI
3. Merge to `main`
4. Artifact/version publish
5. Platform promotion (select artifact version for an environment)
6. Platform deploy
7. Platform smoke checks

This repository implements steps 1-4. Steps 5-7 run in the platform control plane.

## App Delivery Contract

### Artifact format

- Runtime artifact: `runtime.tar.gz` — compressed `dist/` directory from Vite build.
- Unlike other apps, the tarball contains root-level files (not nested under an app subdirectory) because the home app is served at `/`.

### GCS artifact paths

```text
gs://<bucket>/home/versions/<commit-sha>/
  runtime.tar.gz
  checksums.txt
  manifest.json
```

## Shared UI Design System

`packages/shared-ui/` is published as `@haderach/shared-ui` and consumed by:

- This homepage app (via npm workspace resolution)
- `admin-system` repo (via `file:` protocol locally, GitHub Packages for CI)
- `vendors` repo (same)
- `stocks` repo (same)

The package exports:

- **shadcn/ui primitives**: Button, Input, Select, Tabs, Card, Table, Separator, Sheet, Sidebar, Tooltip, DropdownMenu, Chart, Calendar, DateRangePicker.
- **DataTable**: Generic sortable data table (`DataTable<TData>`) wrapping TanStack Table + Table primitives, with optional CSV download. Also re-exports the `ColumnDef` type.
- **FilterableHeader**: Column header component that adds inline filter dropdowns to DataTable columns. `setFilterFn` helper for wiring column filter state.
- **Form row components**: `DetailRow`, `EditRow`, `SelectRow`, `CheckboxRow` — standardized form layout components for admin detail panels.
- **Admin components**:
  - `AdminModal` — generic modal shell with title, close button, scrollable body, optional footer.
  - `UserTable` — configurable user list table with column definitions, sorting, type-ahead search, sticky headers, loading/empty states, and row click handler.
  - `TagBadge` — styled pill for roles, departments, or vendor names (`default` and `muted` variants).
  - `MultiSelect` — searchable multi-select popover with select-all, search filter, per-item toggle, and custom item rendering.
- **Analytics helpers**: `formatCurrency`, `formatMonthHeader`, `pivotLongToWide` — utilities for transforming long-format spend data into wide-format pivot tables for charting.
- **agentFetch**: Shared authenticated fetch utility that prepends `/agent/api` and attaches Firebase ID tokens.
- **Branding**: `fetchBranding` and `useBranding` hook — fetch org logo and lockup mode from `GET /branding`. Used by AppRail to render the data-driven logo.
- **FeedbackPopover**: Feedback UI rendered in the AppRail. Collects general site/app feedback and submits to `POST /feedback/site`.
- **GlobalNav**: Legacy top-bar navigation component with avatar-triggered dropdown menu (profile info, Settings link, Log out). Uses platform chrome tokens exclusively. Retained for apps not yet migrated to the domain shell layout.
- **AppRail**: Collapsible left rail for domain navigation. Replaces `GlobalNav` + `Sidebar` in migrated apps. Shows data-driven logo (from branding API), role-gated domain icons with active indicator, feedback popover, and user avatar with upward flyout. Push behavior (content reflows on expand/collapse). `useRailExpanded` hook persists expand/collapse to localStorage.
- **PaneToolbar**: Thin horizontal toolbar (h-12) with toggle icons for chat, analytics, and data panes. Clicking an icon snaps that pane to full width.
- **PaneLayout**: Resizable three-pane content area (chat | analytics | data) using `react-resizable-panels`. Fixed left-to-right order, drag handles between panes, collapsible with minimum size threshold.
- **ChatPanel**: Chat interface component with tool-calling agent integration. Features: tool message replay for multi-turn context, CSV download buttons, inline disambiguation radio buttons, pending action handling (`confirm_edit` / `confirm_csv_batch`), per-message thumbs up/down feedback with session tracking. Supports `mode="panel"` (fills container — for use inside `PaneLayout`) and `mode="standalone"` (legacy overlay behavior).
- **ChatTable**: Renders tabular data returned by the chat agent directly in the conversation thread. Accepts a `ChatTablePayload` (column definitions + rows).
- **ViewModeToggle**: Switches between `"table"` and `"detail"` view modes. Used in data panes for toggling between list and single-record views.
- **ChatToggle**: Standalone button to open/close a ChatPanel overlay. Used by apps that haven't adopted PaneLayout.
- **AuthGate**: Reusable auth wrapper component that handles the full auth lifecycle (loading, signed-out redirect, unauthorized, authorized). Provides `AuthUserContext` and `useAuthUser` hook. Used by all consumer apps except haderach-home (which has its own auth flow).
- **Dialog**: Modal dialog primitives (Dialog, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription).
- **Popover**: Floating popover primitives (Popover, PopoverTrigger, PopoverContent, PopoverAnchor).
- **App catalog and RBAC helpers**: `APP_CATALOG`, `APP_GRANTING_ROLES`, `ADMIN_CATALOG`, `ADMIN_GRANTING_ROLES`, `hasAppAccess`, `getAccessibleApps`, `getAccessibleRailApps`, `getAccessibleAdminApps`. Single source of truth for app entries, admin app entries, and role-based access control — app repos import these instead of maintaining local copies. `NavApp` includes optional `icon` (lucide icon key) and `railEnabled` fields for the domain shell layout.
- **Auth primitives**: `BaseAuthUser` interface (common auth context shape), `UserDoc` interface and `fetchUserDoc` (calls `/agent/api/me`), `buildDisplayName`. Apps with no extra fields re-export `BaseAuthUser` as their `AuthUser`; apps with extensions (e.g. vendors) use `interface AuthUser extends BaseAuthUser`.
- **Hooks**: `useIsMobile` (responsive breakpoint), `usePrefetchApps` (idle-time prefetch of sibling app bundles for instant domain switching).

## Domain Shell Layout

The domain shell is the standard app layout for business domain apps (vendors, stocks, etc.). It replaces the previous `GlobalNav` + `Sidebar` pattern.

### Structure

```text
┌──────────┬──────────────────────────────────────────┐
│          │  PaneToolbar [chat] [analytics] [data]   │
│  AppRail │──────────────────────────────────────────│
│  (left)  │  PaneLayout                              │
│          │  ┌─────────┬──────────┬─────────┐        │
│          │  │  Chat   │Analytics │  Data   │        │
│          │  │  pane   │  pane    │  pane   │        │
│          │  └─────────┴──────────┴─────────┘        │
└──────────┴──────────────────────────────────────────┘
```

### Key behaviors

- **AppRail**: Collapsible between icon-only (64px) and expanded (220px) states. Push behavior — content reflows. Toggle button styled like the legacy `SidebarTrigger`. Domain list is dynamic based on `getAccessibleRailApps()`. Active domain gets a left accent bar and highlighted icon color. Admin apps are not in the rail — accessed via the avatar flyout.
- **PaneToolbar**: Three toggle icons (chat, analytics, data). Click to snap that pane to full width. Active pane shows its label next to the icon.
- **PaneLayout**: Wraps `react-resizable-panels`. Fixed order: chat | analytics | data. Each pane is collapsible with ~15% minimum size. Drag resize handles between panes to split the view.
- **Landing redirect**: Authorized users on `/` are redirected to their first accessible rail-enabled app via `getAccessibleRailApps()`.

### Migration status

| App | Status |
|-----|--------|
| expenses | Migrated (railEnabled: true) |
| vendors | Migrated (railEnabled: true) |
| admin-vendors | Uses legacy GlobalNav |
| admin-system | Uses legacy GlobalNav |

### Per-domain pane mapping

Each domain app maps the three panes to its own content:

| Domain | Chat | Analytics | Data |
|--------|------|-----------|------|
| Expenses | ChatPanel (agent) | Expense views | DataTable |
| Vendors | ChatPanel (agent) | Spending views | VendorList/DataTable |

## Settings Hub

The homepage renders a Settings hub at `/admin/` (and `/admin`) — a lightweight navigation shell that routes users to admin apps. Firebase Hosting serves this via a rewrite to the homepage `index.html`.

- **Auth gating**: Requires `admin` or `finance_admin` role. Users without either see an "Access Denied" message.
- **Content**: A role-filtered list of admin domains. Each item is a link that does full page navigation:
  - **System** → `/admin/system/` (visible to `admin` role) — user management, roles, app permissions
  - **Vendors** → `/admin/vendors/` (visible to `finance_admin` role) — vendor access controls, spend permissions
- **Entry point**: The GlobalNav avatar dropdown always includes a "Settings" link pointing to `/admin/`.
- **No router dependency**: Path detection is done via `window.location.pathname`, not react-router-dom.
- **Platform chrome tokens**: `chrome-*` color tokens for the global UI shell (nav, tooltips, dropdowns). Consistent across all apps — app `@theme` blocks must not redefine these.
- **Font imports**: Geist Sans 400/500/600 weights.

Unit tests (39 tests across 5 suites) run via Vitest + React Testing Library (`vitest.config.ts` with jsdom environment).

Design tokens follow a two-tier architecture:

1. **Platform chrome** (Tier 1): Defined in `shared-ui/src/theme/index.css`. Controls global UI shell styling. Identical across all apps.
2. **App tokens** (Tier 2): Defined in each app's `src/index.css` `@theme` block. Controls app-specific colors and palette.

Apps can opt out of shared components by building local components with raw Tailwind classes.

## Authentication Contract

Authentication is centralized at the platform level.

- Auth provider: Firebase Authentication with Google provider.
- Session scope: shared across all apps on `haderach.ai`.
- Authorization: RBAC via `users/{email}` documents. App frontends resolve user docs through `fetchUserDoc` (from `@haderach/shared-ui`), which calls `GET /agent/api/me`. The home app still reads Firestore directly for its own auth flow.
- Unauthenticated (production): redirect to `/` for sign-in.
- Unauthenticated (local dev): show dev-only Google sign-in button (no redirect needed).
- Unauthorized: show no-access view.

## Security and Indexing Defaults

Default indexing policy is deny-by-default:

- `robots.txt` disallows all crawlers.
- `<meta name="robots" content="noindex, nofollow, noarchive">` in HTML head.
- Any indexing allowlist should be explicit and documented.
