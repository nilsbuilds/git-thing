# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run build` — Compile TypeScript (`tsc`, outputs to `dist/`)
- `npm run dev` — TypeScript watch mode (`tsc --watch`)
- `npm run dev:watch` — Live reload dev server (`tsx watch source/cli.tsx`)
- `npm test` — Runs all checks: `prettier --check . && xo && ava`

There is no command to run a single test. AVA runs all tests from `test.tsx` at the project root.

## Architecture

Terminal UI CLI app using **React 18 + Ink 4** to render interactive components in the terminal.

- `source/cli.tsx` — Entry point. Parses CLI flags with meow, then calls `render(<App />)` via Ink.
- `source/app.tsx` — Main React component. Uses Ink hooks (`useApp`, `useInput`) for terminal interaction.
- `test.tsx` — AVA tests using `ink-testing-library` to render components and assert against terminal frame output.
- `dist/` — Build output (compiled JS). Published to npm. Entry bin: `dist/cli.js`.

## Code Style

- **Indentation:** Tabs (see `.editorconfig`)
- **Linting:** xo with `xo-react` extension, Prettier integration enabled, `react/prop-types` rule disabled
- **Formatting:** Prettier using `@vdemedes/prettier-config`
- **Imports:** Use `.js` extension for local imports (ESM convention, even for .ts/.tsx source files)

## Publishing

Automated via GitHub Actions (`.github/workflows/publish-to-npm.yml`). Triggered by `v*` tags. Uses OIDC trusted publishing with provenance — no npm token needed.
