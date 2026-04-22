import { describe, it, expect } from 'vitest'
import { getNamespace } from '../../../core/registry'
import { combobox } from '../index'

describe('combobox', () => {
  it('opens on input focus', () => {
    document.body.innerHTML = `
      <div data-ui8kit="combobox">
        <input value="" />
        <div data-combobox-toggle>v</div>
        <ul role="listbox" hidden>
          <li data-combobox-option data-combobox-value="one">One</li>
          <li data-combobox-option data-combobox-value="two">Two</li>
        </ul>
      </div>
    `

    const ns = getNamespace()
    ns.register(combobox)
    ns.init()

    const input = document.querySelector('input') as HTMLInputElement
    input.focus()

    expect(
      document.querySelector<HTMLElement>('[data-ui8kit="combobox"]')?.dataset.state
    ).toBe('open')
  })

  it('selects active option via ArrowDown + Enter', () => {
    document.body.innerHTML = `
      <div data-ui8kit="combobox">
        <input value="" />
        <ul role="listbox" hidden>
          <li data-combobox-option data-combobox-value="one">One</li>
          <li data-combobox-option data-combobox-value="two">Two</li>
        </ul>
      </div>
    `
    const ns = getNamespace()
    ns.register(combobox)
    ns.init()

    const input = document.querySelector('input') as HTMLInputElement
    input.focus()
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(input.value).toBe('one')
    expect(
      document.querySelector<HTMLElement>('[data-ui8kit="combobox"]')?.dataset.state
    ).toBe('closed')
  })
})
