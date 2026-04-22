import { type Disposer, type Pattern } from '../../core/types'

function setState(root: Element, open: boolean): void {
  const trigger = root.querySelector<HTMLElement>('[data-disclosure-trigger]')
  const content = root.querySelector<HTMLElement>('[data-disclosure-content]')
  if (!trigger || !content) {
    return
  }

  trigger.setAttribute('aria-expanded', String(open))
  if (open) {
    content.removeAttribute('hidden')
  } else {
    content.setAttribute('hidden', 'hidden')
  }
}

export const disclosure: Pattern = {
  name: 'disclosure',
  init(root = document): Disposer {
    const roots = root.querySelectorAll<HTMLElement>('[data-ui8kit="disclosure"]')
    for (const disclosureRoot of roots) {
      const trigger = disclosureRoot.querySelector<HTMLElement>('[data-disclosure-trigger]')
      const content = disclosureRoot.querySelector<HTMLElement>('[data-disclosure-content]')
      if (!trigger || !content || disclosureRoot.dataset.ui8kitBound) continue

      const initial = trigger.getAttribute('aria-expanded') === 'true'
      setState(disclosureRoot, initial)

      trigger.addEventListener('click', () => {
        const next = trigger.getAttribute('aria-expanded') !== 'true'
        setState(disclosureRoot, next)
      })
      trigger.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          trigger.click()
        }
      })

      disclosureRoot.dataset.ui8kitBound = '1'
    }

    return () => {}
  }
}

export default disclosure
