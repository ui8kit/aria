import { findFocusable } from '../../core/utils'
import { type Disposer, type Pattern, type PatternRoot } from '../../core/types'

const OPEN_ATTR = 'data-state'
const OPEN_VALUE = 'open'
const CLOSED_VALUE = 'closed'
const DIALOG_SELECTOR =
  '[data-ui8kit="dialog"], [data-ui8kit="sheet"], [data-ui8kit="alertdialog"]'
const ACTIVE_DIALOG_SELECTOR =
  '[data-ui8kit="dialog"][data-state="open"], [data-ui8kit="sheet"][data-state="open"], [data-ui8kit="alertdialog"][data-state="open"]'

const lastFocusByDialog = new WeakMap<HTMLElement, HTMLElement>()

function linkedOpenControls(dialog: HTMLElement): HTMLElement[] {
  const id = dialog.id
  if (!id) {
    return []
  }

  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-ui8kit-dialog-open][data-ui8kit-dialog-target]')
  ).filter((control) => control.getAttribute('data-ui8kit-dialog-target') === id)
}

function syncOpenControls(dialog: HTMLElement, open: boolean): void {
  for (const control of linkedOpenControls(dialog)) {
    control.setAttribute('aria-expanded', open ? 'true' : 'false')
  }
}

function toDialog(node?: string | Element | EventTarget | null): HTMLElement | null {
  if (!node) {
    return null
  }

  if (typeof node === 'string') {
    return document.getElementById(node)
  }

  const element = node as Element
  if (typeof element.matches === 'function' && element.matches(DIALOG_SELECTOR)) {
    return element as HTMLElement
  }

  const id = element.getAttribute?.('data-ui8kit-dialog-target')
  if (id) {
    return document.getElementById(id)
  }

  return element.closest?.(DIALOG_SELECTOR) as HTMLElement | null
}

function setOpen(dialog: HTMLElement | null, open: boolean): void {
  if (!dialog) {
    return
  }

  const overlay = dialog.querySelector<HTMLElement>('[data-ui8kit-dialog-overlay]')

  if (open) {
    dialog.setAttribute(OPEN_ATTR, OPEN_VALUE)
    dialog.removeAttribute('hidden')
    overlay?.removeAttribute('hidden')
    syncOpenControls(dialog, true)

    const firstFocusable = findFocusable(dialog)[0]
    firstFocusable?.focus()
    dialog.dataset.trapped = '1'
  } else {
    dialog.setAttribute(OPEN_ATTR, CLOSED_VALUE)
    dialog.setAttribute('hidden', 'hidden')
    overlay?.setAttribute('hidden', 'hidden')
    syncOpenControls(dialog, false)

    const last = lastFocusByDialog.get(dialog)
    if (last && document.contains(last)) {
      last.focus()
    }
    lastFocusByDialog.delete(dialog)
    delete dialog.dataset.trapped
  }
}

function open(dialogRoot?: string | Element | EventTarget | null): void {
  const dialog = toDialog(dialogRoot)
  if (!dialog) {
    return
  }

  const sourceElement =
    dialogRoot && dialogRoot instanceof HTMLElement && dialogRoot !== dialog
      ? dialogRoot
      : (document.activeElement as HTMLElement | null)
  if (sourceElement) {
    lastFocusByDialog.set(dialog, sourceElement)
  }

  setOpen(dialog, true)
}

function close(dialogRoot?: string | Element | EventTarget | null): void {
  setOpen(toDialog(dialogRoot), false)
}

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    const dialog = document.querySelector<HTMLElement>(ACTIVE_DIALOG_SELECTOR)
    if (dialog) {
      close(dialog)
      event.preventDefault()
    }
    return
  }

  if (event.key !== 'Tab') {
    return
  }

  const activeDialog = document.querySelector<HTMLElement>(ACTIVE_DIALOG_SELECTOR)
  if (!activeDialog || !activeDialog.contains(event.target as Node)) {
    return
  }

  const items = findFocusable(activeDialog)
  if (items.length === 0) {
    event.preventDefault()
    return
  }

  const first = items[0]
  const last = items[items.length - 1]
  if (!first || !last) {
    event.preventDefault()
    return
  }
  const current = document.activeElement

  if (event.shiftKey) {
    if (current === first || current === activeDialog) {
      last.focus()
      event.preventDefault()
    }
  } else if (current === last || current === activeDialog) {
    first.focus()
    event.preventDefault()
  }
}

function handleDocumentClick(event: Event): void {
  const target = event.target as Element | null
  if (!target) {
    return
  }

  const openButton = target.closest('[data-ui8kit-dialog-open]')
  if (openButton) {
    open(openButton)
    event.preventDefault()
    return
  }

  if (target.closest('[data-ui8kit-dialog-close]')) {
    close(target.closest(DIALOG_SELECTOR))
    event.preventDefault()
    return
  }

  if (target.closest('[data-ui8kit-dialog-overlay]')) {
    close(target.closest(DIALOG_SELECTOR))
  }
}

export const dialog: Pattern & {
  open: (id?: string | Element | EventTarget | null) => void
  close: (id?: string | Element | EventTarget | null) => void
} = {
  name: 'dialog',
  init(root: PatternRoot = document): Disposer {
    const scope = root as ParentNode
    const dialogs = scope.querySelectorAll<HTMLElement>(DIALOG_SELECTOR)
    for (const node of dialogs) {
      setOpen(node, node.getAttribute(OPEN_ATTR) === OPEN_VALUE)
    }

    document.addEventListener('click', handleDocumentClick)
    document.addEventListener('keydown', handleDocumentKeydown)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
      document.removeEventListener('keydown', handleDocumentKeydown)
    }
  },
  open,
  close,
}

export default dialog
