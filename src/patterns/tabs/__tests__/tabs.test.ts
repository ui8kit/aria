import { describe, it, expect } from 'vitest'
import { getNamespace } from '../../../core/registry'
import { tabs } from '../index'

describe('tabs', () => {
  it('activates default tab from root value', () => {
    document.body.innerHTML = `
      <div data-ui8kit="tabs" data-tabs-value="second">
        <button data-tabs-trigger data-tabs-value="first">First</button>
        <button data-tabs-trigger data-tabs-value="second">Second</button>
        <div data-tabs-panel data-tabs-value="first">A</div>
        <div data-tabs-panel data-tabs-value="second">B</div>
      </div>
    `

    const ns = getNamespace()
    ns.register(tabs)
    ns.init()

    const second = document.querySelector('[data-tabs-trigger][data-tabs-value="second"]') as HTMLElement
    expect(second.getAttribute('aria-selected')).toBe('true')
  })
})
