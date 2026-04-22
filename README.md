# `@ui8kit/aria`

## Why this exists

Browser **ARIA behaviors** (dialog, tabs, combobox, accordion, …) used to ship as concatenated scripts inside [FastyGo UI8Kit](https://github.com/fastygo/ui8kit) (`UI8Kit/js`) and vendored into apps by hand. That works, but it is hard to **version**, **tree-shake**, **hotlink from a CDN**, or consume from **npm** without copying blobs.

**`@ui8kit/aria`** is the **standalone** package for those behaviors: **IIFE** bundles for `<script>` tags, **ESM** for bundlers, **pinned CDN** URLs for sandboxes (CodePen, static demos), and a clear **`init()` / auto-init** contract (see [`.project/PACKAGING-AND-INIT.md`](.project/PACKAGING-AND-INIT.md)).

**Non-ARIA** chrome (theme toggle, locale switch) stays in separate packages or app code so this repo stays **APG-oriented** and small.

## Relation to UI8Kit

- **[fastygo/ui8kit](https://github.com/fastygo/ui8kit)** — Go/templ primitives and markup conventions (`data-ui8kit-*`).
- **This repo** — JavaScript that makes those widgets **keyboard- and AT-friendly**, aligned with [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) where applicable.

Consumers pin a **semver** of `@ui8kit/aria` and vendor `dist/` into static assets, or load from **jsDelivr / unpkg** with a fixed version.

## Project notes

| Path | Purpose |
|------|---------|
| [`.project/PACKAGING-AND-INIT.md`](.project/PACKAGING-AND-INIT.md) | npm, CDN, ESM, modular load order, `init()` vs auto-init |

**Official repository:** [github.com/ui8kit/aria](https://github.com/ui8kit/aria)  
**npm:** [`@ui8kit/aria`](https://www.npmjs.com/package/@ui8kit/aria) *(publish when ready)*

## License

Licensed under the **MIT License** — see [`LICENSE`](LICENSE).
# aria
