import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const evidenceDirectory = resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves')
const manifestPath = resolve(evidenceDirectory, 'MANIFEST.sha256')

const evidenceFiles = (await readdir(evidenceDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name !== 'MANIFEST.sha256')
  .map((entry) => resolve(evidenceDirectory, entry.name))

const files = [
  ...evidenceFiles,
  resolve(repositoryRoot, 'docs/rncp/bloc-04/DOSSIER_BLOC_04.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/PLAN_ACTION_BLOC_04.md'),
  resolve(repositoryRoot, 'docs/rncp/referentiel/2024-referentiel-expert-developpement-logiciel-ynov.pdf'),
  resolve(repositoryRoot, 'spity/MAINTENANCE.md'),
  resolve(repositoryRoot, 'spity/OBSERVABILITY.md'),
  resolve(repositoryRoot, 'spity/SUPPORT.md'),
  resolve(repositoryRoot, 'output/pdf/dossier-bloc-04-spity.pdf'),
].sort((left, right) => left.localeCompare(right, 'fr'))

const lines = []

for (const file of files) {
  const content = await readFile(file)
  const hash = createHash('sha256').update(content).digest('hex')
  const path = relative(repositoryRoot, file).replaceAll('\\', '/')
  lines.push(`${hash}  ${path}`)
}

await writeFile(manifestPath, `${lines.join('\n')}\n`, 'utf8')
console.info(`Manifeste créé : ${manifestPath} (${lines.length} fichiers)`)
