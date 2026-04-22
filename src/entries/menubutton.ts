import { registerPattern } from '../core/registry'
import { menubutton } from '../patterns/menubutton'

registerPattern(menubutton)

export const init = menubutton.init
export const close = menubutton.closeAll
