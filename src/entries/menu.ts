import { registerPattern } from '../core/registry'
import { menu } from '../patterns/menu'

registerPattern(menu)

export const init = menu.init
export default menu
