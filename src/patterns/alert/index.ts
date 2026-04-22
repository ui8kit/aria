import { type Disposer, type Pattern } from '../../core/types'

export const alertPattern: Pattern = {
  name: 'alert',
  init(root = document): Disposer {
    const nodes = root.querySelectorAll<HTMLElement>('[data-ui8kit="alert"], [role="alert"]')

    for (const alert of nodes) {
      if (!alert.hasAttribute('role')) {
        alert.setAttribute('role', 'status')
      }
      if (!alert.hasAttribute('aria-live')) {
        alert.setAttribute('aria-live', 'polite')
      }
      if (!alert.hasAttribute('aria-atomic')) {
        alert.setAttribute('aria-atomic', 'true')
      }
    }

    return () => {}
  }
}

export default alertPattern
