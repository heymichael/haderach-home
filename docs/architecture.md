# Architecture

## Purpose

`haderach-home` owns the Haderach platform homepage SPA and the shared UI design system (`@haderach/shared-ui`). It serves as the auth gateway and app launcher at `haderach.ai/`, and provides shared React components consumed by all app repos.

## Repository Tree (ASCII)

```text
haderach-home/
├── .cursor/
│   └── rules/
│       ├── architecture-pointer.mdc
│       ├── branch-safety-reminder.mdc
│       ├── pr-conventions.mdc
│       ├── repo-hygiene.mdc
│       └── todo-conventions.mdc
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
│       │   ├── components/
│       │   │   ├── ui/        # shadcn/ui primitives (Button, Input, etc.)
│       │   │   └── GlobalNav.tsx
│       │   ├── theme/         # Shared Tailwind theme tokens
│       │   └── index.ts       # Barrel export
│       ├── components.json    # shadcn/ui config
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts     # Library mode build
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
│   │   └── useAuth.ts
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
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
- `card` repo (via `file:` protocol locally, GitHub Packages for CI)
- `stocks` repo (same)

The package exports:

- **shadcn/ui primitives**: Button, Input, Select, Tabs, Dialog, Card, etc.
- **GlobalNav**: Cross-app navigation component.
- **Theme tokens**: Shared Tailwind theme (colors, radii, fonts, shadows).

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
