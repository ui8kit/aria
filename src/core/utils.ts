import type { PatternRoot } from './types'

export function ready(fn: () => void): void {
  if (typeof document === 'undefined') {
    fn()
    return
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }

  fn()
}

export function byAttr(name: string, root: PatternRoot = document): NodeListOf<HTMLElement> {
  return root.querySelectorAll(`[data-${name}]`)
}

const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'

export function findFocusable(root: ParentNode): HTMLElement[] {
  const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
  return items.filter(
    (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true'
  )
}

export function isBrowser(): boolean {
  return typeof document !== 'undefined' && typeof window !== 'undefined'
}
