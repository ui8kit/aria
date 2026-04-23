[![npm version](https://img.shields.io/npm/v/@ui8kit/aria.svg)](https://www.npmjs.com/package/@ui8kit/aria)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

# UI8Kit ARIA (npm i @ui8kit/aria)

TypeScript ARIA behavior layer for UI8Kit-compatible markup.

**Documentation:** [docs/](https://github.com/ui8kit/aria/tree/main/docs/README.md) — overview, getting started, SRI/CDN, testing, CI, patterns index ([docs/patterns/](https://github.com/ui8kit/aria/tree/main/docs/patterns/README.md)), and FAQ.

Two ways to consume the library:

1. **Pure ESM** (`@ui8kit/aria`) — tree-shakeable, no side effects on
   import. You opt into each pattern explicitly.
2. **Full bundle** (`@ui8kit/aria/all` / IIFE) — auto-registers every
   pattern, exposes `window.ui8kit`, and wires up
   `DOMContentLoaded`. Best for CDN drop-in usage.

## Quick start

Install:

```bash
npm i @ui8kit/aria
```

### Pure ESM (tree-shakeable)

```ts
import { registerPattern, getNamespace, dialog, tabs } from '@ui8kit/aria'

registerPattern(dialog)
registerPattern(tabs)
getNamespace().init()
```

### Per-pattern side-effect entries (auto-register)

```ts
import '@ui8kit/aria/dialog'
import '@ui8kit/aria/tabs'
```

Each per-pattern entry registers itself and (unless disabled) initializes
on `DOMContentLoaded`.

### Full bundle

```ts
import '@ui8kit/aria/all'
```

### CDN (IIFE)

```html
<!-- Pinned, with Subresource Integrity (replace HASH with output of `npm run sri`) -->
<script
  src="https://cdn.jsdelivr.net/npm/@ui8kit/aria@0.1.0/dist/all.iife.min.js"
  integrity="sha384-HASH"
  crossorigin="anonymous"
  defer
></script>
```

Or `https://unpkg.com/@ui8kit/aria@0.1.0/dist/all.iife.min.js`

`window.ui8kit` becomes available after the script loads.

## Auto init

By default the namespace auto-initializes registered patterns on
`DOMContentLoaded`. Disable per-page:

```html
<script>window.__UI8KIT_ARIA_AUTO_INIT__ = false</script>
```

Then run manually:

```js
window.ui8kit.init()
```

…or, in ESM:

```ts
import { setAutoInitFlag, getNamespace } from '@ui8kit/aria'
setAutoInitFlag(false)
// ...register patterns...
getNamespace().init()
```

## Exposed namespace

`window.ui8kit` (or the result of `getNamespace()`) exposes:

- `ready(fn)`
- `byAttr(name, root?)`
- `register(pattern)`
- `init(root?)`
- `initPattern(name, root?)`
- `disposePattern(name, root?)` — detach scope listeners.
- `resetRegistry()` — clear the registry (test/HMR helper).

Each entry ships in ESM/CJS (and IIFE for `all`/`core`). Patterns follow
a per-pattern contract based on `data-ui8kit-*` attributes — see
[`docs/patterns/`](https://github.com/ui8kit/aria/tree/main/doc/patterns/README.md) and `src/patterns/<name>/markup.md` for the expected DOM shape.

## SSR safety

Importing `@ui8kit/aria` (the pure entry) and `@ui8kit/aria/core` has
**no side effects** on `globalThis`/`window`. The global namespace is
created lazily on the first call to `getNamespace()` and only when
`document` is defined.

## License

MIT
