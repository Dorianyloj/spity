import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditBloc4Completeness, writeBloc4CompletenessReport } from './check-bloc4-completeness.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = process.env.BLOC4_COMPLETENESS_EVIDENCE_PATH
  ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-REVUE-FINALE-01-audit-transversal-2026-08-17.json')

const audit = await auditBloc4Completeness()
const evidence = {
  schemaVersion: 1,
  criterion: 'Bloc 4',
  capturedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  safety: 'Repository-only completeness review. No production endpoint, deployment, database, external mutation or LXC was used.',
  objective: 'Verify the seven competency claims, operational sources, evidence assertions, current registries and SHA-256 manifest together.',
  audit,
}

await writeBloc4CompletenessReport(outputPath, evidence)
console.info(JSON.stringify(evidence, null, 2))
if (!audit.compliant) process.exitCode = 1
