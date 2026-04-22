import { type Disposer, type Pattern } from '../../core/types'

function toggle(control: HTMLElement): void {
  const checked = control.getAttribute('aria-checked') === 'true'
  const next = !checked
  control.setAttribute('aria-checked', String(next))
  control.setAttribute('data-state', next ? 'checked' : 'unchecked')
  control.dataset.value = String(next)
}

export const switchPattern: Pattern = {
  name: 'switch',
  init(root = document): Disposer {
    const switches = root.querySelectorAll<HTMLElement>('[data-ui8kit="switch"], [role="switch"]')

    for (const item of switches) {
      if (item.dataset.ui8kitBound) continue
      item.dataset.ui8kitBound = '1'

      const control = item.querySelector<HTMLElement>('[data-switch-control]') || item
      control.setAttribute('role', 'switch')
      control.setAttribute('tabindex', control.getAttribute('tabindex') ?? '0')
      if (!control.hasAttribute('aria-checked')) {
        control.setAttribute('aria-checked', 'false')
      }

      const handler = (event: Event) => {
        event.preventDefault()
        toggle(control)
      }
      control.addEventListener('click', handler)
      control.addEventListener('keydown', (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
          handler(event)
        }
      })
    }

    return () => {}
  }
}

export default switchPattern
