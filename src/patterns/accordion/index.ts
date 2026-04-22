import { type Disposer, type Pattern } from '../../core/types'

function itemState(item: Element, open: boolean): void {
  const trigger = item.querySelector<HTMLButtonElement>('[data-ui8kit-accordion-trigger]')
  const panel = item.querySelector<HTMLElement>('[data-ui8kit-accordion-content]')
  if (!trigger || !panel) {
    return
  }

  item.setAttribute('data-state', open ? 'open' : 'closed')
  trigger.setAttribute('aria-expanded', open ? 'true' : 'false')

  if (open) {
    panel.removeAttribute('hidden')
  } else {
    panel.setAttribute('hidden', 'hidden')
  }
}

function isMultiple(root: Element): boolean {
  return root.getAttribute('data-accordion-type') === 'multiple'
}

function closeOthers(root: Element, current: Element): void {
  const items = root.querySelectorAll<HTMLElement>('[data-accordion-item]')
  for (const item of items) {
    if (item !== current) {
      itemState(item, false)
    }
  }
}

function initAccordionRoot(root: Element): void {
  const items = root.querySelectorAll<HTMLElement>('[data-accordion-item]')
  for (const item of items) {
    const trigger = item.querySelector<HTMLButtonElement>('[data-ui8kit-accordion-trigger]')
    const panel = item.querySelector<HTMLElement>('[data-ui8kit-accordion-content]')

    if (!trigger || !panel || item.dataset.ui8kitBound) {
      continue
    }

    item.dataset.ui8kitBound = '1'
    trigger.type = 'button'
    itemState(item, item.getAttribute('data-state') === 'open')

    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      const current = item
      const next = item.getAttribute('data-state') !== 'open'
      if (!isMultiple(root)) {
        closeOthers(root, current)
      }
      itemState(current, next)
    })

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        trigger.click()
      }
    })
  }
}

export const accordion: Pattern = {
  name: 'accordion',
  init(root = document): Disposer {
    const roots = root.querySelectorAll<HTMLElement>('[data-ui8kit="accordion"]')
    for (const rootItem of roots) {
      initAccordionRoot(rootItem)
    }
    return () => {}
  }
}

export default accordion
