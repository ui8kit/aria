import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// Generate Subresource Integrity hashes for distribution artifacts.
// Output is consumed by README/CDN snippets (see docs/sri-cdn.md and .project/PACKAGING-AND-INIT.md).

const distDir = 'dist'
const files = readdirSync(distDir).filter(
  (file) => file.endsWith('.js') && !file.endsWith('.map')
)

const map = Object.fromEntries(
  files.map((file) => {
    const body = readFileSync(join(distDir, file))
    const hash = createHash('sha384').update(body).digest('base64')
    return [file, `sha384-${hash}`]
  })
)

writeFileSync(join(distDir, 'sri.json'), JSON.stringify(map, null, 2) + '\n')
console.log('Generated', Object.keys(map).length, 'SRI hashes')
