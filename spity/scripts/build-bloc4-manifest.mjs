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
  resolve(repositoryRoot, 'spity/INCIDENT_MANAGEMENT.md'),
  resolve(repositoryRoot, 'spity/RELEASE_VERIFICATION.md'),
  resolve(repositoryRoot, 'spity/OBSERVABILITY.md'),
  resolve(repositoryRoot, 'spity/SUPPORT.md'),
  resolve(repositoryRoot, 'spity/incident-policy.json'),
  resolve(repositoryRoot, 'spity/incident-schema.json'),
  resolve(repositoryRoot, 'spity/incidents/SPITY-INC-2026-0001.json'),
  resolve(repositoryRoot, 'spity/incidents/SPITY-INC-2026-0002.json'),
  resolve(repositoryRoot, 'spity/monitoring-policy.json'),
  resolve(repositoryRoot, 'spity/scripts/capture-incident-registry-evidence.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-incident-registry.mjs'),
  resolve(repositoryRoot, 'spity/scripts/capture-monitoring-slo.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-health.mjs'),
  resolve(repositoryRoot, 'spity/scripts/evaluate-monitoring-window.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-incident-registry-exercise.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-deployment-verification-exercise.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-production-monitor.mjs'),
  resolve(repositoryRoot, 'spity/scripts/verify-deployment.mjs'),
  resolve(repositoryRoot, 'spity/tests/maintenance/check-health.test.mjs'),
  resolve(repositoryRoot, 'spity/tests/maintenance/verify-deployment.test.mjs'),
  resolve(repositoryRoot, '.github/workflows/incident-registry.yml'),
  resolve(repositoryRoot, '.github/workflows/availability-slo-report.yml'),
  resolve(repositoryRoot, '.github/workflows/production-monitoring.yml'),
  resolve(repositoryRoot, '.github/workflows/ci.yml'),
  resolve(repositoryRoot, '.github/workflows/release.yml'),
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
