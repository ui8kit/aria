import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

test('plain example opens examples', async ({ page }) => {
  await page.goto('/examples/plain/')
  await expect(page.locator('[data-ui8kit="accordion"]')).toBeVisible()
})

test('plain example is accessible ', async ({ page }) => {
  await page.goto('/examples/plain/')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.length).toBe(0)
})
