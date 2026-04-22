import { describe, it, expect } from 'vitest'
import { getNamespace } from '../../../core/registry'
import { disclosure } from '../index'

describe('disclosure', () => {
  it('toggles content visibility', () => {
    document.body.innerHTML = `
      <div data-ui8kit="disclosure">
        <button data-disclosure-trigger aria-expanded="false">More</button>
        <div data-disclosure-content hidden>Details</div>
      </div>
    `

    const ns = getNamespace()
    ns.register(disclosure)
    ns.init()

    const trigger = document.querySelector('[data-disclosure-trigger]') as HTMLElement
    trigger.click()
    expect(document.querySelector('[data-disclosure-content]')?.hasAttribute('hidden')).toBe(false)
  })
})
