import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { cleanupTestState, resetTestState } from '../../../../tests/setup'
import { getNamespace } from '../../../core/registry'
import { switchPattern } from '../index'

beforeEach(resetTestState)
afterEach(cleanupTestState)

describe('switch', () => {
  it('toggles aria-checked', () => {
    document.body.innerHTML = `
      <div data-ui8kit="switch">
        <button data-switch-control aria-checked="false">On</button>
      </div>
    `
    const ns = getNamespace()
    ns.register(switchPattern)
    ns.init()

    const control = document.querySelector('[data-switch-control]') as HTMLElement
    control.click()
    expect(control.getAttribute('aria-checked')).toBe('true')
  })
})
