import assert from 'node:assert/strict'
import { test } from 'node:test'
import { get } from 'node:http'
import { completion, createDemo, escapeHtml, memberProjection, stats } from './model.mjs'
import { prefix, startPreview } from './preview.mjs'

test('fixtures are independent and all counters derive from visible demo data', () => {
  const first = createDemo()
  const second = createDemo()
  first.posts.pop()
  first.equipment[0].shared = false
  assert.deepEqual(stats(first), { posts: 2, disciplines: 3, shared: 2 })
  assert.deepEqual(stats(second), { posts: 3, disciplines: 3, shared: 3 })
  first.equipment[1].quantity = 12
  assert.equal(stats(first).shared, 2, 'Counts references, not units within a reference')
})
test('member projection allowlists fields and does not include email or personal inventory', () => {
  const owner = createDemo()
  const member = memberProjection(owner)
  assert.deepEqual(Object.keys(member).sort(), ['displayName', 'avatar', 'location', 'bio', 'joined', 'disciplines', 'grades', 'environment', 'availability', 'partner', 'goals', 'equipment', 'posts'].sort())
  assert.equal('email' in member, false)
  assert.equal(member.equipment.length, 3)
  for (const item of member.equipment) {
    assert.equal('notes' in item, false)
    assert.equal('shared' in item, false)
    assert.ok(!['gear-4', 'gear-5'].includes(item.id))
  }
  assert.doesNotMatch(JSON.stringify(member), /example\.test|facture|ressemelage|Instinct|Momentum/)
  owner.equipment[0].shared = false
  assert.equal(memberProjection(owner).equipment.length, 2)
})
test('completion reflects missing fields, not onboarding or partner search status', () => {
  const owner = createDemo()
  assert.equal(completion(owner).count, 5)
  assert.equal(completion(owner).percent, 83)
  owner.avatar = 'blob:demo'
  assert.equal(completion(owner).percent, 100)
  owner.partner.enabled = false
  assert.equal(completion(owner).percent, 100)
  delete owner.grades.voie
  assert.equal(completion(owner).count, 5)
  assert.equal(completion(createDemo(true)).percent, 0)
  assert.deepEqual(stats(createDemo(true)), { posts: 0, disciplines: 0, shared: 0 })
})
test('user-provided text is escaped for HTML text and attribute contexts', () => {
  assert.equal(escapeHtml('<img src=x onerror="bad()">&\''), '&lt;img src=x onerror=&quot;bad()&quot;&gt;&amp;&#39;')
  assert.equal(escapeHtml(null), '')
  assert.equal(escapeHtml('Camille'), 'Camille')
})
test('preview serves only allowlisted local assets and never accepts writes', async () => {
  const server = await startPreview(0)
  const root = `http://127.0.0.1:${server.address().port}`
  try {
    const response = await fetch(`${root}${prefix}index.html`)
    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow')
    assert.match(response.headers.get('content-security-policy'), /connect-src 'none'/)
    assert.match(response.headers.get('content-security-policy'), /form-action 'none'/)
    const html = await response.text()
    assert.match(html, /<html lang="fr">/)
    assert.match(html, /noindex, nofollow/)
    assert.equal((await fetch(`${root}${prefix}fonts.css`)).status, 200)
    assert.equal((await fetch(`${root}${prefix}index.html`, { method: 'HEAD' })).status, 200)
    for (const path of ['/api/profile/me', '/api/admin', '/.env.production', '/package.json', `${prefix}README.md`, `${prefix}preview.mjs`, `${prefix}..%2f..%2f..%2f.env.production`]) {
      assert.equal((await fetch(`${root}${path}`)).status, 404, path)
    }
    for (const method of ['POST', 'PATCH', 'DELETE', 'PUT']) {
      assert.equal((await fetch(`${root}${prefix}index.html`, { method })).status, 405)
    }
    const untrustedStatus = await new Promise((resolve, reject) => {
      get(`${root}${prefix}index.html`, { headers: { Host: 'untrusted.example' } }, (response) => { response.resume(); resolve(response.statusCode) }).on('error', reject)
    })
    assert.equal(untrustedStatus, 403)
  } finally { await new Promise((resolve) => server.close(resolve)) }
})
