import { resetRegistry, setAutoInitFlag } from '../src/core'

export function resetTestState(): void {
  setAutoInitFlag(false)
  resetRegistry()
  document.body.innerHTML = ''
}

export function cleanupTestState(): void {
  resetRegistry()
  document.body.innerHTML = ''
}
