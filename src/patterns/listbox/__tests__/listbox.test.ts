import { describe, it, expect } from 'vitest'
import { getNamespace } from '../../../core/registry'
import { listbox } from '../index'

describe('listbox', () => {
  it('selects option on click', () => {
    document.body.innerHTML = `
      <div data-ui8kit="listbox">
        <div role="option">One</div>
        <div role="option">Two</div>
      </div>
    `

    const ns = getNamespace()
    ns.register(listbox)
    ns.init()

    const second = document.querySelectorAll('[role="option"]')[1] as HTMLElement
    second.click()

    expect(second.getAttribute('aria-selected')).toBe('true')
  })

  it('navigates options via ArrowDown / ArrowUp', () => {
    document.body.innerHTML = `
      <div data-ui8kit="listbox">
        <div role="option">One</div>
        <div role="option">Two</div>
        <div role="option">Three</div>
      </div>
    `

    const ns = getNamespace()
    ns.register(listbox)
    ns.init()

    const list = document.querySelector('[data-ui8kit="listbox"]') as HTMLElement
    const options = Array.from(list.querySelectorAll<HTMLElement>('[role="option"]'))
    options[0].focus()

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(options[1].getAttribute('aria-selected')).toBe('true')

    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }))
    expect(options[2].getAttribute('aria-selected')).toBe('true')
  })
})
