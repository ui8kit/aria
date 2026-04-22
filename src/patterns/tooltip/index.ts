import { type Disposer, type Pattern } from '../../core/types'

function show(root: HTMLElement): void {
  const content = root.querySelector<HTMLElement>('[role="tooltip"]')
  if (!content) {
    return
  }

  content.removeAttribute('hidden')
  root.setAttribute('data-state', 'open')
  content.setAttribute('aria-hidden', 'false')
}

function hide(root: HTMLElement): void {
  const content = root.querySelector<HTMLElement>('[role="tooltip"]')
  if (!content) {
    return
  }

  content.setAttribute('hidden', 'hidden')
  root.setAttribute('data-state', 'closed')
  content.setAttribute('aria-hidden', 'true')
}

export const tooltip: Pattern = {
  name: 'tooltip',
  init(root = document): Disposer {
    const tooltips = root.querySelectorAll<HTMLElement>('[data-ui8kit="tooltip"]')

    for (const tooltipRoot of tooltips) {
      if (tooltipRoot.dataset.ui8kitBound) continue
      tooltipRoot.addEventListener('mouseenter', () => show(tooltipRoot))
      tooltipRoot.addEventListener('focusin', () => show(tooltipRoot))
      tooltipRoot.addEventListener('mouseleave', () => hide(tooltipRoot))
      tooltipRoot.addEventListener('focusout', () => hide(tooltipRoot))
      tooltipRoot.dataset.ui8kitBound = '1'
    }

    return () => {}
  }
}

export default tooltip
