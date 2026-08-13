import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditSupportCollaborations, loadSupportCollaborationPolicy, loadSupportCollaborationRecords, writeSupportCollaborationReport } from './check-support-collaborations.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = process.env.SUPPORT_COLLABORATION_EVIDENCE_PATH
  ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C433-02-registre-collaboration-support-2026-08-13.json')

const policy = await loadSupportCollaborationPolicy()
const loaded = await loadSupportCollaborationRecords()
const audit = await auditSupportCollaborations({ policy, records: loaded.records.map(({ record }) => record) })
audit.errors.unshift(...loaded.errors)
audit.compliant = audit.errors.length === 0

const evidence = {
  schemaVersion: 1,
  criterion: 'C4.3.3',
  capturedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  safety: 'Repository-only validation. The support case is a declared controlled simulation. No production endpoint, deployment, database, external support mutation or LXC was used.',
  objective: 'Verify an attributable support-to-maintainer collaboration, the reciprocal technical feedback, the controlled simulation disclosure, privacy review and non-deployment disclosure.',
  collaboration: audit,
}

await writeSupportCollaborationReport(outputPath, evidence)
console.info(JSON.stringify(evidence, null, 2))
if (!evidence.collaboration.compliant) process.exitCode = 1
