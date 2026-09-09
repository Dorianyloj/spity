import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { spawn, spawnSync } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { mkdir, readFile } from 'node:fs/promises'
import mysql from 'mysql2/promise'
import puppeteer from 'puppeteer-core'

test('administration réelle : accès, statistiques, modération et sessions', { timeout: 180000 }, async (t) => {
  const databaseUrl = process.env.DATABASE_URL
  assert.ok(databaseUrl, 'Base de test requise')
  assert.ok(['localhost', '127.0.0.1', 'mariadb'].includes(new URL(databaseUrl).hostname), 'Ce test refuse une base de production distante')
  const port = Number(process.env.INTEGRATION_PORT ?? 3114)
  const base = process.env.INTEGRATION_BASE_URL ?? `http://127.0.0.1:${port}`
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Ce test refuse un site de production')
  const cwd = fileURLToPath(new URL('../..', import.meta.url))
  const connection = await mysql.createConnection(databaseUrl)
  const suffix = randomUUID().slice(0, 8)
  const emails = [`admin.${suffix}@spity.test`, `member.${suffix}@spity.test`]
  const password = 'AdminIntegration2026!'
  const postId = randomUUID()
  const content = `Publication-admin-test-${suffix}`
  let server
  let output = ''
  t.after(async () => {
    await connection.execute('DELETE FROM admin_audit_logs WHERE actor_id IN (SELECT id FROM users WHERE email IN (?, ?)) OR target_id IN (SELECT id FROM users WHERE email IN (?, ?)) OR target_id = ?', [...emails, ...emails, postId])
    await connection.execute('DELETE FROM users WHERE email IN (?, ?)', emails)
    await connection.end()
    if (server && server.exitCode === null) {
      server.kill('SIGTERM')
      await Promise.race([new Promise((done) => server.once('exit', done)), delay(5000)])
      if (server.exitCode === null) server.kill('SIGKILL')
    }
  })
  if (!process.env.INTEGRATION_BASE_URL) {
    const mode = process.env.ADMIN_TEST_PRODUCTION === '1' ? 'start' : 'dev'
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', mode, '--hostname', '127.0.0.1', '--port', String(port)], { cwd, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'] })
    const append = (chunk) => { output = `${output}${chunk}`.slice(-12000) }
    server.stdout.on('data', append)
    server.stderr.on('data', append)
  }
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    try { if ((await fetch(`${base}/api/health`)).ok) { ready = true; break } } catch { /* Startup */ }
    await delay(500)
  }
  assert.ok(ready, `Serveur de test indisponible : ${output}`)
  async function request(path, { cookie, method = 'GET', body, origin = base } = {}) {
    const headers = { Origin: origin, ...(cookie ? { Cookie: cookie } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }
    const response = await fetch(`${base}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: 'manual' })
    const text = await response.text()
    let data
    try { data = JSON.parse(text) } catch { data = text }
    return { status: response.status, headers: response.headers, data }
  }
  const cookies = (response) => response.headers.get('set-cookie').split(';')[0]
  async function login(email) {
    const response = await request('/api/auth/login', { method: 'POST', body: { email, password } })
    assert.equal(response.status, 200, JSON.stringify(response.data))
    return cookies(response)
  }
  const accounts = []
  for (const email of emails) {
    const response = await request('/api/auth/register', { method: 'POST', body: { email, password, role: 'grimpeur', isAdmin: true, isSuspended: false, sessionVersion: 999 } })
    assert.equal(response.status, 201, JSON.stringify(response.data))
    assert.equal(response.data.user.isAdmin, false, 'L’inscription ne permet pas l’auto-promotion')
    accounts.push({ id: response.data.user.id, cookie: cookies(response) })
  }
  let adminCookie
  const member = accounts[1]
  const mutate = (kind, id, state, options = {}) => request(`/api/admin/${kind}/${id}`, { method: 'PATCH', cookie: adminCookie, body: { state, reason: 'Vérification automatisée isolée' }, ...options })

  await t.test('refuse les visiteurs et membres ordinaires, y compris les pages', async () => {
    assert.equal((await mutate('users', member.id, true)).status, 401)
    assert.equal((await mutate('users', member.id, true, { cookie: member.cookie })).status, 403)
    assert.equal((await request('/app/admin', { cookie: member.cookie })).status, 404)
    const anonymous = await request('/app/admin')
    assert.equal(anonymous.status, 307)
    assert.ok(anonymous.headers.get('location').endsWith('/login'))
  })
  await t.test('le bootstrap est idempotent, journalisé et préserve le mot de passe', async () => {
    const [before] = await connection.execute('SELECT password_hash FROM users WHERE id = ?', [accounts[0].id])
    const grant = () => spawnSync(process.execPath, ['scripts/grant-admin.mjs'], { cwd, env: process.env, input: emails[0], encoding: 'utf8' })
    assert.equal(grant().status, 0)
    assert.equal(grant().status, 0)
    const [after] = await connection.execute('SELECT password_hash, session_version FROM users WHERE id = ?', [accounts[0].id])
    assert.equal(after[0].password_hash, before[0].password_hash)
    assert.equal(after[0].session_version, 1)
    const [audit] = await connection.execute('SELECT COUNT(*) AS total FROM admin_audit_logs WHERE target_id = ? AND action = ?', [accounts[0].id, 'admin_granted'])
    assert.equal(audit[0].total, 1)
    assert.equal((await request('/api/auth/me', { cookie: accounts[0].cookie })).data.authenticated, false)
    adminCookie = await login(emails[0])
    assert.equal((await request('/api/auth/me', { cookie: adminCookie })).data.user.isAdmin, true)
  })
  await connection.execute('INSERT INTO posts (id, author_id, contenu) VALUES (?, ?, ?)', [postId, member.id, content])
  await connection.execute('INSERT INTO likes (id, post_id, user_id) VALUES (?, ?, ?)', [randomUUID(), postId, accounts[0].id])
  await t.test('toutes les vues et périodes utilisent de vraies requêtes et restent privées', async () => {
    for (const query of ['days=7', 'days=30', 'days=90', 'view=accounts', 'view=accounts&status=restricted&q=%25', 'view=posts', 'view=posts&status=active&q=Publication', 'view=history']) {
      const response = await request(`/app/admin?${query}`, { cookie: adminCookie })
      assert.equal(response.status, 200, String(response.data).slice(-1000))
      assert.match(response.data, /Administration/)
      assert.doesNotMatch(response.data, /password_hash|resetPasswordToken|mysql:\/\//)
      // next dev overrides cache headers; CI also runs this against next start.
      assert.match(response.headers.get('cache-control'), process.env.ADMIN_TEST_PRODUCTION === '1' ? /no-store|private/ : /no-store|private|no-cache/)
      assert.match(response.data, /noindex/)
    }
    const dashboard = await request('/app/admin', { cookie: adminCookie })
    assert.match(dashboard.data, /sans date/)
  })
  await t.test('refuse CSRF, auto-suspension, droits injectés et cibles inconnues', async () => {
    assert.equal((await mutate('users', member.id, true, { origin: 'https://attacker.test' })).status, 403)
    assert.equal((await mutate('users', member.id, true, { origin: '' })).status, 403)
    assert.equal((await mutate('users', accounts[0].id, true)).status, 409)
    assert.equal((await mutate('users', member.id, true, { body: { state: true, reason: 'Motif valide', isAdmin: true } })).status, 422)
    assert.equal((await mutate('users', randomUUID(), true)).status, 404)
    assert.equal((await mutate('posts', randomUUID(), true)).status, 404)
  })
  await t.test('dashboard et dialogue accessibles, sans débordement sur mobile', { skip: !process.env.CHROME_PATH }, async () => {
    const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] })
    try {
      const page = await browser.newPage()
      const [name, value] = adminCookie.split('=')
      await page.setCookie({ name, value, url: base, httpOnly: true, sameSite: 'Lax' })
      const require = createRequire(import.meta.url)
      // Use Lighthouse's locked, modern engine: the root transitive axe 3.x
      // cannot interpret Tailwind 4 OKLCH colors and reports false contrasts.
      const lighthouseRequire = createRequire(require.resolve('lighthouse/package.json'))
      const axe = await readFile(lighthouseRequire.resolve('axe-core/axe.min.js'), 'utf8')
      const errors = []
      page.on('pageerror', (error) => errors.push(error.message))
      await mkdir(`${cwd}/.integration-results`, { recursive: true })
      for (const width of [1440, 320]) {
        await page.setViewport({ width, height: 1000 })
        await page.goto(`${base}/app/admin`, { waitUntil: 'networkidle0' })
        await page.evaluate(() => document.fonts.ready)
        await page.screenshot({ path: `${cwd}/.integration-results/admin-${width}.png`, fullPage: true })
        await page.addScriptTag({ content: axe })
        const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) })))
        assert.deepEqual(violations, [], JSON.stringify(violations))
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Débordement à ${width}px`)
      }
      await page.goto(`${base}/app/admin?view=accounts&q=${encodeURIComponent(emails[1])}`, { waitUntil: 'networkidle0' })
      await page.locator('button[aria-label^="Suspendre :"]').click()
      await page.waitForSelector('dialog[open]')
      await page.addScriptTag({ content: axe })
      const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(({ id }) => id))
      assert.deepEqual(violations, [])
      await page.keyboard.press('Escape')
      assert.equal(await page.$('dialog[open]'), null)
      assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('aria-label')), `Suspendre : ${emails[1]}`)
      assert.deepEqual(errors, [])
    } finally { await browser.close() }
  })
  let commentId
  await t.test('les nouveaux likes sont datés et les commentaires restent accessibles avant masquage', async () => {
    assert.equal((await request(`/api/posts/${postId}/likes`, { method: 'POST', cookie: member.cookie })).status, 200)
    const [rows] = await connection.execute('SELECT created_at FROM likes WHERE post_id = ? AND user_id = ?', [postId, member.id])
    assert.ok(rows[0].created_at)
    const comment = await request(`/api/posts/${postId}/comments`, { method: 'POST', cookie: member.cookie, body: { content: 'Commentaire de test admin' } })
    assert.equal(comment.status, 201)
    commentId = comment.data.comment.id
    // Complete a profile to inspect the authenticated feed and public profile.
    assert.equal((await request('/api/profile/grimpeur', { method: 'POST', cookie: member.cookie, body: { disciplines: ['bloc'], niveaux: { bloc: '6a' }, materiel: ['chaussons'] } })).status, 201)
    assert.match((await request('/app', { cookie: member.cookie })).data, new RegExp(content))
    assert.match((await request(`/app/profiles/${member.id}`, { cookie: member.cookie })).data, new RegExp(content))
  })
  await t.test('le masquage est réversible, idempotent et bloque les accès directs', async () => {
    assert.equal((await mutate('posts', postId, true)).status, 200)
    assert.equal((await mutate('posts', postId, true)).status, 200)
    assert.doesNotMatch((await request('/app', { cookie: member.cookie })).data, new RegExp(content))
    assert.doesNotMatch((await request(`/app/profiles/${member.id}`, { cookie: member.cookie })).data, new RegExp(content))
    assert.equal((await request(`/api/posts/${postId}/likes`, { method: 'POST', cookie: member.cookie })).status, 404)
    assert.equal((await request(`/api/posts/${postId}/comments`, { method: 'POST', cookie: member.cookie, body: { content: 'Interdit' } })).status, 404)
    assert.equal((await request(`/api/posts/${postId}/comments/${commentId}`, { method: 'PATCH', cookie: member.cookie, body: { content: 'Interdit' } })).status, 404)
    assert.equal((await request(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE', cookie: member.cookie })).status, 404)
    assert.equal((await mutate('posts', postId, false)).status, 200)
    assert.match((await request('/app', { cookie: member.cookie })).data, new RegExp(content))
    assert.equal((await request(`/api/posts/${postId}/comments/${commentId}`, { method: 'PATCH', cookie: adminCookie, body: { content: 'Modification interdite' } })).status, 403)
    assert.equal((await request(`/api/posts/${postId}/comments/${commentId}`, { method: 'PATCH', cookie: member.cookie, body: { content: 'Commentaire mis à jour' } })).status, 200)
    assert.equal((await request(`/api/posts/${postId}/comments/${commentId}`, { method: 'DELETE', cookie: member.cookie })).status, 200)
    const [history] = await connection.execute('SELECT action FROM admin_audit_logs WHERE target_id = ?', [postId])
    assert.deepEqual(history.map((row) => row.action).sort(), ['post_hidden', 'post_restored'])
  })
  await t.test('la suspension révoque les sessions définitivement, sans supprimer les données', async () => {
    assert.equal((await mutate('users', member.id, true)).status, 200)
    assert.equal((await request('/api/auth/me', { cookie: member.cookie })).data.authenticated, false)
    assert.equal((await request('/api/auth/login', { method: 'POST', body: { email: emails[1], password } })).status, 403)
    assert.equal((await request(`/api/posts/${postId}/likes`, { method: 'POST', cookie: member.cookie })).status, 401)
    assert.equal((await mutate('users', member.id, false)).status, 200)
    assert.equal((await request('/api/auth/me', { cookie: member.cookie })).data.authenticated, false)
    const fresh = await login(emails[1])
    assert.equal((await request('/api/auth/me', { cookie: fresh })).data.authenticated, true)
    const [rows] = await connection.execute('SELECT COUNT(*) AS total FROM posts WHERE id = ?', [postId])
    assert.equal(rows[0].total, 1)
  })
  await t.test('la révocation des droits est effective sans attendre l’expiration du cookie', async () => {
    await connection.execute('UPDATE users SET is_admin = false WHERE id = ?', [accounts[0].id])
    assert.equal((await mutate('users', member.id, true)).status, 403)
    assert.equal((await request('/app/admin', { cookie: adminCookie })).status, 404)
  })
})
