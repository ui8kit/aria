import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { cleanupTestState, resetTestState } from '../../../../tests/setup'
import { getNamespace } from '../../../core/registry'
import { alertPattern } from '../index'

beforeEach(resetTestState)
afterEach(cleanupTestState)

describe('alert', () => {
  it('sets live region attributes', () => {
    document.body.innerHTML = '<div data-ui8kit="alert">Saved</div>'
    const ns = getNamespace()
    ns.register(alertPattern)
    ns.init()

    const node = document.querySelector('[data-ui8kit="alert"]') as HTMLElement
    expect(node.getAttribute('role')).toBe('status')
    expect(node.getAttribute('aria-live')).toBe('polite')
  })
})
