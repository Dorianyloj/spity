import assert from 'node:assert/strict'
import { test } from 'node:test'
import { auditBloc4Completeness, cloneBloc4AuditPolicy, loadBloc4AuditPolicy } from '../../scripts/check-bloc4-completeness.mjs'

const policy = await loadBloc4AuditPolicy()

test('accepts the complete and manifested Bloc 4 dossier', async () => {
  const report = await auditBloc4Completeness({ policy })
  assert.equal(report.compliant, true)
  assert.equal(report.competencyCount, 7)
  assert.equal(report.compliantCompetencyCount, 7)
  assert.equal(report.manifest.compliant, true)
})

test('rejects a competency whose mandatory operational source is missing', async () => {
  const invalidPolicy = cloneBloc4AuditPolicy(policy)
  invalidPolicy.competencies[0].operationalFiles.push('spity/missing-maintenance-source.md')
  const report = await auditBloc4Completeness({ policy: invalidPolicy })
  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'missing-required-file' && entry.competency === 'C4.1.1'))
})
