import assert from 'node:assert/strict'
import test from 'node:test'

import { evaluateDependencyPolicy } from '../../scripts/check-dependency-policy.mjs'

const audit = (vulnerabilities) => ({
  vulnerabilities,
  metadata: {
    vulnerabilities: {
      info: 0,
      low: 0,
      moderate: 0,
      high: 0,
      critical: 0,
      total: Object.keys(vulnerabilities).length,
    },
  },
})

const policy = {
  schemaVersion: 1,
  versionPins: [{
    package: 'pinned-tool',
    version: '1.2.3',
    owner: 'maintenance',
    expiresOn: '2026-12-31',
    reason: 'régression amont qualifiée',
  }],
  production: { blockAtOrAbove: 'high' },
  development: {
    blockAtOrAbove: 'moderate',
    maximumExceptionSeverity: 'moderate',
    exceptions: [{
      packages: ['known-tool'],
      advisory: 'GHSA-test-test-test',
      owner: 'maintenance',
      expiresOn: '2026-12-31',
      reason: 'outil local non exposé',
    }],
  },
}

test('accepte une alerte de développement modérée, documentée et non expirée', () => {
  const result = evaluateDependencyPolicy({
    policy,
    productionAudit: audit({}),
    completeAudit: audit({ 'known-tool': { severity: 'moderate', isDirect: true } }),
    now: new Date('2026-08-13T12:00:00Z'),
  })

  assert.equal(result.compliant, true)
  assert.deepEqual(result.exceptionsUsed[0].usedBy, ['known-tool'])
})

test('refuse une vulnérabilité de production haute', () => {
  const vulnerability = { severity: 'high', isDirect: false }
  const result = evaluateDependencyPolicy({
    policy,
    productionAudit: audit({ runtime: vulnerability }),
    completeAudit: audit({ runtime: vulnerability }),
    now: new Date('2026-08-13T12:00:00Z'),
  })

  assert.equal(result.compliant, false)
  assert.equal(result.productionViolations[0].name, 'runtime')
})

test('refuse une alerte de développement modérée non qualifiée', () => {
  const result = evaluateDependencyPolicy({
    policy,
    productionAudit: audit({}),
    completeAudit: audit({ surprise: { severity: 'moderate', isDirect: false } }),
    now: new Date('2026-08-13T12:00:00Z'),
  })

  assert.equal(result.compliant, false)
  assert.equal(result.developmentViolations[0].name, 'surprise')
})

test('refuse une exception expirée et une sévérité supérieure au maximum dérogeable', () => {
  const expired = evaluateDependencyPolicy({
    policy,
    productionAudit: audit({}),
    completeAudit: audit({ 'known-tool': { severity: 'moderate', isDirect: true } }),
    now: new Date('2027-01-01T00:00:00Z'),
  })
  const severe = evaluateDependencyPolicy({
    policy,
    productionAudit: audit({}),
    completeAudit: audit({ 'known-tool': { severity: 'high', isDirect: true } }),
    now: new Date('2026-08-13T12:00:00Z'),
  })

  assert.match(expired.developmentViolations[0].reason, /expirée/)
  assert.match(severe.developmentViolations[0].reason, /supérieure/)
})

test('refuse une version verrouillée expirée ou différente du lockfile', () => {
  const expired = evaluateDependencyPolicy({
    policy,
    productionAudit: audit({}),
    completeAudit: audit({}),
    installedVersions: { 'pinned-tool': '1.2.3' },
    now: new Date('2027-01-01T00:00:00Z'),
  })
  const mismatched = evaluateDependencyPolicy({
    policy,
    productionAudit: audit({}),
    completeAudit: audit({}),
    installedVersions: { 'pinned-tool': '1.2.4' },
    now: new Date('2026-08-13T12:00:00Z'),
  })

  assert.equal(expired.compliant, false)
  assert.equal(expired.expiredVersionPins[0].package, 'pinned-tool')
  assert.equal(mismatched.compliant, false)
  assert.equal(mismatched.mismatchedVersionPins[0].installedVersion, '1.2.4')
})
