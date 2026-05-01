import { afterEach, beforeEach, describe, it, expect } from 'vitest'
import { cleanupTestState, resetTestState } from '../../../../tests/setup'
import { getNamespace, registerPattern } from '../../../core/registry'
import { dialog } from '../index'

beforeEach(resetTestState)
afterEach(cleanupTestState)

function setupBasicDialog(): void {
  document.body.innerHTML = `
    <button id="trigger" data-ui8kit-dialog-open data-ui8kit-dialog-target="dlg">Open</button>
    <div id="dlg" data-ui8kit="dialog" hidden>
      <button id="first" data-ui8kit-dialog-close>Close</button>
      <a id="second" href="#">Link</a>
      <button id="last">Last</button>
    </div>
    <div data-ui8kit-dialog-overlay hidden></div>
  `
}

describe('dialog', () => {
  it('opens and closes by API', () => {
    setupBasicDialog()
    registerPattern(dialog)
    getNamespace().init()

    dialog.open('dlg')
    expect(document.getElementById('dlg')?.getAttribute('data-state')).toBe('open')

    dialog.close('dlg')
    expect(document.getElementById('dlg')?.getAttribute('data-state')).toBe('closed')
  })

  it('returns focus to the opener on close', () => {
    setupBasicDialog()
    registerPattern(dialog)
    getNamespace().init()

    const trigger = document.getElementById('trigger') as HTMLButtonElement
    trigger.focus()
    trigger.click()

    expect(document.getElementById('dlg')?.getAttribute('data-state')).toBe('open')

    dialog.close('dlg')
    expect(document.activeElement).toBe(trigger)
  })

  it('syncs aria-expanded on linked open controls', () => {
    setupBasicDialog()
    registerPattern(dialog)
    getNamespace().init()

    const trigger = document.getElementById('trigger') as HTMLButtonElement

    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    trigger.click()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    dialog.close('dlg')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('traps Tab inside the dialog', () => {
    setupBasicDialog()
    registerPattern(dialog)
    getNamespace().init()

    dialog.open('dlg')
    const last = document.getElementById('last') as HTMLButtonElement
    const first = document.getElementById('first') as HTMLButtonElement
    last.focus()

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    last.dispatchEvent(event)

    expect(document.activeElement).toBe(first)
  })

  it('closes on Escape', () => {
    setupBasicDialog()
    registerPattern(dialog)
    getNamespace().init()
    dialog.open('dlg')

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    document.dispatchEvent(event)

    expect(document.getElementById('dlg')?.getAttribute('data-state')).toBe('closed')
  })
})
