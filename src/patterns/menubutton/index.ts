import { type Disposer, type Pattern, type PatternRoot } from '../../core/types'

function getMenu(button: HTMLElement): HTMLElement | null {
  const id = button.dataset.menubuttonTarget || button.getAttribute('aria-controls')
  if (!id) return null
  const menu = document.getElementById(id)
  return menu && menu.matches('[data-ui8kit="menu"]') ? (menu as HTMLElement) : null
}

function closeAllMenus(): void {
  const menus = document.querySelectorAll<HTMLElement>('[data-ui8kit="menu"]')
  for (const menu of menus) {
    menu.setAttribute('hidden', 'hidden')
    menu.dataset.state = 'closed'
  }
  const buttons = document.querySelectorAll<HTMLElement>('[data-ui8kit="menubutton"]')
  for (const btn of buttons) {
    btn.setAttribute('aria-expanded', 'false')
  }
}

function toggle(button: HTMLElement): void {
  const menu = getMenu(button)
  if (!menu) return

  const isOpen = menu.dataset.state === 'open'
  if (isOpen) {
    menu.setAttribute('hidden', 'hidden')
    menu.dataset.state = 'closed'
    button.setAttribute('aria-expanded', 'false')
  } else {
    closeAllMenus()
    menu.removeAttribute('hidden')
    menu.dataset.state = 'open'
    button.setAttribute('aria-expanded', 'true')
    const first = menu.querySelector<HTMLElement>('[data-menu-item]')
    first?.focus()
  }
}

function handleDocumentClick(event: Event): void {
  const target = event.target as Element | null
  if (!target) return
  if (!target.closest('[data-ui8kit="menubutton"], [data-ui8kit="menu"]')) {
    closeAllMenus()
  }
}

export const menubutton: Pattern & { closeAll: () => void } = {
  name: 'menubutton',
  init(root: PatternRoot = document): Disposer {
    const scope = root as ParentNode
    const buttons = scope.querySelectorAll<HTMLElement>('[data-ui8kit="menubutton"]')
    const cleanups: Array<() => void> = []

    for (const button of buttons) {
      if (button.dataset.ui8kitBound) continue

      button.setAttribute('aria-expanded', 'false')
      const onClick = (event: Event) => {
        event.preventDefault()
        toggle(button)
      }
      const onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggle(button)
        }
      }
      button.addEventListener('click', onClick)
      button.addEventListener('keydown', onKeydown)
      button.dataset.ui8kitBound = '1'

      cleanups.push(() => {
        button.removeEventListener('click', onClick)
        button.removeEventListener('keydown', onKeydown)
      })
    }

    document.addEventListener('click', handleDocumentClick)

    return () => {
      document.removeEventListener('click', handleDocumentClick)
      for (const fn of cleanups) fn()
    }
  },
  closeAll: closeAllMenus,
}

export default menubutton
