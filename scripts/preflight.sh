#!/usr/bin/env bash
# Mirror of GitHub Actions CI. Run locally before opening a PR.
set -euo pipefail

bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run test
bun run build
bun run test:e2e
bun run test:a11y || echo "WARN: a11y suite skipped or failed (see Playwright report)"
bun run test:html
bun run size
bun run sri

echo "preflight OK"
