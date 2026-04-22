/**
 * Pure ESM entry — re-exports core API and pattern factories.
 *
 * NO side effects: importing this entry does NOT register any pattern,
 * does NOT touch `window`, and is safe in SSR.
 *
 * Use this when consuming as an ES module + tree-shaking:
 *   import { registerPattern, dialog } from '@ui8kit/aria'
 *
 * To get the full bundle with auto-registration use `@ui8kit/aria/all`.
 */
export {
  getNamespace,
  registerPattern,
  init,
  initPattern,
  disposePattern,
  resetRegistry,
  byAttr,
  ready,
  coreHelpers,
  AUTO_INIT_KEY,
  isAutoInitEnabled,
  setAutoInitFlag,
} from '../core'

export type {
  Pattern,
  PatternRoot,
  Disposer,
  Ui8KitNamespace,
  CoreHelpers,
} from '../core/types'

export { dialog } from '../patterns/dialog'
export { accordion } from '../patterns/accordion'
export { tabs } from '../patterns/tabs'
export { combobox } from '../patterns/combobox'
export { tooltip } from '../patterns/tooltip'
export { alertPattern } from '../patterns/alert'
export { disclosure } from '../patterns/disclosure'
export { menu } from '../patterns/menu'
export { menubutton } from '../patterns/menubutton'
export { listbox } from '../patterns/listbox'
export { switchPattern } from '../patterns/switch'
