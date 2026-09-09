import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { mkdir, readFile } from 'node:fs/promises'
import mysql from 'mysql2/promise'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'

test('profil complet : persistance, confidentialité, médias et interface réelle', { timeout: 180000 }, async (t) => {
  const databaseUrl = process.env.DATABASE_URL
  assert.ok(databaseUrl, 'Base de test requise')
  assert.ok(['localhost', '127.0.0.1', 'mariadb'].includes(new URL(databaseUrl).hostname), 'Base de production refusée')
  const port = Number(process.env.INTEGRATION_PORT ?? 3115)
  const base = process.env.INTEGRATION_BASE_URL ?? `http://127.0.0.1:${port}`
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Site de production refusé')
  const cwd = fileURLToPath(new URL('../..', import.meta.url))
  const connection = await mysql.createConnection(databaseUrl)
  const suffix = randomUUID().slice(0, 8)
  const accounts = [], uploads = []
  let server, output = ''
  async function request(path, { cookie, method = 'GET', body, origin = base } = {}) {
    const response = await fetch(`${base}${path}`, { method, redirect: 'manual', headers: { Origin: origin, ...(cookie ? { Cookie: cookie } : {}), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) }, body: body === undefined ? undefined : JSON.stringify(body) })
    const text = await response.text()
    let data; try { data = JSON.parse(text) } catch { data = text }
    return { status: response.status, headers: response.headers, data }
  }
  t.after(async () => {
    // Only remove references, files and accounts created by this test run.
    for (const account of accounts) {
      await connection.execute('DELETE FROM posts WHERE author_id = ?', [account.id])
      await connection.execute('UPDATE users SET avatar_url = NULL, is_suspended = FALSE WHERE id = ?', [account.id])
    }
    for (const upload of uploads) await request(`/api/media/${upload.id}`, { cookie: upload.cookie, method: 'DELETE' })
    for (const account of accounts) await connection.execute('DELETE FROM users WHERE id = ? AND email = ?', [account.id, account.email])
    await connection.end()
    if (server && server.exitCode === null) {
      server.kill('SIGTERM')
      await Promise.race([new Promise((done) => server.once('exit', done)), delay(5000)])
      if (server.exitCode === null) server.kill('SIGKILL')
    }
  })
  if (!process.env.INTEGRATION_BASE_URL) {
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', process.env.ADMIN_TEST_PRODUCTION === '1' ? 'start' : 'dev', '--hostname', '127.0.0.1', '--port', String(port)], { cwd, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'] })
    const append = (chunk) => { output = `${output}${chunk}`.slice(-12000) }
    server.stdout.on('data', append); server.stderr.on('data', append)
  }
  let ready = false
  for (let attempt = 0; attempt < 120; attempt++) {
    try { if ((await fetch(`${base}/api/health`)).ok) { ready = true; break } } catch { /* Startup */ }
    await delay(500)
  }
  assert.ok(ready, `Serveur indisponible : ${output}`)
  for (const name of ['owner', 'viewer']) {
    const email = `profile.${name}.${suffix}@spity.test`
    const register = await request('/api/auth/register', { method: 'POST', body: { email, password: 'ProfileTest2026!', role: 'grimpeur' } })
    assert.equal(register.status, 201, JSON.stringify(register.data))
    const account = { id: register.data.user.id, email, cookie: register.headers.get('set-cookie').split(';')[0] }; accounts.push(account)
    assert.equal((await request('/api/profile/grimpeur', { method: 'POST', cookie: account.cookie, body: { disciplines: ['bloc', 'voie'], niveaux: { bloc: '6b', voie: '6a' }, materiel: ['corde'] } })).status, 201)
  }
  const [owner, viewer] = accounts
  const identity = { section: 'identity', displayName: `Camille ${suffix}`, bio: 'Du bloc en semaine, de la falaise le week-end.', location: 'Lyon' }
  const partners = { section: 'partners', availability: ['weekday_evening', 'weekend_morning'], partnerSearch: { enabled: true, levelPreference: 'any', style: 'relaxed', notes: 'Des sessions conviviales', shareEquipment: false } }
  const settings = (body, cookie = owner.cookie) => request('/api/profile/settings', { method: 'PATCH', cookie, body })
  const memberPath = `/app/profiles/${owner.id}`
  let sharedId, imageId, postId
  await t.test('authentification, CSRF, validation stricte et sauvegardes indépendantes', async () => {
    assert.equal((await request('/api/profile/settings', { method: 'PATCH', body: identity })).status, 401)
    assert.equal((await request('/api/profile/settings', { method: 'PATCH', cookie: owner.cookie, body: identity, origin: 'https://attacker.test' })).status, 403)
    assert.equal((await request('/api/profile/settings', { method: 'PATCH', cookie: owner.cookie, body: identity, origin: '' })).status, 403)
    assert.equal((await settings({ ...identity, isAdmin: true })).status, 422)
    assert.equal((await settings({ ...identity, avatarMediaId: randomUUID() })).status, 404)
    assert.equal((await settings(identity)).status, 200)
    assert.equal((await settings({ section: 'practice', disciplines: ['bloc'], niveaux: {}, climbingEnvironment: 'mixed', goals: [] })).status, 422)
    assert.equal((await settings({ section: 'practice', disciplines: ['bloc', 'voie'], niveaux: { bloc: '6b', voie: '6a' }, climbingEnvironment: 'mixed', goals: ['Progresser en voie'] })).status, 200)
    const saved = await settings(partners)
    assert.equal(saved.status, 200); assert.equal(saved.data.grimpeurProfile.displayName, identity.displayName)
    assert.deepEqual(saved.data.grimpeurProfile.niveaux, { bloc: '6b', voie: '6a' })
    assert.match(saved.headers.get('cache-control'), /private, no-store/)
  })
  await t.test('inventaire privé par défaut, partage explicite sans notes ni e-mail', async () => {
    for (const available of [true, false]) {
      const equipment = await request('/api/profile/equipment', { method: 'POST', cookie: owner.cookie, body: { category: 'corde', quantity: 1, brand: 'Beal', model: available ? `Shared-${suffix}` : `Private-${suffix}`, color: null, size: null, lengthMeters: 70, diameterMm: '9.1', condition: 'bon', availableForPartner: available, notes: `Secret-${suffix}` } })
      assert.equal(equipment.status, 201)
      if (available) sharedId = equipment.data.equipment.id
    }
    let page = await request(`${memberPath}?section=equipment`, { cookie: viewer.cookie })
    assert.equal(page.status, 200)
    assert.ok(!page.data.includes(`Shared-${suffix}`))
    assert.equal((await request(`/api/profile/equipment/${sharedId}`, { method: 'PATCH', cookie: viewer.cookie, body: { model: 'Hacked' } })).status, 404)
    assert.equal((await settings({ ...partners, partnerSearch: { ...partners.partnerSearch, shareEquipment: true } })).status, 200)
    page = await request(`${memberPath}?section=equipment`, { cookie: viewer.cookie })
    assert.ok(page.data.includes(`Shared-${suffix}`))
    for (const privateValue of [owner.email, `Private-${suffix}`, `Secret-${suffix}`, 'password_hash']) assert.ok(!page.data.includes(privateValue), `Fuite : ${privateValue}`)
    assert.match(page.data, /noindex/)
    assert.equal((await request(memberPath)).status, 307)
  })
  await t.test('photos privées avant utilisation et protégées après publication', async () => {
    const png = await sharp({ create: { width: 64, height: 64, channels: 3, background: '#8bb957' } }).png().toBuffer()
    const form = new FormData(); form.set('file', new Blob([png], { type: 'image/png' }), 'photo.png')
    const uploaded = await fetch(`${base}/api/media`, { method: 'POST', headers: { Cookie: owner.cookie, Origin: base }, body: form })
    assert.equal(uploaded.status, 201); imageId = (await uploaded.json()).media.id; uploads.push({ id: imageId, cookie: owner.cookie })
    assert.equal((await request(`/api/media/${imageId}`, { cookie: viewer.cookie })).status, 404)
    assert.equal((await request(`/api/avatars/${imageId}`, { cookie: viewer.cookie })).status, 404)
    assert.equal((await settings({ ...identity, avatarMediaId: imageId }, viewer.cookie)).status, 404)
    assert.equal((await settings({ ...identity, avatarMediaId: imageId })).status, 200)
    assert.equal((await request(`/api/avatars/${imageId}`, { cookie: viewer.cookie })).status, 200)
    assert.equal((await request(`/api/avatars/${imageId}`)).status, 401)
    assert.equal((await request(`/api/media/${imageId}`, { cookie: owner.cookie, method: 'DELETE' })).status, 409)
    assert.equal((await request('/api/posts', { cookie: viewer.cookie, method: 'POST', body: { content: 'Vol de photo', cotation: null, mediaId: imageId } })).status, 404)
    assert.equal((await request('/api/posts', { cookie: owner.cookie, method: 'POST', body: { content: 'Injection', cotation: null, authorId: viewer.id } })).status, 422)
    const post = await request('/api/posts', { cookie: owner.cookie, method: 'POST', body: { content: `Session-${suffix}`, cotation: '6b', mediaId: imageId } })
    assert.equal(post.status, 201); postId = post.data.id
    const visible = await request(`/api/post-media/${imageId}`, { cookie: viewer.cookie })
    assert.equal(visible.status, 200); assert.match(visible.headers.get('cache-control'), /private, no-store/)
    await connection.execute('UPDATE posts SET is_hidden = TRUE WHERE id = ? AND author_id = ?', [postId, owner.id])
    assert.equal((await request(`/api/post-media/${imageId}`, { cookie: viewer.cookie })).status, 404)
    assert.ok(!(await request(memberPath, { cookie: viewer.cookie })).data.includes(`Session-${suffix}`))
    await connection.execute('UPDATE posts SET is_hidden = FALSE WHERE id = ? AND author_id = ?', [postId, owner.id])
    for (let index = 0; index < 12; index++) await connection.execute('INSERT INTO posts (id, author_id, contenu, created_at) VALUES (?, ?, ?, ?)', [randomUUID(), owner.id, `Archive ${index}`, new Date('2026-01-01T12:00:00Z')])
    const page = await request(`${memberPath}?section=posts&page=999`, { cookie: viewer.cookie })
    assert.match(page.data, /Page /); assert.ok(page.data.includes('Archive'))
  })
  await t.test('interface hydratée accessible, formulaires persistants et mobile sans débordement', { skip: !process.env.CHROME_PATH }, async () => {
    const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ['--no-sandbox'] })
    try {
      const page = await browser.newPage(), errors = [], visualFailures = []
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => { if (message.type() === 'error') console.error('profile-browser:', message.text()) })
      const [name, value] = owner.cookie.split('='); await page.setCookie({ name, value, url: base, httpOnly: true, sameSite: 'Lax' })
      const require = createRequire(import.meta.url), lighthouseRequire = createRequire(require.resolve('lighthouse/package.json'))
      const axe = await readFile(lighthouseRequire.resolve('axe-core/axe.min.js'), 'utf8')
      await mkdir(`${cwd}/.integration-results`, { recursive: true })
      const audit = async (label) => {
        await page.screenshot({ path: `${cwd}/.integration-results/profile-${label}.png`, fullPage: true })
        await page.addScriptTag({ content: axe })
        const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) })))
        if (violations.length) visualFailures.push({ label, violations })
        if (!await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)) visualFailures.push({ label, overflow: true })
      }
      for (const width of [1440, 320]) {
        await page.setViewport({ width, height: 1000 })
        for (const section of ['overview', 'posts', 'equipment', 'settings']) {
          await page.goto(`${base}/profile/me?section=${section}`, { waitUntil: 'networkidle0' })
          assert.equal(new URL(page.url()).pathname, '/profile/me')
          await page.evaluate(() => document.fonts.ready); await audit(`${section}-${width}`)
        }
      }
      await page.goto(`${base}/profile/me`, { waitUntil: 'networkidle0' })
      await page.locator('button').filter((button) => button.textContent === 'Modifier mon profil').click()
      await page.waitForSelector('dialog[open]'); await audit('identity-320')
      assert.ok(await page.evaluate(() => { const rect = document.activeElement.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight }))
      await page.locator('input[name="displayName"]').fill(`Camille UI ${suffix}`)
      await page.locator('dialog button[type="submit"]').click(); await page.waitForSelector('dialog[open]', { hidden: true })
      await page.reload({ waitUntil: 'networkidle0' })
      assert.ok((await page.content()).includes(`Camille UI ${suffix}`))
      await page.locator('button').filter((button) => button.textContent === 'Modifier mon profil').click()
      await page.waitForSelector('dialog[open]'); await page.keyboard.press('Escape')
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), 'Modifier mon profil')
      for (const label of ['Modifier : pratique et objectifs', 'Ajuster : disponibilités et partenaires']) {
        await page.locator(`button[aria-label="${label}"]`).click(); await page.waitForSelector('dialog[open]'); await audit(label.startsWith('Modifier') ? 'practice-320' : 'partners-320'); await page.keyboard.press('Escape')
      }
      await page.goto(`${base}/profile/me?section=equipment`, { waitUntil: 'networkidle0' })
      await page.locator('button').filter((button) => button.textContent === 'Ajouter du matériel').click()
      await page.waitForSelector('dialog[open]'); await audit('equipment-dialog-320'); await page.keyboard.press('Escape')
      await page.goto(`${base}/profile/me?section=posts`, { waitUntil: 'networkidle0' })
      await page.locator('button').filter((button) => button.textContent === 'Créer une publication').click()
      await page.waitForSelector('dialog[open]'); await audit('post-dialog-320'); await page.keyboard.press('Escape')
      const [viewerName, viewerValue] = viewer.cookie.split('='); await page.setCookie({ name: viewerName, value: viewerValue, url: base, httpOnly: true, sameSite: 'Lax' })
      await page.goto(`${base}${memberPath}`, { waitUntil: 'networkidle0' }); await audit('member-320')
      assert.ok(!(await page.content()).includes(owner.email))
      await page.locator('button').filter((button) => button.textContent === 'Grimper ensemble').click()
      await page.waitForSelector('dialog[open]'); await audit('request-320')
      await page.locator('dialog button').filter((button) => button.textContent === 'Envoyer la demande').click()
      await page.waitForSelector('dialog[open]', { hidden: true })
      const [requests] = await connection.execute('SELECT status FROM partnership_requests WHERE sender_id = ? AND recipient_id = ?', [viewer.id, owner.id])
      assert.equal(requests[0].status, 'pending'); assert.deepEqual(errors, [])
      assert.deepEqual(visualFailures, [], JSON.stringify(visualFailures))
    } finally { await browser.close() }
  })
  await t.test('un compte suspendu perd la fiche et les écritures', async () => {
    await connection.execute('UPDATE users SET is_suspended = TRUE WHERE id = ?', [owner.id])
    assert.equal((await settings(identity)).status, 401)
    assert.equal((await request(memberPath, { cookie: viewer.cookie })).status, 404)
    assert.equal((await request(`/api/avatars/${imageId}`, { cookie: viewer.cookie })).status, 404)
  })
})
