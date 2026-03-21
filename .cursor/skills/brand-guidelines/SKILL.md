---
name: brand-guidelines
description: Apply Haderach brand colors, typography, and token conventions when generating or modifying UI code. Use when creating components, styling elements, choosing colors, or working with the design system.
---

# Haderach Brand Guidelines

## Token Architecture

Haderach uses a two-tier Tailwind v4 token system. All tokens are defined in CSS `@theme` blocks — no JS config files.

### Tier 1: Platform chrome (shared-ui)

Defined in `packages/shared-ui/src/theme/index.css`. These style the global UI shell (nav, tooltips, dropdowns) and are **identical across all apps**. Never redefine these in app-level `@theme` blocks.

| Token | Tailwind class | Purpose |
|-------|---------------|---------|
| `--color-chrome-bg` | `bg-chrome-bg` | Nav/popover background |
| `--color-chrome-border` | `border-chrome-border` | Nav and dropdown borders |
| `--color-chrome-text` | `text-chrome-text` | Default nav text |
| `--color-chrome-text-strong` | `text-chrome-text-strong` | Tooltip text, button labels |
| `--color-chrome-text-hover` | `text-chrome-text-hover` | Hover/active text |
| `--color-chrome-text-muted` | `text-chrome-text-muted` | Secondary nav text |
| `--color-chrome-subtle` | `bg-chrome-subtle` | Subtle hover backgrounds |
| `--color-chrome-hover` | `bg-chrome-hover` | Hover/tooltip backgrounds |
| `--color-chrome-avatar` | `bg-chrome-avatar` | Avatar fallback circle |

### Tier 2: App tokens (this app)

Defined in `src/index.css` `@theme` block. These control app-specific styling.

| Token | Tailwind class | Purpose |
|-------|---------------|---------|
| `--color-background` | `bg-background` | Page background |
| `--color-foreground` | `text-foreground` | Primary text |
| `--color-foreground-muted` | `text-foreground-muted` | Secondary text |
| `--color-primary` | `bg-primary` | Primary action color (dark navy) |
| `--color-primary-foreground` | `text-primary-foreground` | Text on primary |
| `--color-surface` | `bg-surface` | Card/panel backgrounds |
| `--color-surface-hover` | `bg-surface-hover` | Hovered surfaces |
| `--color-border` | `border-border` | Default borders |
| `--color-border-hover` | `border-border-hover` | Hovered borders |
| `--color-error` | `text-error` | Error text |
| `--color-accent` | `bg-accent` | Accent backgrounds |
| `--color-accent-foreground` | `text-accent-foreground` | Text on accent |
| `--color-muted` | `bg-muted` | Muted backgrounds |
| `--color-muted-foreground` | `text-muted-foreground` | Muted text |
| `--color-popover` | `bg-popover` | Popover backgrounds |
| `--color-popover-foreground` | `text-popover-foreground` | Popover text |
| `--color-input` | `border-input` | Input borders |
| `--color-ring` | `ring-ring` | Focus rings |

## Typography

All apps use **Geist Sans** as the sole typeface. Font files are loaded by `@haderach/shared-ui/theme`.

```
--font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
  Roboto, Helvetica, Arial, sans-serif;
```

Weights available: 400 (regular), 500 (medium), 600 (semibold).

## Color System

- App tokens use **oklch** color space for perceptual uniformity.
- Platform chrome tokens also use oklch.
- Home's palette is neutral with a dark navy primary (`oklch(0.21 0.02 260)`).

## Rules

1. **Always use Tailwind token classes** (`bg-primary`, `text-foreground`, `border-border`). Never use raw color values (`#fff`, `oklch(...)`, `rgb(...)`) in components.
2. **Never redefine `chrome-*` tokens** in `src/index.css`. They are owned by shared-ui.
3. **Use shared-ui components** (Button, Input, Card, etc.) from `@haderach/shared-ui` for standard UI elements. They already reference the correct tokens.
4. **App-specific components** should use app-level tokens, not hardcoded neutrals or arbitrary Tailwind values.
5. **GlobalNav is self-contained** — it uses only chrome tokens. Do not pass app-level token classes to it.

## Source of Truth

- Platform chrome tokens: `packages/shared-ui/src/theme/index.css`
- App tokens: `src/index.css` `@theme` block
- Shared components: `packages/shared-ui/src/components/`

## Maintenance

This skill is duplicated across three repos. The **Token Architecture**, **Typography**, and **Rules** sections are shared; the **Tier 2** and **Color System** sections are app-specific.

When changing shared sections (chrome tokens, typography, rules) in this file, propagate the same changes to:

- `../stocks/.cursor/skills/brand-guidelines/SKILL.md`
- `../card/.cursor/skills/brand-guidelines/SKILL.md`

App-specific sections (Tier 2 tokens, Color System) only need updating in the repo they belong to.
