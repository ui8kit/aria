export type PatternRoot = Document | Element

export type Disposer = () => void

export interface Pattern {
  name: string
  init(root?: PatternRoot): Disposer | void
}

export interface CoreHelpers {
  ready: (fn: () => void) => void
  byAttr: (name: string, root?: PatternRoot) => NodeListOf<HTMLElement>
}

export interface Ui8KitNamespace extends CoreHelpers {
  core: CoreHelpers
  register: (pattern: Pattern) => void
  init: (root?: PatternRoot) => void
  initPattern: (name: string, root?: PatternRoot) => void
  [key: string]: unknown
}
