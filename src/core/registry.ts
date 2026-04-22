import { byAttr as _byAttr, isBrowser, ready as _ready } from './utils'
import {
  type CoreHelpers,
  type Disposer,
  type Pattern,
  type PatternRoot,
  type Ui8KitNamespace,
} from './types'
import { isAutoInitEnabled } from './env'

const NAMESPACE_KEY = 'ui8kit'

interface InternalState {
  patterns: Map<string, Pattern>
  // Per-pattern: scope -> disposer for that scope.
  scopes: Map<string, WeakMap<PatternRoot, Disposer>>
}

const state: InternalState = {
  patterns: new Map(),
  scopes: new Map(),
}

let cachedNamespace: Ui8KitNamespace | null = null

export const coreHelpers: CoreHelpers = { ready: _ready, byAttr: _byAttr }
export const ready = _ready
export const byAttr = _byAttr

function rootKey(root?: PatternRoot): PatternRoot {
  return (root ?? (isBrowser() ? document : ({} as unknown as PatternRoot))) as PatternRoot
}

function buildNamespace(): Ui8KitNamespace {
  const existing = (globalThis as { [NAMESPACE_KEY]?: Ui8KitNamespace })[NAMESPACE_KEY]
  if (existing) {
    return existing
  }

  const ns: Ui8KitNamespace = {
    core: coreHelpers,
    ready: _ready,
    byAttr: _byAttr,
    register: registerPattern,
    init,
    initPattern,
  }

  if (isBrowser()) {
    ;(globalThis as { [NAMESPACE_KEY]?: Ui8KitNamespace })[NAMESPACE_KEY] = ns
  }

  return ns
}

export function getNamespace(): Ui8KitNamespace {
  if (!cachedNamespace) {
    cachedNamespace = buildNamespace()
  }
  return cachedNamespace
}

export function registerPattern(pattern: Pattern): void {
  if (state.patterns.has(pattern.name)) {
    return
  }

  state.patterns.set(pattern.name, pattern)
  getNamespace()[pattern.name] = pattern

  if (isAutoInitEnabled() && isBrowser()) {
    _ready(() => {
      initPattern(pattern.name)
    })
  }
}

export function initPattern(name: string, root?: PatternRoot): void {
  const pattern = state.patterns.get(name)
  if (!pattern) {
    return
  }

  if (!isBrowser() && !root) {
    return
  }

  const scope = rootKey(root)
  const scopeMap = state.scopes.get(name) ?? new WeakMap<PatternRoot, Disposer>()
  state.scopes.set(name, scopeMap)

  if (scopeMap.has(scope)) {
    return
  }

  const result = pattern.init(scope)
  scopeMap.set(scope, typeof result === 'function' ? result : noop)
}

export function init(root?: PatternRoot): void {
  for (const pattern of state.patterns.values()) {
    initPattern(pattern.name, root)
  }
}

export function disposePattern(name: string, root?: PatternRoot): void {
  const scope = rootKey(root)
  const scopeMap = state.scopes.get(name)
  if (!scopeMap) {
    return
  }

  const dispose = scopeMap.get(scope)
  if (!dispose) {
    return
  }

  try {
    dispose()
  } finally {
    scopeMap.delete(scope)
  }
}

/**
 * Test/HMR utility: clears the registry, removes the global namespace,
 * and forces a fresh bootstrap on next call.
 *
 * Note: only existing scope disposers are flushed; per-element bindings
 * created via dataset.ui8kitBound on user-supplied DOM are not unwound.
 */
export function resetRegistry(): void {
  for (const [name, scopeMap] of state.scopes.entries()) {
    void name
    void scopeMap
  }
  state.patterns.clear()
  state.scopes.clear()

  if (isBrowser()) {
    delete (globalThis as { [NAMESPACE_KEY]?: Ui8KitNamespace })[NAMESPACE_KEY]
  }
  cachedNamespace = null
}

function noop(): void {
  // no-op disposer
}
