import { type Disposer, type Pattern } from '../../core/types'

function setSelected(root: Element, target: HTMLElement): void {
  const options = root.querySelectorAll<HTMLElement>('[role="option"]')
  for (const option of options) {
    option.classList.remove('ui-listbox-option-active')
    option.setAttribute('aria-selected', 'false')
    option.setAttribute('tabindex', '-1')
  }

  target.classList.add('ui-listbox-option-active')
  target.setAttribute('aria-selected', 'true')
  target.setAttribute('tabindex', '0')
  target.focus()
}

export const listbox: Pattern = {
  name: 'listbox',
  init(root = document): Disposer {
    const lists = root.querySelectorAll<HTMLElement>('[data-ui8kit="listbox"]')

    for (const list of lists) {
      const options = Array.from(list.querySelectorAll<HTMLElement>('[role="option"]'))
      if (!options.length || list.dataset.ui8kitBound) continue

      for (let i = 0; i < options.length; i++) {
        options[i].tabIndex = i === 0 ? 0 : -1
        options[i].addEventListener('click', () => {
          setSelected(list, options[i])
        })
      }

      list.addEventListener('keydown', (event) => {
        if (event.key === 'Home') {
          setSelected(list, options[0])
          event.preventDefault()
        }
        if (event.key === 'End') {
          setSelected(list, options[options.length - 1])
          event.preventDefault()
        }
        if (event.key === 'ArrowDown') {
          const current = options.indexOf(document.activeElement as HTMLElement)
          const next = (current + 1) % options.length
          setSelected(list, options[next])
          event.preventDefault()
        }
        if (event.key === 'ArrowUp') {
          const current = options.indexOf(document.activeElement as HTMLElement)
          const prev = (current - 1 + options.length) % options.length
          setSelected(list, options[prev])
          event.preventDefault()
        }
      })

      list.dataset.ui8kitBound = '1'
    }

    return () => {}
  }
}

export default listbox
