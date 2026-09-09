import { createServer } from 'node:http'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const directory = dirname(fileURLToPath(import.meta.url))
const appRoot = resolve(directory, '../../..')
export const prefix = '/docs/design/profile/'

export async function startPreview(port = 3114) {
  const routes = new Map([
    ['index.html', 'text/html; charset=utf-8'], ['profile.css', 'text/css; charset=utf-8'],
    ['profile.js', 'text/javascript; charset=utf-8'], ['model.mjs', 'text/javascript; charset=utf-8'],
  ].map(([file, mime]) => [`${prefix}${file}`, { file: join(directory, file), mime }]))
  for (const file of ['brand/logo-spity-white.png', 'demo/climbing/verdon-cliff.jpg', 'demo/climbing/fontainebleau-bouldering.jpg', 'demo/climbing/verdon-wall-climber.jpg', 'demo/climbing/indoor-gym-overview.jpg']) {
    routes.set(`/public/images/${file}`, { file: join(appRoot, 'public/images', file), mime: file.endsWith('.png') ? 'image/png' : 'image/jpeg' })
  }
  routes.set('/credits', { file: join(appRoot, 'public/images/demo/climbing/ATTRIBUTIONS.md'), mime: 'text/plain; charset=utf-8' })

  // Optional local font cache; no downloads and no missing-font requests on a clean clone.
  let fontCss = '/* System fonts are used if the local Next font cache is absent. */'
  const chunks = join(appRoot, '.next/dev/static/chunks')
  const files = await readdir(chunks).catch(() => [])
  const stylesheet = files.find((file) => file.includes('font_google_outfit_') && file.endsWith('.single.css'))
  if (stylesheet) {
    const css = await readFile(join(chunks, stylesheet), 'utf8')
    const latin = [...css.matchAll(/src:\s*url\("\.\.\/media\/([\w.-]+\.woff2)"\)/g)].at(-1)?.[1]
    if (latin) {
      const font = await readFile(join(appRoot, '.next/dev/static/media', latin)).catch(() => null)
      if (font) {
        routes.set(`${prefix}outfit.woff2`, { bytes: font, mime: 'font/woff2' })
        fontCss = "@font-face { font-family:Outfit; font-style:normal; font-weight:100 900; font-display:swap; src:url('./outfit.woff2') format('woff2'); }"
      }
    }
  }
  routes.set(`${prefix}fonts.css`, { bytes: Buffer.from(fontCss), mime: 'text/css; charset=utf-8' })
  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('X-Robots-Tag', 'noindex, nofollow')
    response.setHeader('Referrer-Policy', 'no-referrer')
    response.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob:; font-src 'self'; connect-src 'none'; form-action 'none'; frame-ancestors 'none'; base-uri 'none'")
    if (!/^(127\.0\.0\.1|localhost)(:\d+)?$/.test(request.headers.host ?? '')) { response.writeHead(403).end(); return }
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return }
    let pathname
    try { pathname = new URL(request.url, 'http://127.0.0.1').pathname } catch { response.writeHead(400).end(); return }
    if (pathname === '/') { response.writeHead(302, { Location: `${prefix}index.html` }).end(); return }
    const entry = routes.get(pathname)
    if (!entry) { response.writeHead(404).end('Not found'); return }
    try {
      const bytes = entry.bytes ?? await readFile(entry.file)
      response.writeHead(200, { 'Content-Type': entry.mime, 'Content-Length': bytes.length })
      response.end(request.method === 'HEAD' ? undefined : bytes)
    } catch { response.writeHead(404).end('Not found') }
  })
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve) })
  return server
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { await startPreview(); console.log(`Maquette locale : http://127.0.0.1:3114${prefix}index.html`) }
  catch (error) { console.error(error.message); process.exitCode = 1 }
}
