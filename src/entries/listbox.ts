import { registerPattern } from '../core/registry'
import { listbox } from '../patterns/listbox'

registerPattern(listbox)

export const init = listbox.init
