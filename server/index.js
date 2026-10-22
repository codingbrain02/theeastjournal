import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleCallback } from './telegram.js'

const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)))
const mimeTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.ico': 'image/x-icon' }

createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname
  if (pathname === '/api/callback') return handleCallback(request, response)
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end()
    return
  }

  const file = resolve(root, '.' + decodeURIComponent(pathname === '/' ? '/index.html' : pathname))
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(403).end()
    return
  }
  try {
    const contents = await readFile(file)
    const extension = file.slice(file.lastIndexOf('.'))
    response.writeHead(200, { 'Content-Type': `${mimeTypes[extension] || 'application/octet-stream'}; charset=utf-8` })
    response.end(request.method === 'HEAD' ? undefined : contents)
  } catch {
    response.writeHead(404).end()
  }
}).listen(Number(process.env.PORT) || 3000, '0.0.0.0')
