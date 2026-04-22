import { type Disposer, type Pattern } from '../../core/types'

function makeItemsFocusable(items: HTMLElement[]): void {
  for (const [index, item] of items.entries()) {
    item.tabIndex = index === 0 ? 0 : -1
  }
}

function moveFocus(items: HTMLElement[], current: number, delta: number): number {
  const next = (current + delta + items.length) % items.length
  items[current].tabIndex = -1
  items[next].tabIndex = 0
  items[next].focus()
  return next
}

export const menu: Pattern = {
  name: 'menu',
  init(root = document): Disposer {
    const menus = root.querySelectorAll<HTMLElement>('[data-ui8kit="menu"]')

    for (const menuRoot of menus) {
      const items = Array.from(menuRoot.querySelectorAll<HTMLElement>('[data-menu-item]'))
      if (!items.length || menuRoot.dataset.ui8kitBound) continue

      makeItemsFocusable(items)
      let current = 0

      for (const item of items) {
        item.addEventListener('keydown', (event) => {
          if (event.key === 'ArrowDown') {
            current = moveFocus(items, current, 1)
            event.preventDefault()
          }
          if (event.key === 'ArrowUp') {
            current = moveFocus(items, current, -1)
            event.preventDefault()
          }
          if (event.key === 'Home') {
            current = moveFocus(items, current, -current)
            event.preventDefault()
          }
          if (event.key === 'End') {
            current = moveFocus(items, current, items.length - 1 - current)
            event.preventDefault()
          }
          if (event.key === 'Escape') {
            menuRoot.setAttribute('hidden', 'hidden')
            const button = document.querySelector(`[data-menubutton-target="${menuRoot.id}"]`) as HTMLElement | null
            button?.focus()
          }
        })

        item.addEventListener('click', () => {
          item.focus()
        })
      }

      menuRoot.dataset.ui8kitBound = '1'
    }

    return () => {}
  }
}

export default menu
