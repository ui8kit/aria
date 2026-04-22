import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'tests/e2e/**', 'playwright-report/**'],
  },
})
