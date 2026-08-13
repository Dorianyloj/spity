import { mkdir, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditImprovementBacklog, loadImprovementPolicy, loadImprovementRecords } from './check-improvement-backlog.mjs'

const clone = (value) => JSON.parse(JSON.stringify(value))
const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = process.env.IMPROVEMENT_EXERCISE_OUTPUT_PATH
  ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C431-03-exercice-revue-ameliorations-2026-08-13.json')
const policy = await loadImprovementPolicy()
const canonical = (await loadImprovementRecords()).records.map(({ record }) => record)
const valid = await auditImprovementBacklog({ policy, records: canonical })
const invalidScore = clone(canonical)
invalidScore[0].scoring.score = 1
const scoreReport = await auditImprovementBacklog({ policy, records: invalidScore })
const sensitiveFeedback = clone(canonical)
sensitiveFeedback[2].feedbackInputs[0].summary = 'Contact test@example.com à ne jamais conserver.'
const privacyReport = await auditImprovementBacklog({ policy, records: sensitiveFeedback })
const passed = valid.compliant
  && !scoreReport.compliant
  && scoreReport.errors.some((entry) => entry.code === 'score-mismatch')
  && !privacyReport.compliant
  && privacyReport.errors.some((entry) => entry.code === 'sensitive-data')
const evidence = {
  schemaVersion: 1,
  criterion: 'C4.3.1',
  executedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  safety: 'In-memory review only. No user account, production endpoint, database, external issue or LXC was used.',
  objective: 'Verify a measurable prioritized improvement backlog, reject a formula mismatch, and reject personal data in a feedback source.',
  result: passed ? 'passed' : 'failed',
  valid,
  invalidScore: scoreReport,
  sensitiveFeedback: privacyReport,
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8')
console.info(JSON.stringify(evidence, null, 2))
if (!passed) {
  process.exitCode = 1
}
