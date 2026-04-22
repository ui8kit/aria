import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { createServer } from 'node:http'

const args = new Map()
for (let i = 2; i < process.argv.length; i += 1) {
  const key = process.argv[i]
  const value = process.argv[i + 1]
  if (key?.startsWith('--') && value) {
    args.set(key.slice(2), value)
  }
}

const port = Number(args.get('port') || 4173)
const root = resolve(args.get('root') || '.')

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
}

function safePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split('?')[0] || '/')
  const normalized = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const candidate = resolve(join(root, normalized.replace(/^[/\\]/, '')))
  if (!candidate.startsWith(root)) {
    return null
  }
  return candidate
}

const server = createServer((req, res) => {
  const pathname = safePath(req.url || '/')
  if (!pathname) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  let filePath = pathname
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html')
  }

  if (!existsSync(filePath)) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  const ext = extname(filePath)
  const type = contentTypes[ext] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' })
  createReadStream(filePath).pipe(res)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server listening on http://127.0.0.1:${port}`)
})
