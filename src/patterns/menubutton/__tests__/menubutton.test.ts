import { describe, it, expect } from 'vitest'
import { getNamespace } from '../../../core/registry'
import { menubutton } from '../index'

describe('menubutton', () => {
  it('opens linked menu', () => {
    document.body.innerHTML = `
      <button data-ui8kit="menubutton" data-menubutton-target="menu1">Menu</button>
      <div data-ui8kit="menu" id="menu1" data-state="closed" hidden>
        <div data-menu-item>One</div>
      </div>
    `

    const ns = getNamespace()
    ns.register(menubutton)
    ns.init()

    const btn = document.querySelector('[data-ui8kit="menubutton"]') as HTMLElement
    btn.click()
    const menu = document.getElementById('menu1') as HTMLElement
    expect(menu.hasAttribute('hidden')).toBe(false)
  })
})
