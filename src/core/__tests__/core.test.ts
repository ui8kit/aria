import { describe, it, expect } from 'vitest'
import { getNamespace, registerPattern, resetRegistry } from '../registry'
import { setAutoInitFlag, AUTO_INIT_KEY } from '../env'
import type { Pattern } from '../types'

describe('core', () => {
  it('initializes namespace lazily', () => {
    resetRegistry()
    expect((globalThis as Record<string, unknown>).ui8kit).toBeUndefined()

    const ns = getNamespace()

    expect(typeof ns.ready).toBe('function')
    expect(typeof ns.byAttr).toBe('function')
    expect(typeof ns.init).toBe('function')
    expect(typeof ns.register).toBe('function')
    expect((globalThis as Record<string, unknown>).ui8kit).toBe(ns)
  })

  it('respects auto-init flag', () => {
    setAutoInitFlag(false)
    expect((globalThis as Record<string, unknown>)[AUTO_INIT_KEY]).toBe(false)
    setAutoInitFlag(true)
    expect((globalThis as Record<string, unknown>)[AUTO_INIT_KEY]).toBe(true)
  })

  it('registers a pattern only once', () => {
    let initCount = 0
    const fake: Pattern = {
      name: 'fake',
      init() {
        initCount += 1
        return () => {}
      },
    }
    registerPattern(fake)
    registerPattern(fake)
    getNamespace().init()
    getNamespace().init()
    expect(initCount).toBe(1)
  })
})
