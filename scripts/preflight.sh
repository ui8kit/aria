#!/usr/bin/env bash
# Mirror of GitHub Actions CI. Run locally before publishing.
set -euo pipefail

if [ -f bun.lock ]; then
  bun install --frozen-lockfile --ignore-scripts
else
  bun install --ignore-scripts
fi
bun run lint
bun run typecheck
bun run test:unit
bun run test:html
bun run build
if [ "${CI:-false}" = "true" ]; then
  bunx playwright test
  bunx playwright test --config playwright.config.ts --grep @a11y
else
  echo "Skipping Playwright locally (enabled in CI only)"
fi
bun run size
bun run sri

echo "preflight OK"
