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
│   │   ├── pr-conventions.mdc
│   │   ├── repo-hygiene.mdc
│   │   └── todo-conventions.mdc
│   └── skills/
│       └── brand-guidelines/
│           └── SKILL.md         # AI brand/token governance
├── .github/
│   ├── pull_request_template.md
│   └── workflows/
│       ├── ci.yml
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
    │       │   │   │   ├── tag-badge.tsx
    │       │   │   │   ├── tag-badge.test.tsx
    │       │   │   │   └── ...    # button, card, input, table, etc.
    │       │   │   └── GlobalNav.tsx
    │       │   ├── hooks/
    │       │   │   └── use-mobile.ts
    │       │   ├── lib/
    │       │   │   ├── agent-fetch.ts     # Shared authenticated fetch utility
    │       │   │   ├── agent-fetch.test.ts
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
│   ├── auth/
│   │   ├── firebase.ts
│   │   ├── roles.ts
│   │   └── use-auth.ts
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
- Unlike card/stocks, the tarball contains root-level files (not nested under an app subdirectory) because the home app is served at `/`.

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
- `card` repo (same)
- `stocks` repo (same)

The package exports:

- **shadcn/ui primitives**: Button, Input, Select, Tabs, Card, Table, Separator, Sheet, Sidebar, Tooltip, DropdownMenu, Chart.
- **DataTable**: Generic sortable data table (`DataTable<TData>`) wrapping TanStack Table + Table primitives, with optional CSV download. Also re-exports the `ColumnDef` type.
- **Admin components**:
  - `AdminModal` — generic modal shell with title, close button, scrollable body, optional footer.
  - `UserTable` — configurable user list table with column definitions, sorting, type-ahead search, sticky headers, loading/empty states, and row click handler.
  - `TagBadge` — styled pill for roles, departments, or vendor names (`default` and `muted` variants).
  - `MultiSelect` — searchable multi-select popover with select-all, search filter, per-item toggle, and custom item rendering.
- **agentFetch**: Shared authenticated fetch utility that prepends `/agent/api` and attaches Firebase ID tokens.
- **GlobalNav**: Cross-app navigation component (uses platform chrome tokens exclusively).
- **App catalog and RBAC helpers**: `APP_CATALOG`, `APP_GRANTING_ROLES`, `ADMIN_CATALOG`, `ADMIN_GRANTING_ROLES`, `hasAppAccess`, `getAccessibleApps`, `getAccessibleAdminApps`. Single source of truth for app entries, admin app entries, and role-based access control — app repos import these instead of maintaining local copies.
- **Auth primitives**: `BaseAuthUser` interface (common auth context shape), `UserDoc` interface and `fetchUserDoc` (calls `/agent/api/me`), `buildDisplayName`. Apps with no extra fields re-export `BaseAuthUser` as their `AuthUser`; apps with extensions (e.g. vendors) use `interface AuthUser extends BaseAuthUser`.
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
- Authorization: RBAC via Firestore `users/{email}` documents.
- Unauthenticated: show sign-in view.
- Unauthorized: show no-access view.

## Security and Indexing Defaults

Default indexing policy is deny-by-default:

- `robots.txt` disallows all crawlers.
- `<meta name="robots" content="noindex, nofollow, noarchive">` in HTML head.
- Any indexing allowlist should be explicit and documented.
