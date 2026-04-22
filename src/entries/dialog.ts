import { registerPattern } from '../core/registry'
import { dialog } from '../patterns/dialog'

registerPattern(dialog)

export const init = dialog.init
export const open = dialog.open
export const close = dialog.close
