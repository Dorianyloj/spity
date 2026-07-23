import { createHash } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { marked } from 'marked'
import puppeteer from 'puppeteer-core'

const repositoryRoot = resolve('..')
const docsRoot = resolve(repositoryRoot, 'docs/bc02')
const outputDirectory = resolve(docsRoot, 'livrable')
const htmlPath = resolve(outputDirectory, 'DOSSIER_BC02_SPITY.html')
const pdfPath = resolve(outputDirectory, 'DOSSIER_BC02_SPITY.pdf')
const manifestPath = resolve(outputDirectory, 'manifest.json')
const coverImagePath = resolve(docsRoot, 'annexes/captures/01-dashboard-grimpeur-desktop.png')
const sourceNames = [
  '16_DOSSIER_FINAL_BC02.md',
  '20_FOCUS_COMPETENCES_DETERMINANTES_BC02.md',
  '19_RETOUR_EXPERIENCE_ET_CHOIX_TECHNIQUES.md',
  '15_INDEX_PREUVES_GRILLE_BC02.md',
  '18_ANNEXES_VISUELLES_BC02.md',
]
const sourcePaths = sourceNames.map((name) => resolve(docsRoot, name))
const sourceIdByName = new Map(sourceNames.map((name) => [name, `doc-${name.replace(/\.md$/, '').toLowerCase()}`]))

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

const toSlug = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/<[^>]+>/g, '')
  .replace(/&[a-z]+;/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const stripHtml = (value) => value.replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').trim()

const resolveLink = (href, sourcePath, sourceId) => {
  if (/^(https?:|mailto:)/.test(href)) {
    return href
  }

  if (href.startsWith('#')) {
    return `#${sourceId}-${toSlug(decodeURIComponent(href.slice(1)))}`
  }

  const [pathname, fragment] = href.split('#')
  const absolutePath = resolve(dirname(sourcePath), decodeURIComponent(pathname))

  if (extname(absolutePath) === '.md') {
    const targetId = sourceIdByName.get(basename(absolutePath))

    if (targetId) {
      return fragment ? `#${targetId}-${toSlug(decodeURIComponent(fragment))}` : `#${targetId}`
    }
  }

  const repositoryRelativePath = relative(repositoryRoot, absolutePath)

  if (!repositoryRelativePath.startsWith('..')) {
    return `https://github.com/Dorianyloj/spity/blob/develop/${repositoryRelativePath.split(sep).join('/')}`
  }

  return pathToFileURL(absolutePath).href
}

const rewriteRenderedHtml = (renderedHtml, sourcePath, sourceId) => {
  const headingCounts = new Map()
  let firstHeading = true
  let html = renderedHtml.replace(/<h([1-6])>([\s\S]*?)<\/h\1>/g, (_match, level, content) => {
    const baseId = firstHeading ? sourceId : `${sourceId}-${toSlug(stripHtml(content))}`
    const count = (headingCounts.get(baseId) ?? 0) + 1
    const id = count === 1 ? baseId : `${baseId}-${count}`
    headingCounts.set(baseId, count)
    firstHeading = false

    return `<h${level} id="${id}">${content}</h${level}>`
  })

  html = html.replace(/href="([^"]+)"/g, (_match, href) => (
    `href="${escapeHtml(resolveLink(href, sourcePath, sourceId))}"`
  ))
  html = html.replace(/src="([^"]+)"/g, (_match, source) => {
    if (/^(data:|https?:|file:)/.test(source)) {
      return `src="${escapeHtml(source)}"`
    }

    return `src="${escapeHtml(pathToFileURL(resolve(dirname(sourcePath), decodeURIComponent(source))).href)}"`
  })

  return html
}

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')

await mkdir(outputDirectory, { recursive: true })
await stat(coverImagePath)

const sources = []

for (const sourcePath of sourcePaths) {
  const markdown = await readFile(sourcePath, 'utf8')
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]

  if (!title) {
    throw new Error(`Titre principal manquant dans ${sourcePath}`)
  }

  const name = basename(sourcePath)
  const id = sourceIdByName.get(name)
  const rendered = await marked.parse(markdown, { gfm: true })
  sources.push({
    html: rewriteRenderedHtml(rendered, sourcePath, id),
    id,
    markdown,
    name,
    sourcePath,
    title,
  })
}

const tableOfContents = sources.map((source, index) => (
  `<li><span>${String(index + 1).padStart(2, '0')}</span><a href="#${source.id}">${escapeHtml(source.title)}</a></li>`
)).join('\n')
const chapters = sources.map((source) => (
  `<section class="chapter" data-source="${escapeHtml(source.name)}">${source.html}</section>`
)).join('\n')
const coverImageUrl = pathToFileURL(coverImagePath).href
const generatedAt = new Date().toISOString()
const stylesheet = `
  :root {
    --ink: #173336;
    --muted: #526867;
    --paper: #ffffff;
    --soft: #eef3ef;
    --line: #c9d7cf;
    --green: #6fa83b;
    --green-dark: #35631d;
    --coral: #c94e47;
    --blue: #2d6780;
  }
  * { box-sizing: border-box; }
  @page { size: A4; margin: 18mm 15mm 20mm; }
  html { font-family: Arial, Helvetica, sans-serif; color: var(--ink); font-size: 10pt; line-height: 1.48; }
  body { margin: 0; background: var(--paper); }
  .cover {
    break-after: page;
    height: 259mm;
    margin: -18mm -15mm -20mm;
    padding: 24mm 20mm;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    color: white;
    background-image: linear-gradient(rgba(12, 42, 44, .28), rgba(12, 42, 44, .94)), url('${coverImageUrl}');
    background-position: center;
    background-size: cover;
  }
  .cover__label { width: fit-content; padding: 2.5mm 4mm; background: var(--green); color: #102b20; font-weight: 700; font-size: 10pt; }
  .cover h1 { margin: 8mm 0 3mm; max-width: 160mm; font-size: 34pt; line-height: 1.05; letter-spacing: 0; color: white; }
  .cover p { margin: 0; max-width: 150mm; font-size: 15pt; color: #edf5ef; }
  .cover__meta { margin-top: 16mm; padding-top: 7mm; border-top: 1px solid rgba(255,255,255,.45); display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 10mm; font-size: 10pt; }
  .toc { break-after: page; }
  .toc h1 { border: 0; }
  .toc ol { list-style: none; padding: 0; columns: 2; column-gap: 12mm; }
  .toc li { break-inside: avoid; display: flex; gap: 3mm; margin: 0 0 3.5mm; border-bottom: 1px solid var(--line); padding-bottom: 2mm; }
  .toc li span { color: var(--green-dark); font-weight: 700; }
  .toc a { color: var(--ink); text-decoration: none; }
  .chapter { break-before: page; }
  .chapter > h1:first-child { margin-top: 0; }
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a1-"],
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a2-"],
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a3-"],
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a4-"],
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a5-"],
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a6-"],
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a7-"],
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a8-"],
  .chapter[data-source="18_ANNEXES_VISUELLES_BC02.md"] h2[id*="-a9-"] { break-before: page; }
  h1, h2, h3 { break-after: avoid; color: var(--ink); letter-spacing: 0; }
  h1 { margin: 8mm 0 6mm; padding-bottom: 3mm; border-bottom: 3px solid var(--green); font-size: 22pt; line-height: 1.12; }
  h2 { margin: 8mm 0 3mm; font-size: 15pt; line-height: 1.2; color: var(--green-dark); }
  h3 { margin: 6mm 0 2mm; font-size: 11.5pt; line-height: 1.25; color: var(--blue); }
  p { margin: 0 0 2.4mm; orphans: 3; widows: 3; }
  ul, ol { margin: 0 0 3.2mm; padding-left: 6mm; }
  li { margin-bottom: 1mm; }
  a { color: var(--blue); text-decoration-thickness: .2mm; text-underline-offset: .5mm; }
  table { width: 100%; margin: 3.5mm 0 5mm; border-collapse: collapse; table-layout: auto; font-size: 8.2pt; }
  thead { display: table-header-group; }
  tr { break-inside: avoid; }
  th { padding: 2.2mm; background: var(--ink); color: white; text-align: left; vertical-align: top; }
  td { padding: 2.1mm; border: 1px solid var(--line); vertical-align: top; overflow-wrap: anywhere; }
  th:last-child, td:last-child { min-width: 19mm; overflow-wrap: normal; word-break: normal; }
  tbody tr:nth-child(even) { background: var(--soft); }
  code { padding: .25mm 1mm; border-radius: 1mm; background: #e6ece8; font-family: 'Liberation Mono', monospace; font-size: .9em; overflow-wrap: anywhere; }
  pre { margin: 4mm 0 5mm; padding: 4mm; break-inside: avoid; border-left: 1.2mm solid var(--green); background: #142f32; color: #f3f7f4; white-space: pre-wrap; overflow-wrap: anywhere; font-size: 8.2pt; line-height: 1.4; }
  pre code { padding: 0; background: transparent; color: inherit; }
  blockquote { margin: 4mm 0; padding: 3mm 5mm; border-left: 1.2mm solid var(--coral); background: #f8ecea; }
  img { display: block; max-width: 100%; max-height: 170mm; margin: 5mm auto 8mm; object-fit: contain; break-inside: avoid; border: .3mm solid var(--line); }
  hr { margin: 8mm 0; border: 0; border-top: .3mm solid var(--line); }
  .document-note { padding: 4mm; background: var(--soft); border-left: 1.2mm solid var(--blue); }
`
const documentHtml = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dossier BC02 Spity - Dorian Joly</title>
  <style>${stylesheet}</style>
</head>
<body>
  <main>
    <section class="cover">
      <span class="cover__label">RNCP39583 · BLOC 2</span>
      <h1>Concevoir et développer des applications logicielles</h1>
      <p>Spity · Prototype web pour la communauté escalade</p>
      <div class="cover__meta">
        <strong>Candidat</strong><span>Dorian Joly</span>
        <strong>Version</strong><span>Spity 0.1.0</span>
        <strong>Livrable</strong><span>Dossier BC02 avec annexes</span>
        <strong>Date</strong><span>23 juillet 2026</span>
      </div>
    </section>
    <section class="toc">
      <h1>Sommaire du dossier</h1>
      <p class="document-note">Cette version destinée au jury met en avant mes quatre compétences déterminantes, puis conserve mon retour d'expérience, les 26 critères officiels et neuf annexes visuelles. Les documents techniques complémentaires restent accessibles par les liens du dossier et dans <code>docs/bc02/</code>.</p>
      <ol>${tableOfContents}</ol>
    </section>
    ${chapters}
  </main>
</body>
</html>`
const documentIds = new Set([...documentHtml.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]))
const internalLinks = [...documentHtml.matchAll(/ href="#([^"]+)"/g)].map((match) => match[1])
const missingTargets = [...new Set(internalLinks.filter((target) => !documentIds.has(target)))]

if (missingTargets.length > 0) {
  throw new Error(`Ancres internes manquantes : ${missingTargets.join(', ')}`)
}

await writeFile(htmlPath, documentHtml)

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome',
  headless: true,
  args: ['--allow-file-access-from-files', '--disable-dev-shm-usage', '--no-sandbox'],
})

try {
  const page = await browser.newPage()
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })
  await page.emulateMediaType('print')
  await page.evaluate(async () => {
    await document.fonts.ready
    const brokenImages = Array.from(document.images).filter((image) => !image.complete || image.naturalWidth === 0)

    if (brokenImages.length > 0) {
      throw new Error(`Images non chargées: ${brokenImages.map((image) => image.src).join(', ')}`)
    }
  })
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="width:100%;padding:0 15mm;font:8px Arial;color:#526867"><span>Spity · Dossier BC02 · RNCP39583</span></div>',
    footerTemplate: '<div style="width:100%;padding:0 15mm;font:8px Arial;color:#526867;text-align:right"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
    margin: { top: '18mm', right: '15mm', bottom: '20mm', left: '15mm' },
  })
} finally {
  await browser.close()
}

const htmlBuffer = await readFile(htmlPath)
const pdfBuffer = await readFile(pdfPath)
const manifest = {
  generatedAt,
  internalNavigation: {
    anchors: documentIds.size,
    links: internalLinks.length,
    missingTargets: 0,
  },
  outputs: {
    html: { file: basename(htmlPath), bytes: htmlBuffer.length, sha256: sha256(htmlBuffer) },
    pdf: { file: basename(pdfPath), bytes: pdfBuffer.length, sha256: sha256(pdfBuffer) },
  },
  sources: sources.map((source) => ({
    file: source.name,
    sha256: sha256(Buffer.from(source.markdown)),
  })),
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
process.stdout.write(`${JSON.stringify({
  html: manifest.outputs.html,
  pdf: manifest.outputs.pdf,
  sourceCount: manifest.sources.length,
})}\n`)
