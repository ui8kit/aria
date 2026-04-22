import { registerPattern } from '../core/registry'
import { alertPattern } from '../patterns/alert'

registerPattern(alertPattern)

export const init = alertPattern.init
export default alertPattern
