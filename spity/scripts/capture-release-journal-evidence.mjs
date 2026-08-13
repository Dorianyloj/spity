import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditReleaseJournal, loadReleaseJournalPolicy, loadReleaseJournalRecords, writeReleaseJournalReport } from './check-release-journal.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = process.env.RELEASE_JOURNAL_EVIDENCE_PATH
  ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C432-02-registre-versions-2026-08-13.json')

const policy = await loadReleaseJournalPolicy()
const loaded = await loadReleaseJournalRecords()
const audit = await auditReleaseJournal({ policy, records: loaded.records.map(({ record }) => record) })
audit.errors.unshift(...loaded.errors)
audit.compliant = audit.errors.length === 0

const evidence = {
  schemaVersion: 1,
  criterion: 'C4.3.2',
  capturedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  safety: 'Repository-only validation. No production endpoint, deployment, database, external release mutation or LXC was used.',
  objective: 'Verify that published, observed-production and candidate versions remain distinct and that deployed corrections are documented.',
  journal: audit,
}

await writeReleaseJournalReport(outputPath, evidence)
console.info(JSON.stringify(evidence, null, 2))
if (!evidence.journal.compliant) {
  process.exitCode = 1
}
