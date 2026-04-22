# Audit Backlog

This document tracks items from the v0.1 implementation audit that are
either already addressed or deferred. Use it as the source of truth when
planning v0.2/v1.0 work.

## Status legend

- DONE — addressed in this iteration.
- DEFERRED — accepted and scheduled for a later release.
- WONTFIX — intentionally not pursued; rationale included.

---

## Resolved in 0.1.x

### 1. DONE — Lazy global namespace

`getNamespace()` no longer runs at module import. The `window.ui8kit`
global is created on first access and never created in non-browser
environments (SSR-safe).

Files: `src/core/registry.ts`, `src/core/index.ts`, `src/entries/index.ts`.

### 2. DONE — Pure ESM entry vs side-effectful entries

- `@ui8kit/aria` (`src/entries/index.ts`) — pure exports, no side effects,
  fully tree-shakeable.
- `@ui8kit/aria/all` (`src/entries/all.ts`) — auto-registers every pattern
  and is the source for the IIFE/CDN bundle.
- Per-pattern entries (e.g. `@ui8kit/aria/dialog`) remain side-effectful
  by design and are listed in `package.json#sideEffects`.

### 3. DONE — Disposers for global listeners

`dialog`, `combobox`, `menubutton` now register their `document` listeners
once per scope and return a real disposer that detaches them on
`disposePattern`/`resetRegistry`.

### 4. DONE — Test isolation

`tests/setup.ts` calls `resetRegistry()` and `setAutoInitFlag(false)`
before/after every test. Tests no longer leak handlers between specs.

### 5. DONE — `pretest:e2e: bun run build`

E2E tests now always run against a fresh `dist/`.

### 6. DONE — `WeakMap` for dialog focus restore

Replaces `dataset.lastFocus` (which lost the actual element reference)
with a `WeakMap<HTMLElement, HTMLElement>`. Focus return now works
reliably.

### 7. DONE — `.at(0)` removed

Replaced with `[0]` for ES2018 compatibility (matches `tsup` target).

### 8. DONE — Dead defensive code removed

`registry.ts` no longer has the unreachable `namespace.register || ...`
fallback that existed after `createNamespace()`.

### 9. DONE — Removed unused devDependencies

`@vitejs/plugin-react`, `@vitejs/plugin-legacy` deleted from
`devDependencies`.

### 10. DONE — Minified IIFE for `all`/`core`

`tsup.config.ts` now emits both `*.iife.js` and `*.iife.min.js`. The
`size-limit` config and `package.json` `browser`/`unpkg`/`jsdelivr`
fields point at the new artifact names.

### 11. DONE — Keyboard interaction tests

Added unit tests for: `dialog` Tab trap + Escape, `menu` ArrowUp/Down,
`listbox` Arrow/End navigation, `combobox` ArrowDown + Enter selection.

---

## Deferred to v0.2 / v1.0

### D1. Per-element disposers

Today disposers are tracked per-scope (`document` or a sub-tree). When a
caller passes the same root again, we skip re-binding via `WeakMap`. We
do **not** track an unbinder for every individual element bound through
`dataset.ui8kitBound`.

Plan: introduce a `WeakMap<HTMLElement, Disposer>` per pattern so that
elements can be safely re-mounted, removed and re-introduced (HMR,
templ partial swaps, htmx swaps).

### D2. MutationObserver auto-rebind

For htmx / templ / Vue islands that swap DOM after `init()`, expose an
optional observer (`observe: true`) that re-runs `initPattern` on
matching subtrees.

### D3. Focus trap utility

Extract the dialog Tab-trap into a reusable helper in `src/core/focus.ts`
so `combobox` listbox panels and `menu` popovers can opt in.

### D4. Accessibility test coverage

Currently `axe-core` runs only on the `plain.html` E2E. Extend it to all
pattern fixtures (open/closed states) and gate CI on the result.

### D5. Strict-CSP IIFE bundle

The current IIFE writes `window.ui8kit` directly. Document the CSP
implications and provide a `--no-globals` build that exposes the API as
the IIFE return value only.

### D6. Pattern: `radiogroup`, `slider`, `tree`, `grid`

Out of scope for v1 (`docs/COVERAGE.md`); tracked for v1.1+.

### D7. Vendor copy script

`scripts/vendor.mjs` to copy `dist/all.iife.min.js` into a consumer
project (Go/PHP/static sites) with hash-pinned filename and matching
SRI snippet for the README.

### D8. Per-pattern tree-shaking telemetry

Add a build-time check that importing `@ui8kit/aria` and using only
`{ dialog }` produces a bundle ≤ X kb (assertion via `size-limit` JSON).

---

## Won't fix

### W1. Re-export `ready`/`byAttr` from core/index

These are intentionally not promoted to top-level exports of
`@ui8kit/aria` because they encourage one-off DOM access that competes
with the registry. Use `getNamespace().ready/.byAttr` if needed.

### W2. CommonJS for the IIFE bundle

The IIFE artifact is browser-only. CJS consumers should import from
`@ui8kit/aria` or `@ui8kit/aria/all` directly.
