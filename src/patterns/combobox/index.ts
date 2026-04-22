import { type Disposer, type Pattern, type PatternRoot } from '../../core/types'

const COMBOBOX_SELECTOR = '[data-ui8kit="combobox"]'

function setOpen(root: HTMLElement, state: boolean): void {
  const list = root.querySelector<HTMLElement>('[role="listbox"], ul')
  const trigger = root.querySelector<HTMLElement>('[data-combobox-toggle]')
  const input = root.querySelector<HTMLInputElement>('input')

  if (!list || !input) {
    return
  }

  root.dataset.state = state ? 'open' : 'closed'
  trigger?.setAttribute('aria-expanded', String(state))
  input.setAttribute('aria-expanded', String(state))

  if (state) {
    list.removeAttribute('hidden')
  } else {
    list.setAttribute('hidden', 'hidden')
  }
}

function getVisibleOptions(root: HTMLElement): HTMLElement[] {
  const options = Array.from(root.querySelectorAll<HTMLElement>('[data-combobox-option]'))
  return options.filter((opt) => {
    return opt.style.display !== 'none' && opt.getAttribute('aria-disabled') !== 'true'
  })
}

function syncVisibleSelection(root: HTMLElement, option: HTMLElement | null): void {
  const options = root.querySelectorAll<HTMLElement>('[data-combobox-option]')
  for (const item of options) {
    item.classList.remove('ui-combobox-option-active')
    item.setAttribute('aria-selected', 'false')
  }

  if (option) {
    option.classList.add('ui-combobox-option-active')
    option.setAttribute('aria-selected', 'true')
  }
}

function filterOptions(root: HTMLElement): void {
  const input = root.querySelector<HTMLInputElement>('input')
  if (!input) return
  const options = root.querySelectorAll<HTMLElement>('[data-combobox-option]')
  const phrase = input.value.trim().toLowerCase()

  for (const option of options) {
    const text = (option.textContent || '').toLowerCase()
    const visible = phrase.length === 0 || text.includes(phrase)
    option.style.display = visible ? '' : 'none'
  }
}

function selectOption(root: HTMLElement, option: HTMLElement | null): void {
  if (!option) return
  const input = root.querySelector<HTMLInputElement>('input')
  if (!input) return

  const value = option.getAttribute('data-combobox-value') || option.textContent || ''
  input.value = value
  setOpen(root, false)
}

function bindCombobox(cb: HTMLElement): Disposer {
  const input = cb.querySelector<HTMLInputElement>('input')
  const list = cb.querySelector<HTMLElement>('[role="listbox"], ul')
  const toggle = cb.querySelector<HTMLElement>('[data-combobox-toggle]')

  if (!input || !list) {
    return () => {}
  }

  const onFocus = () => setOpen(cb, true)
  const onInput = () => {
    setOpen(cb, true)
    filterOptions(cb)
  }
  const onKeydown = (event: KeyboardEvent) => {
    const visible = getVisibleOptions(cb)
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (visible.length === 0) return
      const active = cb.querySelector('.ui-combobox-option-active') as HTMLElement | null
      const index = active ? visible.indexOf(active) : -1
      const next =
        event.key === 'ArrowDown'
          ? (index + 1) % visible.length
          : (index - 1 + visible.length) % visible.length
      syncVisibleSelection(cb, visible[next])
      visible[next]?.scrollIntoView({ block: 'nearest' })
      event.preventDefault()
      return
    }

    if (event.key === 'Enter') {
      selectOption(cb, cb.querySelector('.ui-combobox-option-active') as HTMLElement | null)
      event.preventDefault()
      return
    }

    if (event.key === 'Escape') {
      setOpen(cb, false)
      event.preventDefault()
    }
  }

  const onToggleClick = () => {
    const isOpen = cb.dataset.state === 'open'
    setOpen(cb, !isOpen)
  }

  const optionMousedown = (event: Event) => event.preventDefault()
  const optionClicks: Array<{ el: HTMLElement; handler: () => void }> = []
  for (const option of cb.querySelectorAll<HTMLElement>('[data-combobox-option]')) {
    const handler = () => selectOption(cb, option)
    option.addEventListener('mousedown', optionMousedown)
    option.addEventListener('click', handler)
    optionClicks.push({ el: option, handler })
  }

  input.addEventListener('focus', onFocus)
  input.addEventListener('input', onInput)
  input.addEventListener('keydown', onKeydown)
  toggle?.addEventListener('click', onToggleClick)

  filterOptions(cb)

  return () => {
    input.removeEventListener('focus', onFocus)
    input.removeEventListener('input', onInput)
    input.removeEventListener('keydown', onKeydown)
    toggle?.removeEventListener('click', onToggleClick)
    for (const { el, handler } of optionClicks) {
      el.removeEventListener('mousedown', optionMousedown)
      el.removeEventListener('click', handler)
    }
  }
}

function handleOutsideClick(event: Event): void {
  const target = event.target as Element | null
  if (!target || target.closest?.(COMBOBOX_SELECTOR)) {
    return
  }
  for (const item of document.querySelectorAll<HTMLElement>(COMBOBOX_SELECTOR)) {
    setOpen(item, false)
  }
}

export const combobox: Pattern = {
  name: 'combobox',
  init(root: PatternRoot = document): Disposer {
    const scope = root as ParentNode
    const roots = scope.querySelectorAll<HTMLElement>(COMBOBOX_SELECTOR)
    const disposers: Disposer[] = []

    for (const cb of roots) {
      if (cb.dataset.ui8kitBound) continue
      cb.dataset.ui8kitBound = '1'
      disposers.push(bindCombobox(cb))
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      for (const dispose of disposers) {
        dispose()
      }
    }
  },
}

export default combobox
