import { registerPattern } from '../core/registry'
import { disclosure } from '../patterns/disclosure'

registerPattern(disclosure)

export const init = disclosure.init
export default disclosure
