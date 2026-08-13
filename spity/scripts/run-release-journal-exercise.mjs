import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditReleaseJournal, loadReleaseJournalPolicy, loadReleaseJournalRecords, writeReleaseJournalReport } from './check-release-journal.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = process.env.RELEASE_JOURNAL_EXERCISE_PATH
  ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C432-03-exercice-journal-versions-2026-08-13.json')
const clone = (value) => JSON.parse(JSON.stringify(value))

const policy = await loadReleaseJournalPolicy()
const canonicalRecords = (await loadReleaseJournalRecords()).records.map(({ record }) => record)
const canonical = await auditReleaseJournal({ policy, records: canonicalRecords })

const wronglyDeployedCandidate = clone(canonicalRecords)
const candidate = wronglyDeployedCandidate.find((record) => record.id === 'SPITY-REL-2026-0003')
candidate.status = 'observed-production'
candidate.history.push({
  at: '2026-08-13T10:00:00.000Z',
  to: 'observed-production',
  actorRole: 'exercise',
  reason: 'Tentative volontairement erronée de confondre CI et production.',
})
const candidateReport = await auditReleaseJournal({ policy, records: wronglyDeployedCandidate })

const undocumentedCorrection = clone(canonicalRecords)
const observed = undocumentedCorrection.find((record) => record.id === 'SPITY-REL-2026-0002')
observed.changes.corrections[0].documentation = []
const documentationReport = await auditReleaseJournal({ policy, records: undocumentedCorrection })

const mismatchedHealth = clone(canonicalRecords)
const mismatchedObserved = mismatchedHealth.find((record) => record.id === 'SPITY-REL-2026-0002')
mismatchedObserved.deployment.health.revision = 'a'.repeat(40)
const healthReport = await auditReleaseJournal({ policy, records: mismatchedHealth })

const missingReleaseEntry = await auditReleaseJournal({ policy, records: canonicalRecords, expectedReleaseVersion: '0.1.1' })

const passed = canonical.compliant
  && !candidateReport.compliant
  && candidateReport.errors.some((entry) => entry.code === 'missing-deployment')
  && !documentationReport.compliant
  && documentationReport.errors.some((entry) => entry.code === 'missing-correction-documentation')
  && !healthReport.compliant
  && healthReport.errors.some((entry) => entry.code === 'health-revision-mismatch')
  && !missingReleaseEntry.compliant
  && missingReleaseEntry.errors.some((entry) => entry.code === 'missing-release-entry')

const evidence = {
  schemaVersion: 1,
  criterion: 'C4.3.2',
  executedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  safety: 'In-memory exercise only. No production endpoint, deployment, database, external release mutation or LXC was used.',
  objective: 'Accept the canonical journal, reject a CI-only candidate declared as deployed, reject an undocumented deployed correction, reject a health revision mismatch and require a record for a tagged version.',
  result: passed ? 'passed' : 'failed',
  cases: {
    canonical: { compliant: canonical.compliant, deployedRecordCount: canonical.deployedRecordCount },
    candidateDeclaredDeployed: { compliant: candidateReport.compliant, errorCodes: candidateReport.errors.map((entry) => entry.code) },
    undocumentedCorrection: { compliant: documentationReport.compliant, errorCodes: documentationReport.errors.map((entry) => entry.code) },
    mismatchedHealth: { compliant: healthReport.compliant, errorCodes: healthReport.errors.map((entry) => entry.code) },
    missingReleaseEntry: { compliant: missingReleaseEntry.compliant, errorCodes: missingReleaseEntry.errors.map((entry) => entry.code) },
  },
}

await writeReleaseJournalReport(outputPath, evidence)
console.info(JSON.stringify(evidence, null, 2))
if (!passed) {
  process.exitCode = 1
}
