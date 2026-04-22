import { registerPattern } from '../core/registry'
import { switchPattern } from '../patterns/switch'

registerPattern(switchPattern)

export const init = switchPattern.init
