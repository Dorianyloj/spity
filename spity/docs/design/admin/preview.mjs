import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(directory, '../../..')
const prefix = '/docs/design/admin/'
const routes = new Map([
  [`${prefix}index.html`, ['index.html', 'text/html; charset=utf-8']],
  [`${prefix}admin.css`, ['admin.css', 'text/css; charset=utf-8']],
  [`${prefix}admin.js`, ['admin.js', 'text/javascript; charset=utf-8']],
  [`${prefix}dashboard.mjs`, ['dashboard.mjs', 'text/javascript; charset=utf-8']],
].map(([url, [file, mime]]) => [url, { file: join(directory, file), mime }]))
routes.set('/public/images/brand/logo-spity-white.png', { file: join(appRoot, 'public/images/brand/logo-spity-white.png'), mime: 'image/png' })

// Reuse local Next font cache when present, without network downloads or vendoring.
for (const [family, alias] of [['outfit', 'outfit'], ['jetbrains_mono', 'mono']]) {
  const chunks = join(appRoot, '.next/dev/static/chunks')
  const files = await readdir(chunks).catch(() => [])
  const stylesheet = files.find((file) => file.includes(`font_google_${family}_`) && file.endsWith('.single.css'))
  if (!stylesheet) continue
  const css = await readFile(join(chunks, stylesheet), 'utf8')
  const matches = [...css.matchAll(/src:\s*url\("\.\.\/media\/([\w.-]+\.woff2)"\)/g)]
  const latinFont = matches.at(-1)?.[1]
  if (latinFont) routes.set(`${prefix}${alias}.woff2`, { file: join(appRoot, '.next/dev/static/media', latinFont), mime: 'font/woff2' })
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return }
  if (pathname === '/') { response.writeHead(302, { Location: `${prefix}index.html` }).end(); return }
  const entry = routes.get(pathname)
  if (!entry) { response.writeHead(404).end('Not found'); return }
  try {
    const bytes = await readFile(entry.file)
    response.writeHead(200, {
      'Content-Type': entry.mime,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'",
    })
    response.end(request.method === 'HEAD' ? undefined : bytes)
  } catch { response.writeHead(404).end('Not found') }
})
server.listen(3113, '127.0.0.1', () => console.log(`Maquette locale : http://127.0.0.1:3113${prefix}index.html`))
server.on('error', (error) => { console.error(error.message); process.exitCode = 1 })
