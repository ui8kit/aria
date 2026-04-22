# @ui8kit/aria implementation plan

## 1. Scaffold

- [x] package.json with Bun scripts and exports
- [x] tsconfig, ESLint, Prettier, bunfig, .gitignore, .editorconfig

## 2. Core

- [x] `src/core` namespace bootstrap
- [x] auto-init flag (`window.__UI8KIT_ARIA_AUTO_INIT__`)
- [x] shared helpers (`ready`, `byAttr`, focus traversal)
- [x] pattern registration + scoped init APIs

## 3. Patterns

### APG parity
- [x] dialog
- [x] accordion
- [x] tabs
- [x] combobox
- [x] tooltip
- [x] alert/live-region

### APG minimum additions
- [x] disclosure
- [x] menu/menubar
- [x] menubutton
- [x] listbox
- [x] switch

## 4. Build

- [x] tsup per-pattern entry points
- [x] ESM/CJS/IIFE outputs
- [x] `.d.ts` generation
- [x] package `exports` and `files`

## 5. Unit tests

- [x] Vitest + jsdom setup
- [x] per-pattern unit tests
- [x] fixtures and shared test bootstrap

## 6. E2E + a11y

- [x] Playwright matrix config
- [x] example pages used by tests
- [x] axe accessibility checks

## 7. Pipelines

- [x] CI workflow (lint, typecheck, unit, build, e2e, html/a11y, size)
- [x] release workflow with changesets and provenance
- [x] scripted SRI hash generation for CDN artifacts

## 8. Docs

- [x] Pattern docs (`docs/patterns/*.md`)
- [x] project docs for testing and contributing
- [x] README quick start and API summary
