# haderach-home

Homepage and shared UI design system for the Haderach platform.

## What this repo owns

- **Homepage SPA** — the landing page and auth gateway at `haderach.ai/`
- **@haderach/shared-ui** — shared React component library (domain shell layout, ChatPanel, shadcn/ui primitives, admin components, analytics helpers, theme tokens) consumed by all app repos

## Development

```bash
npm install
npm run dev
```

Requires a `.env` file — see `.env.example`.

## Build

```bash
npm run build
```

Output goes to `dist/` for deployment as a Firebase Hosting artifact.

## Project structure

```text
haderach-home/
├── packages/
│   └── shared-ui/        # @haderach/shared-ui — design system
├── src/                   # Homepage SPA source
├── public/                # Static assets (copied to dist/ by Vite)
├── scripts/               # Artifact packaging and manifest generation
├── docs/
│   └── architecture.md
└── .github/workflows/     # CI and artifact publish
```

## Related repos

| Repo | Purpose |
|------|---------|
| `haderach-platform` | Deploy orchestration, hosting config, infra |
| `agent` | Shared chat agent backend (API consumed by ChatPanel and auth) |
| `vendors` | Vendor management app at `/vendors/` |
| `card` | Card editor app at `/card/` |
| `stocks` | Stocks app at `/stocks/` |
| `admin-vendors` | Vendor admin app at `/admin/vendors/` |
| `admin-system` | System admin app at `/admin/system/` |
