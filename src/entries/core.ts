/**
 * Pure ESM entry for core helpers and registry only.
 *
 * Importing this entry has NO side effects. Use it together with
 * per-pattern entries when assembling a custom bundle.
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
