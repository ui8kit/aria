# `@ui8kit/aria` — packaging, CDN, ESM, and init strategy

This repository is the **`@ui8kit/aria`** npm package (and optional sibling packages such as `@ui8kit/theme`, `@ui8kit/locale`). It supersedes ad-hoc concatenation of `UI8Kit/js/*.js` into a single `ui8kit.js` in consumer repos (e.g. Framework `examples/web/web/static/js/ui8kit.js`).

Reference bundle order today (Framework **concat**): **`core` → `theme` → `dialog` → `accordion` → `tabs` → `combobox` → `tooltip` → `alert` → `locale` (language switch)**. Each chunk assumes `window.ui8kit` exists and uses **idempotent** guards (`if (namespace.dialog) return`).

---

## Design goals

1. **CDN** — pinned URLs on jsDelivr/unpkg for demos (CodePen, static HTML) without npm.
2. **npm** — `npm i @ui8kit/aria` + vendor script copying `dist/*` into app static (Go, PHP, etc.).
3. **ESM** — tree-shakeable imports for Vite / bundlers.
4. **IIFE / UMD** — `window.ui8kit` for drop-in `<script>` tags, compatible with current behavior.
5. **Modular load order** — patterns must not rely on fragile order **between** widgets; only **`core` is mandatory first**.
6. **`init()`** — support both **auto-init on `DOMContentLoaded`** (default) and **manual** `init*(root?)` for SPAs and tests.

---

## Public API surface

### Global namespace (`IIFE` / full bundle)

- **`window.ui8kit`** — single namespace object (same as today).
- **`window.ui8kit.core`** — `ready`, `byAttr` (must be registered first).
- **`window.ui8kit.<pattern>`** — e.g. `dialog`, `accordion`, `tabs`, each exposing at least **`init(root?)`** (no-op or refresh hook where applicable).

### Opt-out of auto-init

- Before any script: `window.__UI8KIT_ARIA_AUTO_INIT__ = false`  
  Then call **`window.ui8kit.dialog.init(document)`** (and/or other patterns) when the app is ready (e.g. after client router navigation).

### Manual scoping

- Every **`init(root?)`** should accept optional **`root`** (`Element` or `Document`) defaulting to **`document`**, so hooks can be mounted on a subtree (Shadow DOM / island / HTMX swap).

---

## Build outputs (recommended)

| Artifact | Format | Use case |
|----------|--------|----------|
| `ui8kit-aria.iife.min.js` | IIFE | One tag: full ARIA patterns + core (no theme/locale). |
| `ui8kit-aria-core.iife.min.js` | IIFE | Only `core` (for splitting). |
| `ui8kit-aria-dialog.iife.min.js` | IIFE | Dialog pattern (load after core). |
| … | IIFE | One file per pattern **or** grouped (e.g. `overlays` = dialog). |
| `index.mjs` / `*.mjs` | ESM | `import '@ui8kit/aria/dialog'` with side-effect register or named `initDialog`. |
| `types.d.ts` | TS | Types for ESM consumers. |

**Rule:** non-ARIA product chrome (**theme**, **locale** / language switch) lives in **`@ui8kit/theme`**, **`@ui8kit/locale`**, or **app** code — **not** in the default `@ui8kit/aria` bundle, so `aria` stays APG-oriented and small.

---

## Load order (modular `<script>` tags)

1. **Always first:** `ui8kit-aria-core` (creates `window.ui8kit` + `ready` / `byAttr`).
2. **After core, any order:** pattern scripts — they must depend only on `namespace` + DOM, not on each other at parse time.
3. **Theme / locale:** separate entrypoints; if they use `ui8kit.ready`, load **after `core`**.

---

## npm `exports` (suggested)

Subpaths such as **`@ui8kit/aria/core`**, **`@ui8kit/aria/dialog`**, … mapping to `dist/*.mjs`; **main** / **browser** pointing at full IIFE for CDN mirrors.

---

## CDN (jsDelivr)

Pin **exact semver** (never `@latest` in production):

`https://cdn.jsdelivr.net/npm/@ui8kit/aria@1.2.3/dist/ui8kit-aria.iife.min.js`

Publish **SRI** hashes per release for consumers who hotlink.

---

## Consumers (Go / PHP / static)

1. devDependency `@ui8kit/aria` (+ optional `@ui8kit/theme`).
2. `npm ci` + **`npm run vendor:js`** → copy `dist/*` into `web/static/js/`.
3. `go:embed` / static server; optional **`cat`** / bundler to produce `app.js`: `core` + chosen patterns + app.

---

## Migration

- **Source of truth** for browser ARIA behavior: **`@ui8kit/aria`**.
- **github.com/fastygo/ui8kit** keeps Go/templ; may **vendor** pinned `dist` or document the pin.
- Framework **examples** drop hand-curated monolithic `ui8kit.js` in favor of **vendored npm output** or a Makefile target.

---

## Test matrix

- Auto-init: HTML + script at end of body.
- Manual: `__UI8KIT_ARIA_AUTO_INIT__ = false`, then `init()` after DOM injection.
- Modular order: `core` first, then permute pattern scripts — same behavior.
- Scoped `init(document.getElementById('island'))` — no duplicate global listeners outside subtree.

---

## Related

- Markup contract: **FastyGo UI8Kit** `data-ui8kit-*` + **APG** where applicable.
- **@fastygo/elements** may pin `@ui8kit/aria` and extend behavior on top of the same `window.ui8kit` (or a documented parallel namespace).