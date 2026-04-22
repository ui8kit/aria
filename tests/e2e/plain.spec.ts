import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

test('plain example opens examples', async ({ page }) => {
  await page.goto('/examples/plain/')
  await expect(page.locator('[data-ui8kit="accordion"]')).toBeVisible()
})

test('@a11y plain example is accessible', async ({ page }) => {
  await page.goto('/examples/plain/')
  const results = await new AxeBuilder({ page }).analyze()
  const summary = results.violations
    .map((violation) => `${violation.id}: ${violation.help} (${violation.nodes.length})`)
    .join('\n')

  expect(results.violations, summary).toHaveLength(0)
})
