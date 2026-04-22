import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { cleanupTestState, resetTestState } from '../../../../tests/setup'
import { getNamespace } from '../../../core/registry'
import { menu } from '../index'

beforeEach(resetTestState)
afterEach(cleanupTestState)

describe('menu', () => {
  it('initializes first item tabbable', () => {
    document.body.innerHTML = `
      <div data-ui8kit="menu">
        <button data-menu-item>One</button>
        <button data-menu-item>Two</button>
      </div>
    `
    const ns = getNamespace()
    ns.register(menu)
    ns.init()

    const first = document.querySelectorAll('[data-menu-item]')[0] as HTMLElement
    expect(first.tabIndex).toBe(0)
  })

  it('moves focus on ArrowDown / ArrowUp', () => {
    document.body.innerHTML = `
      <div data-ui8kit="menu">
        <button data-menu-item>One</button>
        <button data-menu-item>Two</button>
        <button data-menu-item>Three</button>
      </div>
    `
    const ns = getNamespace()
    ns.register(menu)
    ns.init()

    const items = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-menu-item]'))
    items[0].focus()
    items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(document.activeElement).toBe(items[1])

    items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    expect(document.activeElement).toBe(items[0])
  })
})
