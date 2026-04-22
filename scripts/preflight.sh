#!/usr/bin/env bash
# Mirror of GitHub Actions CI. Run locally before publishing.
set -euo pipefail

if [ -f bun.lock ]; then
  bun install --frozen-lockfile
else
  bun install
fi
bun run lint
bun run typecheck
bun run test:unit
bun run test:html
bun run build
bunx playwright test
bunx playwright test --config playwright.config.ts --grep @a11y
bun run size
bun run sri

echo "preflight OK"
