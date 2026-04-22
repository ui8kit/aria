import { defineConfig } from 'tsup'

const moduleEntries = {
  index: 'src/entries/index.ts',
  all: 'src/entries/all.ts',
  core: 'src/entries/core.ts',
  dialog: 'src/entries/dialog.ts',
  accordion: 'src/entries/accordion.ts',
  tabs: 'src/entries/tabs.ts',
  combobox: 'src/entries/combobox.ts',
  tooltip: 'src/entries/tooltip.ts',
  alert: 'src/entries/alert.ts',
  disclosure: 'src/entries/disclosure.ts',
  menu: 'src/entries/menu.ts',
  menubutton: 'src/entries/menubutton.ts',
  listbox: 'src/entries/listbox.ts',
  switch: 'src/entries/switch.ts',
} as const

const iifeEntries = {
  all: 'src/entries/all.ts',
  core: 'src/entries/core.ts',
} as const

export default defineConfig([
  {
    entry: moduleEntries,
    outDir: 'dist',
    clean: true,
    target: 'es2018',
    sourcemap: true,
    format: ['esm', 'cjs'],
    splitting: false,
    dts: true,
    minify: false,
    treeshake: true,
    cjsInterop: true,
    noExternal: [],
  },
  {
    entry: iifeEntries,
    outDir: 'dist',
    clean: false,
    target: 'es2018',
    sourcemap: true,
    format: ['iife'],
    globalName: 'ui8kit',
    splitting: false,
    dts: false,
    minify: false,
    treeshake: true,
    noExternal: [],
  },
  {
    entry: iifeEntries,
    outDir: 'dist',
    clean: false,
    target: 'es2018',
    sourcemap: true,
    format: ['iife'],
    globalName: 'ui8kit',
    splitting: false,
    dts: false,
    minify: true,
    treeshake: true,
    outExtension: () => ({ js: '.iife.min.js' }),
    noExternal: [],
  },
])
