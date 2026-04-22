export const AUTO_INIT_KEY = '__UI8KIT_ARIA_AUTO_INIT__'

export function isAutoInitEnabled(): boolean {
  return (globalThis as Record<string, unknown>)[AUTO_INIT_KEY] !== false
}

export function setAutoInitFlag(value: boolean): void {
  ;(globalThis as Record<string, unknown>)[AUTO_INIT_KEY] = value
}
