import { registerPattern } from '../core/registry'
import { combobox } from '../patterns/combobox'

registerPattern(combobox)

export const init = combobox.init
