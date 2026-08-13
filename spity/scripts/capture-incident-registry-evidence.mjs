import { execFileSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditIncidentRegistry, loadIncidentPolicy } from './check-incident-registry.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const applicationRoot = resolve(scriptDirectory, '..')
const repositoryRoot = resolve(applicationRoot, '..')
const outputPath = resolve(
  process.env.BLOC4_INCIDENT_EVIDENCE_OUTPUT
    ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C421-03-registre-anomalies-2026-08-13.json')
)
const policy = await loadIncidentPolicy()
const audit = await auditIncidentRegistry({ policy })
const evidence = {
  schemaVersion: 1,
  criterion: 'C4.2.1',
  capturedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  policy: {
    schemaVersion: policy.schemaVersion,
    statuses: policy.statuses,
    closureRequirements: policy.closureRequirements,
  },
  audit,
}

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8')
console.info(JSON.stringify(evidence, null, 2))

if (!audit.compliant) {
  process.exitCode = 1
}
