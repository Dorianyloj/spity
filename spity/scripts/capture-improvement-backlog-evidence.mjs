import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditImprovementBacklog, loadImprovementPolicy, loadImprovementRecords, writeImprovementReport } from './check-improvement-backlog.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = process.env.IMPROVEMENT_EVIDENCE_OUTPUT_PATH
  ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C431-02-registre-ameliorations-2026-08-13.json')
const policy = await loadImprovementPolicy()
const loaded = await loadImprovementRecords()
const audit = await auditImprovementBacklog({ policy, records: loaded.records.map(({ record }) => record) })
audit.errors.unshift(...loaded.errors)
audit.compliant = audit.errors.length === 0

const evidence = {
  schemaVersion: 1,
  criterion: 'C4.3.1',
  capturedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  policy: {
    cadence: policy.review.cadence,
    scoreFormula: policy.scoring.formula,
    statuses: policy.statuses,
  },
  audit,
}

await writeImprovementReport(outputPath, evidence)
console.info(JSON.stringify(evidence, null, 2))
if (!audit.compliant) {
  process.exitCode = 1
}
