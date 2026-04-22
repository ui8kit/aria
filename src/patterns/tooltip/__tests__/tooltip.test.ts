import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { cleanupTestState, resetTestState } from '../../../../tests/setup'
import { getNamespace } from '../../../core/registry'
import { tooltip } from '../index'

beforeEach(resetTestState)
afterEach(cleanupTestState)

describe('tooltip', () => {
  it('opens on hover', () => {
    document.body.innerHTML = `
      <div data-ui8kit="tooltip">
        <button>i</button>
        <span role="tooltip" hidden>hint</span>
      </div>
    `
    const ns = getNamespace()
    ns.register(tooltip)
    ns.init()

    const root = document.querySelector('[data-ui8kit="tooltip"]') as HTMLElement
    root.dispatchEvent(new Event('mouseenter', { bubbles: true }))

    expect(document.querySelector('[role="tooltip"]')?.hasAttribute('hidden')).toBe(false)
  })
})
