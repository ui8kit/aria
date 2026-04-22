import { registerPattern } from '../core/registry'
import { tooltip } from '../patterns/tooltip'

registerPattern(tooltip)

export const init = tooltip.init
export default tooltip
