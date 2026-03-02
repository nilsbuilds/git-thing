# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run build` — Compile TypeScript (`tsc`, outputs to `dist/`)
- `npm run dev` — Build and run once (`tsc && node dist/cli.js`)
- `npm run dev:watch` — Live reload dev server (`tsx watch source/cli.tsx`)
- `npm test` — Runs all checks: `prettier --check . && xo && ava`

There is no command to run a single test. AVA runs all tests from `test.tsx` at the project root.

## Architecture

Interactive Git branch management TUI built with **React 18 + Ink 4**. Lets you browse local branches, checkout, and rebase onto a configurable base branch — all from the terminal.

- `source/cli.tsx` — Entry point. Renders `<App />` via Ink.
- `source/app.tsx` — Root component. Tabbed interface (Branches / Settings) with status bar, keyboard navigation (Tab to switch tabs, q to quit).
- `source/components/BranchList.tsx` — Branch list UI with two modes: selection (checkout on Enter) and rebase (rebase onto base branch on Enter). Shift+Tab toggles mode.
- `source/components/Settings.tsx` — Settings UI for base branch (inline text editing) and auto-stash toggle.
- `source/hooks/useGitBranches.ts` — Git operations via `child_process.execFile`: branch listing, checkout, fetch + rebase.
- `source/hooks/useSettings.ts` — Persistent settings stored in `~/.git-thing-settings.json` (defaults: baseBranch `main`, autoStash `true`).
- `source/constants/theme.ts` — Centralized color/style theme constants (tab colors, mode colors, branch highlight styles, etc.).
- `test.tsx` — AVA tests (outdated stubs from the original scaffold — they test a greeting app that no longer exists).
- `dist/` — Build output (compiled JS). Published to npm. Entry bin: `dist/cli.js`.

## Code Style

- **Indentation:** Tabs (see `.editorconfig`)
- **Linting:** xo with `xo-react` extension, Prettier integration enabled, `react/prop-types` rule disabled
- **Formatting:** Prettier using `@vdemedes/prettier-config`
- **Imports:** Use `.js` extension for local imports (ESM convention, even for .ts/.tsx source files)

## Publishing

Automated via GitHub Actions (`.github/workflows/publish-to-npm.yml`). Triggered by `v*` tags. Uses OIDC trusted publishing with provenance — no npm token needed.
