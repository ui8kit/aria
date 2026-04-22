import { type Disposer, type Pattern } from '../../core/types'

function activate(root: Element, value: string, useFocus: boolean): void {
  const triggers = root.querySelectorAll<HTMLButtonElement>('[data-tabs-trigger]')
  const panels = root.querySelectorAll<HTMLElement>('[data-tabs-panel]')

  for (const trigger of triggers) {
    const selected = trigger.getAttribute('data-tabs-value') === value
    trigger.setAttribute('aria-selected', selected ? 'true' : 'false')
    trigger.tabIndex = selected ? 0 : -1
    if (selected && useFocus) {
      trigger.focus()
    }
  }

  for (const panel of panels) {
    panel.hidden = panel.getAttribute('data-tabs-value') !== value
  }
}

function defaultValue(root: Element): string {
  const rootValue = root.getAttribute('data-tabs-value')
  if (rootValue) return rootValue

  const selected = root.querySelector<HTMLElement>('[data-tabs-trigger][aria-selected="true"]')
  if (selected?.getAttribute('data-tabs-value')) {
    return selected.getAttribute('data-tabs-value') as string
  }

  return root.querySelector<HTMLElement>('[data-tabs-trigger]')?.getAttribute('data-tabs-value') || ''
}

function onKeydown(root: Element, event: KeyboardEvent): void {
  const triggers = Array.from(root.querySelectorAll<HTMLElement>('[data-tabs-trigger]'))
  if (!triggers.length) return

  const trigger = (event.target as Element).closest('[data-tabs-trigger]') as HTMLElement | null
  if (!trigger) return

  const index = triggers.indexOf(trigger)
  if (index < 0) return

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    const next = triggers[(index + 1) % triggers.length]
    event.preventDefault()
    activate(root, next.getAttribute('data-tabs-value') || '', true)
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    const prev = triggers[(index - 1 + triggers.length) % triggers.length]
    event.preventDefault()
    activate(root, prev.getAttribute('data-tabs-value') || '', true)
  }
}

export const tabs: Pattern = {
  name: 'tabs',
  init(root = document): Disposer {
    const roots = root.querySelectorAll<HTMLElement>('[data-ui8kit="tabs"]')

    for (const tabsRoot of roots) {
      if (tabsRoot.dataset.ui8kitBound) continue
      tabsRoot.dataset.ui8kitBound = '1'

      const value = defaultValue(tabsRoot)
      if (value) {
        activate(tabsRoot, value, false)
      }

      tabsRoot.addEventListener('click', (event) => {
        const trigger = (event.target as Element).closest('[data-tabs-trigger]') as HTMLElement | null
        if (!trigger) return

        const value = trigger.getAttribute('data-tabs-value')
        if (!value) return

        event.preventDefault()
        activate(tabsRoot, value, false)
      })

      tabsRoot.addEventListener('keydown', (event) => {
        onKeydown(tabsRoot, event)
      })
    }

    return () => {}
  }
}

export default tabs
