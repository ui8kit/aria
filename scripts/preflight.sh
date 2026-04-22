#!/usr/bin/env bash
set -euo pipefail

bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run test
bun run build
bun run test:e2e
bun run test:a11y
bun run test:html
bun run size


echo "preflight OK"
