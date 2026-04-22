import { describe, it, expect } from 'vitest'
import { getNamespace } from '../../../core/registry'
import { accordion } from '../index'

describe('accordion', () => {
  it('toggles current panel', () => {
    document.body.innerHTML = `
      <div data-ui8kit="accordion">
        <section data-accordion-item data-state="closed">
          <button data-ui8kit-accordion-trigger>Open</button>
          <div data-ui8kit-accordion-content>Panel</div>
        </section>
      </div>
    `

    const ns = getNamespace()
    ns.register(accordion)
    ns.init()

    const trigger = document.querySelector('[data-ui8kit-accordion-trigger]') as HTMLButtonElement
    trigger.click()
    expect(document.querySelector('[data-accordion-item]')?.getAttribute('data-state')).toBe('open')
  })
})
