import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { auditSupportCollaborations, loadSupportCollaborationPolicy, loadSupportCollaborationRecords, writeSupportCollaborationReport } from './check-support-collaborations.mjs'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const repositoryRoot = resolve(scriptDirectory, '../..')
const outputPath = process.env.SUPPORT_COLLABORATION_EXERCISE_PATH
  ?? resolve(repositoryRoot, 'docs/rncp/bloc-04/preuves/B4-C433-03-exercice-collaboration-support-2026-08-13.json')
const clone = (value) => JSON.parse(JSON.stringify(value))

const policy = await loadSupportCollaborationPolicy()
const canonicalRecords = (await loadSupportCollaborationRecords()).records.map(({ record }) => record)
const canonical = await auditSupportCollaborations({ policy, records: canonicalRecords })

const undisclosedSimulation = clone(canonicalRecords)
undisclosedSimulation[0].simulation.disclosure = 'Cas de test.'
const undisclosedReport = await auditSupportCollaborations({ policy, records: undisclosedSimulation })

const missingTechnicalFeedback = clone(canonicalRecords)
missingTechnicalFeedback[0].handoffs = missingTechnicalFeedback[0].handoffs.filter((handoff) => handoff.fromRole !== 'maintainer-l2' || handoff.toRole !== 'support-l1')
const feedbackReport = await auditSupportCollaborations({ policy, records: missingTechnicalFeedback })

const unreviewedClosure = clone(canonicalRecords)
unreviewedClosure[0].resolution.supportValidation.status = 'pending'
const closureReport = await auditSupportCollaborations({ policy, records: unreviewedClosure })

const sensitiveScenario = clone(canonicalRecords)
sensitiveScenario[0].context.observed = 'Contact de démonstration : pilote@example.test'
const sensitiveReport = await auditSupportCollaborations({ policy, records: sensitiveScenario })

const passed = canonical.compliant
  && !undisclosedReport.compliant
  && undisclosedReport.errors.some((entry) => entry.code === 'missing-simulation-disclosure')
  && !feedbackReport.compliant
  && feedbackReport.errors.some((entry) => entry.code === 'missing-technical-feedback')
  && !closureReport.compliant
  && closureReport.errors.some((entry) => entry.code === 'missing-support-validation')
  && !sensitiveReport.compliant
  && sensitiveReport.errors.some((entry) => entry.code === 'sensitive-data')

const evidence = {
  schemaVersion: 1,
  criterion: 'C4.3.3',
  executedAt: new Date().toISOString(),
  repositoryRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repositoryRoot, encoding: 'utf8' }).trim(),
  safety: 'In-memory exercise only. No production endpoint, deployment, database, external support mutation or LXC was used.',
  objective: 'Accept the declared support collaboration and reject an undisclosed simulation, missing technical feedback, closure without support validation and an email in the scenario.',
  result: passed ? 'passed' : 'failed',
  cases: {
    canonical: { compliant: canonical.compliant, closedRecordCount: canonical.closedRecordCount },
    undisclosedSimulation: { compliant: undisclosedReport.compliant, errorCodes: undisclosedReport.errors.map((entry) => entry.code) },
    missingTechnicalFeedback: { compliant: feedbackReport.compliant, errorCodes: feedbackReport.errors.map((entry) => entry.code) },
    unreviewedClosure: { compliant: closureReport.compliant, errorCodes: closureReport.errors.map((entry) => entry.code) },
    sensitiveScenario: { compliant: sensitiveReport.compliant, errorCodes: sensitiveReport.errors.map((entry) => entry.code) },
  },
}

await writeSupportCollaborationReport(outputPath, evidence)
console.info(JSON.stringify(evidence, null, 2))
if (!passed) process.exitCode = 1
