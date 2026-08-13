import { execFileSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditIncidentRegistry, loadIncidentPolicy, loadIncidentRecords } from './check-incident-registry.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const applicationRoot = resolve(scriptDirectory, '..')
const repositoryRoot = resolve(applicationRoot, '..')
const outputPath = resolve(
  process.env.BLOC4_INCIDENT_EXERCISE_OUTPUT
    ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C421-04-exercice-registre-2026-08-13.json')
)

const clone = (value) => JSON.parse(JSON.stringify(value))
const policy = await loadIncidentPolicy()
const canonical = (await loadIncidentRecords()).records.map(({ record }) => record)
const valid = await auditIncidentRegistry({ policy, records: canonical })

const invalidTransitionRecords = clone(canonical)
invalidTransitionRecords[1].history[1].to = 'closed'
const invalidTransition = await auditIncidentRegistry({ policy, records: invalidTransitionRecords })

const sensitiveDataRecords = clone(canonical)
sensitiveDataRecords[0].reproduction.observed = 'Authorization: Bearer example-token-which-must-never-be-stored'
const sensitiveData = await auditIncidentRegistry({ policy, records: sensitiveDataRecords })

const passed = valid.compliant
  && invalidTransition.errors.some((entry) => entry.code === 'invalid-transition')
  && sensitiveData.errors.some((entry) => entry.code === 'sensitive-data')

const evidence = {
  schemaVersion: 1,
  type: 'controlled-incident-registry-exercise',
  criterion: 'C4.2.1',
  executedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  safety: 'In-memory records only. No production endpoint, database, external issue or LXC was used.',
  objective: 'Verify valid incident records, forbid an illegal lifecycle transition, and reject a simulated bearer token before any record can be accepted.',
  result: passed ? 'passed' : 'failed',
  validRegistry: { compliant: valid.compliant, recordCount: valid.recordCount, statusCounts: valid.statusCounts },
  invalidTransition: { compliant: invalidTransition.compliant, errors: invalidTransition.errors },
  sensitiveData: { compliant: sensitiveData.compliant, errors: sensitiveData.errors },
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8')
console.info(JSON.stringify(evidence, null, 2))

if (!passed) {
  process.exitCode = 1
}
