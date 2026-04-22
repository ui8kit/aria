/**
 * Side-effectful entry — auto-registers ALL patterns and exposes
 * `window.ui8kit` global. This is the bundle used by the IIFE/CDN
 * artifact and by users who want everything pre-wired:
 *
 *   import '@ui8kit/aria/all'
 *
 * For tree-shakeable imports use the pure entry `@ui8kit/aria`
 * or per-pattern entries like `@ui8kit/aria/dialog`.
 */
import { getNamespace, registerPattern } from '../core/registry'
import { dialog } from '../patterns/dialog'
import { accordion } from '../patterns/accordion'
import { tabs } from '../patterns/tabs'
import { combobox } from '../patterns/combobox'
import { tooltip } from '../patterns/tooltip'
import { alertPattern } from '../patterns/alert'
import { disclosure } from '../patterns/disclosure'
import { menu } from '../patterns/menu'
import { menubutton } from '../patterns/menubutton'
import { listbox } from '../patterns/listbox'
import { switchPattern } from '../patterns/switch'

registerPattern(dialog)
registerPattern(accordion)
registerPattern(tabs)
registerPattern(combobox)
registerPattern(tooltip)
registerPattern(alertPattern)
registerPattern(disclosure)
registerPattern(menu)
registerPattern(menubutton)
registerPattern(listbox)
registerPattern(switchPattern)

export const ui8kit = getNamespace()
export {
  dialog,
  accordion,
  tabs,
  combobox,
  tooltip,
  alertPattern,
  disclosure,
  menu,
  menubutton,
  listbox,
  switchPattern,
}
export * from '../core'
