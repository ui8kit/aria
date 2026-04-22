import { afterEach, beforeEach } from 'vitest'
import { resetRegistry, setAutoInitFlag } from '../src/core'

// Disable auto-init in unit tests so registering a pattern doesn't
// race with DOMContentLoaded against fixtures we set up per-test.
setAutoInitFlag(false)

beforeEach(() => {
  resetRegistry()
  setAutoInitFlag(false)
  document.body.innerHTML = ''
})

afterEach(() => {
  resetRegistry()
  document.body.innerHTML = ''
})
