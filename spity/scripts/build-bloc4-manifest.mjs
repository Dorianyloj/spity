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
  resolve(repositoryRoot, 'README.md'),
  resolve(repositoryRoot, 'JURY.md'),
  resolve(repositoryRoot, 'docs/README.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/DOSSIER_BLOC_04.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/PLAN_ACTION_BLOC_04.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/REVUE_FINALE_BLOC_04.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/dossier-jury/README.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/dossier-jury/01_CADRAGE_PROJET.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/dossier-jury/02_C4_1_MAINTENANCE_ET_SUPERVISION.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/dossier-jury/03_C4_2_ANOMALIES_ET_CORRECTIFS.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/dossier-jury/04_C4_3_EVOLUTION_RELEASE_SUPPORT.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/dossier-jury/05_PREUVES_REPRODUCTIBILITE_ET_ENTRETIEN.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/dossier-jury/annexes/GLOSSAIRE.md'),
  resolve(repositoryRoot, 'docs/rncp/bloc-04/dossier-jury/annexes/MATRICE_DE_PREUVES.md'),
  resolve(repositoryRoot, 'docs/rncp/referentiel/2024-referentiel-expert-developpement-logiciel-ynov.pdf'),
  resolve(repositoryRoot, 'spity/MAINTENANCE.md'),
  resolve(repositoryRoot, 'spity/INCIDENT_MANAGEMENT.md'),
  resolve(repositoryRoot, 'spity/IMPROVEMENT_MANAGEMENT.md'),
  resolve(repositoryRoot, 'spity/RELEASE_JOURNAL.md'),
  resolve(repositoryRoot, 'spity/RELEASE_VERIFICATION.md'),
  resolve(repositoryRoot, 'spity/OBSERVABILITY.md'),
  resolve(repositoryRoot, 'spity/SUPPORT.md'),
  resolve(repositoryRoot, 'spity/incident-policy.json'),
  resolve(repositoryRoot, 'spity/incident-schema.json'),
  resolve(repositoryRoot, 'spity/improvement-policy.json'),
  resolve(repositoryRoot, 'spity/improvement-schema.json'),
  resolve(repositoryRoot, 'spity/release-journal-policy.json'),
  resolve(repositoryRoot, 'spity/release-journal-schema.json'),
  resolve(repositoryRoot, 'spity/support-collaboration-policy.json'),
  resolve(repositoryRoot, 'spity/support-collaboration-schema.json'),
  resolve(repositoryRoot, 'spity/bloc4-audit-policy.json'),
  resolve(repositoryRoot, 'spity/incidents/SPITY-INC-2026-0001.json'),
  resolve(repositoryRoot, 'spity/incidents/SPITY-INC-2026-0002.json'),
  resolve(repositoryRoot, 'spity/improvements/SPITY-IMP-2026-0001.json'),
  resolve(repositoryRoot, 'spity/improvements/SPITY-IMP-2026-0002.json'),
  resolve(repositoryRoot, 'spity/improvements/SPITY-IMP-2026-0003.json'),
  resolve(repositoryRoot, 'spity/improvements/SPITY-IMP-2026-0004.json'),
  resolve(repositoryRoot, 'spity/release-journal/SPITY-REL-2026-0001.json'),
  resolve(repositoryRoot, 'spity/release-journal/SPITY-REL-2026-0002.json'),
  resolve(repositoryRoot, 'spity/release-journal/SPITY-REL-2026-0003.json'),
  resolve(repositoryRoot, 'spity/support-collaborations/SPITY-SUP-2026-0001.json'),
  resolve(repositoryRoot, 'spity/monitoring-policy.json'),
  resolve(repositoryRoot, 'spity/dependency-policy.json'),
  resolve(repositoryRoot, 'spity/scripts/capture-incident-registry-evidence.mjs'),
  resolve(repositoryRoot, 'spity/scripts/capture-improvement-backlog-evidence.mjs'),
  resolve(repositoryRoot, 'spity/scripts/capture-release-journal-evidence.mjs'),
  resolve(repositoryRoot, 'spity/scripts/capture-support-collaboration-evidence.mjs'),
  resolve(repositoryRoot, 'spity/scripts/capture-bloc4-completeness-evidence.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-improvement-backlog.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-release-journal.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-support-collaborations.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-bloc4-completeness.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-incident-registry.mjs'),
  resolve(repositoryRoot, 'spity/scripts/capture-monitoring-slo.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-health.mjs'),
  resolve(repositoryRoot, 'spity/scripts/check-dependency-policy.mjs'),
  resolve(repositoryRoot, 'spity/scripts/evaluate-monitoring-window.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-incident-registry-exercise.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-improvement-review-exercise.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-release-journal-exercise.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-support-collaboration-exercise.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-deployment-verification-exercise.mjs'),
  resolve(repositoryRoot, 'spity/scripts/run-production-monitor.mjs'),
  resolve(repositoryRoot, 'spity/scripts/verify-deployment.mjs'),
  resolve(repositoryRoot, 'spity/tests/maintenance/check-health.test.mjs'),
  resolve(repositoryRoot, 'spity/tests/maintenance/verify-deployment.test.mjs'),
  resolve(repositoryRoot, 'spity/tests/maintenance/improvement-backlog.test.mjs'),
  resolve(repositoryRoot, 'spity/tests/maintenance/release-journal.test.mjs'),
  resolve(repositoryRoot, 'spity/tests/maintenance/support-collaboration.test.mjs'),
  resolve(repositoryRoot, 'spity/tests/maintenance/bloc4-completeness.test.mjs'),
  resolve(repositoryRoot, '.github/workflows/incident-registry.yml'),
  resolve(repositoryRoot, '.github/workflows/improvement-review.yml'),
  resolve(repositoryRoot, '.github/workflows/release-journal.yml'),
  resolve(repositoryRoot, '.github/workflows/support-collaboration.yml'),
  resolve(repositoryRoot, '.github/ISSUE_TEMPLATE/support-client.yml'),
  resolve(repositoryRoot, '.github/workflows/availability-slo-report.yml'),
  resolve(repositoryRoot, '.github/workflows/dependency-maintenance.yml'),
  resolve(repositoryRoot, '.github/workflows/dependency-review.yml'),
  resolve(repositoryRoot, '.github/workflows/production-monitoring.yml'),
  resolve(repositoryRoot, '.github/workflows/ci.yml'),
  resolve(repositoryRoot, '.github/workflows/release.yml'),
  resolve(repositoryRoot, 'output/README.md'),
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
