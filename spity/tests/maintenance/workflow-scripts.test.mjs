import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import {
  auditGithubScriptSources,
  auditGithubScriptWorkflows,
} from '../../scripts/check-workflow-scripts.mjs'

test('accepts every actions/github-script block in the repository workflows', async () => {
  const report = await auditGithubScriptWorkflows()

  assert.equal(report.compliant, true)
  assert.ok(report.workflowCount >= 1)
  assert.ok(report.scriptCount >= 1)
})

test('rejects an invalid JavaScript template in a workflow alert step', async () => {
  const workflow = await readFile('../.github/workflows/production-monitoring.yml', 'utf8')
  const invalidWorkflow = workflow.replace(
    'selon spity/OBSERVABILITY.md.',
    'selon `spity/OBSERVABILITY.md`.',
  )
  const report = auditGithubScriptSources([{
    path: '.github/workflows/production-monitoring.yml',
    content: invalidWorkflow,
  }])

  assert.equal(report.compliant, false)
  assert.ok(report.errors.some((entry) => entry.code === 'invalid-github-script-syntax'))
})
