import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateDashboard, comparison, demoInteractions, getWindow } from './dashboard.mjs'

const empty = { accounts: [], posts: [], interactions: [], history: [] }
test('les périodes utilisent des jours UTC entiers et des bornes exclusives', () => {
  for (const days of [7, 30, 90]) {
    const { start, end, previousStart } = getWindow(days)
    assert.equal(end - start, days * 86_400_000)
    assert.equal(start - previousStart, days * 86_400_000)
    assert.equal(new Date(end).toISOString(), '2026-09-10T00:00:00.000Z')
  }
  assert.throws(() => getWindow(0), RangeError)
  assert.throws(() => getWindow(365), RangeError)
})
test('les inscriptions aux bornes ne sont ni perdues ni comptées deux fois', () => {
  const model = calculateDashboard({ ...empty, accounts: ['2026-07-11', '2026-07-12', '2026-08-10', '2026-08-11', '2026-09-09', '2026-09-10'].map((createdAt) => ({ createdAt, role: 'Grimpeur' })) })
  assert.equal(model.current.accounts, 2)
  assert.equal(model.previous.accounts, 2)
  assert.equal(model.buckets.reduce((sum, bucket) => sum + bucket.accounts, 0), 2)
})
test('les contributeurs sont distincts, y compris pour les contenus masqués', () => {
  const model = calculateDashboard({ ...empty, posts: [
    { authorId: 'a', publishedAt: '2026-09-01', hidden: true },
    { authorId: 'a', publishedAt: '2026-09-09', hidden: false },
    { authorId: 'b', publishedAt: '2026-08-30', hidden: false },
    { authorId: 'c', publishedAt: '2026-07-31', hidden: false },
  ] })
  assert.equal(model.current.posts, 3)
  assert.equal(model.current.contributors, 2)
  assert.equal(model.previous.contributors, 1)
  assert.equal(model.totals.hidden, 1)
})
test('les interactions utilisent leur date, pas la date de publication', () => {
  for (const [days, expected] of [[7, 50], [30, 118], [90, 118]]) {
    const model = calculateDashboard({ ...empty, interactions: demoInteractions, days })
    assert.equal(model.current.interactions, expected)
    assert.equal(model.current.likes + model.current.comments, expected)
    assert.equal(model.buckets.reduce((sum, bucket) => sum + bucket.interactions, 0), expected)
    assert.equal(model.buckets[0].start, model.start)
    assert.equal(model.buckets.at(-1).end, model.end)
  }
})
test('les stocks de modération ne dépendent pas de la période, contrairement aux actions', () => {
  const data = { ...empty, accounts: [{ role: 'Grimpeur', admin: true, suspended: false }, { role: 'Club', suspended: true }], posts: [{ hidden: true }], history: [{ occurredAt: '2026-09-09' }, { occurredAt: '2026-08-12' }] }
  for (const days of [7, 30]) {
    const model = calculateDashboard({ ...data, days })
    assert.equal(model.totals.accounts, 2)
    assert.equal(model.totals.climbers + model.totals.clubs, 2)
    assert.equal(model.totals.admins, 1)
    assert.equal(model.totals.suspended, 1)
    assert.equal(model.totals.hidden, 1)
    assert.equal(model.totals.actions, days === 7 ? 1 : 2)
  }
})
test('une période vide fournit des zéros, jamais de NaN ou de pourcentage infini', () => {
  const model = calculateDashboard(empty)
  assert.equal(model.current.interactions, 0)
  assert.equal(model.current.contributors, 0)
  assert.equal(model.buckets.length, 10)
  assert.equal(model.buckets.every((bucket) => bucket.posts === 0), true)
  assert.equal(comparison(0, 0), 'Aucune activité sur les deux périodes')
  assert.match(comparison(5, 0), /0 sur la période précédente/)
  assert.match(comparison(3, 1), /\+200 %/)
  assert.match(comparison(0, 2), /−100 %/)
  assert.match(comparison(2, 2), /Stable/)
})
