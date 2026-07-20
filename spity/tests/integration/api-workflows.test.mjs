import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { after, before, test } from 'node:test'
import mysql from 'mysql2/promise'

const port = Number(process.env.INTEGRATION_PORT ?? 3102)
const baseUrl = process.env.INTEGRATION_BASE_URL ?? `http://127.0.0.1:${port}`
const databaseUrl = process.env.DATABASE_URL
const runId = randomUUID().slice(0, 8)
const password = 'Integration2026!'
const emails = {
  firstClimber: `integration.a.${runId}@spity.test`,
  secondClimber: `integration.b.${runId}@spity.test`,
  club: `integration.club.${runId}@spity.test`,
}

let serverProcess
let serverOutput = ''

const appendServerOutput = (chunk) => {
  serverOutput = `${serverOutput}${chunk.toString()}`.slice(-30_000)
}

const request = async (path, options = {}) => {
  const headers = {
    Accept: 'application/json',
    Origin: options.origin ?? baseUrl,
  }

  if (options.cookie) {
    headers.Cookie = options.cookie
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
  const rawBody = await response.text()
  let body = null

  if (rawBody.length > 0) {
    try {
      body = JSON.parse(rawBody)
    } catch {
      body = rawBody
    }
  }

  return { response, body }
}

const waitForServer = async () => {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (serverProcess?.exitCode !== null && serverProcess?.exitCode !== undefined) {
      throw new Error(`Le serveur Next.js s'est arrêté avant les tests.\n${serverOutput}`)
    }

    try {
      const { response, body } = await request('/api/health')

      if (response.status === 200 && body?.status === 'ok') {
        return
      }
    } catch {
      // Le serveur ou MariaDB n'est pas encore prêt.
    }

    await delay(500)
  }

  throw new Error(`Le serveur d'intégration n'est pas prêt après 30 secondes.\n${serverOutput}`)
}

const stopServer = async () => {
  if (!serverProcess || serverProcess.exitCode !== null) {
    return
  }

  serverProcess.kill('SIGTERM')
  await Promise.race([
    new Promise((resolve) => serverProcess.once('exit', resolve)),
    delay(5_000),
  ])

  if (serverProcess.exitCode === null) {
    serverProcess.kill('SIGKILL')
  }
}

const cleanupDatabase = async () => {
  if (!databaseUrl) {
    return
  }

  const connection = await mysql.createConnection(databaseUrl)

  try {
    await connection.execute(
      'delete from users where email in (?, ?, ?)',
      [emails.firstClimber, emails.secondClimber, emails.club]
    )
  } finally {
    await connection.end()
  }
}

const register = async (email, role) => {
  const { response, body } = await request('/api/auth/register', {
    method: 'POST',
    body: { email, password, role },
  })

  assert.equal(response.status, 201, JSON.stringify(body))
  assert.equal(body.user.email, email)
  assert.equal(body.user.role, role)

  const setCookie = response.headers.get('set-cookie')
  assert.ok(setCookie, 'Le cookie de session doit être défini')

  return {
    cookie: setCookie.split(';')[0],
    userId: body.user.id,
  }
}

const createClimberProfile = async (cookie, displayName, location, grade) => {
  const profileResponse = await request('/api/profile/grimpeur', {
    method: 'POST',
    cookie,
    body: {
      disciplines: ['bloc'],
      niveaux: { bloc: grade },
      materiel: ['chaussons'],
    },
  })
  assert.equal(profileResponse.response.status, 201, JSON.stringify(profileResponse.body))

  const publicProfileResponse = await request('/api/profile/public', {
    method: 'PATCH',
    cookie,
    body: {
      avatarUrl: null,
      displayName,
      bio: `Profil d'intégration ${displayName}`,
      location,
      climbingEnvironment: 'mixed',
      availability: ['weekend_morning'],
      partnerSearch: {
        enabled: true,
        levelPreference: 'same_or_close',
        style: 'training',
        notes: null,
      },
      goals: ['Trouver des partenaires réguliers'],
    },
  })
  assert.equal(publicProfileResponse.response.status, 200, JSON.stringify(publicProfileResponse.body))
}

before(async () => {
  assert.ok(databaseUrl, 'DATABASE_URL est requis pour les tests d’intégration')
  await cleanupDatabase()

  if (process.env.INTEGRATION_BASE_URL) {
    await waitForServer()
    return
  }

  const nextBinary = new URL('../../node_modules/next/dist/bin/next', import.meta.url).pathname
  serverProcess = spawn(process.execPath, [nextBinary, 'dev', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: new URL('../..', import.meta.url).pathname,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  serverProcess.stdout.on('data', appendServerOutput)
  serverProcess.stderr.on('data', appendServerOutput)
  await waitForServer()
})

after(async () => {
  try {
    await cleanupDatabase()
  } finally {
    await stopServer()
  }
})

test('parcours BC02 matching et événements avec MariaDB', async (context) => {
  const accounts = {}
  let partnershipId
  let eventId
  let registrationWinner
  let registrationLoser

  await context.test('les routes protégées refusent une requête anonyme', async () => {
    const { response, body } = await request('/api/matching')

    assert.equal(response.status, 401)
    assert.equal(body.error, 'Authentification requise')
  })

  await context.test('les comptes et profils des deux rôles sont créés', async () => {
    accounts.firstClimber = await register(emails.firstClimber, 'grimpeur')
    accounts.secondClimber = await register(emails.secondClimber, 'grimpeur')
    accounts.club = await register(emails.club, 'club')

    await createClimberProfile(accounts.firstClimber.cookie, 'Alice Intégration', 'Lyon', '6a')
    await createClimberProfile(accounts.secondClimber.cookie, 'Bastien Intégration', 'Lyon', '6b')

    const clubProfile = await request('/api/profile/club', {
      method: 'POST',
      cookie: accounts.club.cookie,
      body: {
        nom: 'Club Intégration',
        bio: 'Club créé par le test automatisé.',
        location: 'Lyon',
        ffmeNum: 'TEST-BC02',
      },
    })
    assert.equal(clubProfile.response.status, 201, JSON.stringify(clubProfile.body))
  })

  await context.test('l’annuaire combine les règles de confidentialité et de matching', async () => {
    const { response, body } = await request('/api/matching', {
      cookie: accounts.firstClimber.cookie,
    })

    assert.equal(response.status, 200)
    assert.equal(body.climbers.some((climber) => climber.userId === accounts.firstClimber.userId), false)
    const secondClimber = body.climbers.find((climber) => climber.userId === accounts.secondClimber.userId)
    assert.ok(secondClimber, 'Le second grimpeur doit apparaître dans le matching')
    assert.equal(Object.hasOwn(secondClimber, 'email'), false)
  })

  await context.test('une demande unique est créée puis traitée par son destinataire', async () => {
    const selfRequest = await request('/api/partnerships', {
      method: 'POST',
      cookie: accounts.firstClimber.cookie,
      body: { recipientId: accounts.firstClimber.userId },
    })
    assert.equal(selfRequest.response.status, 422)

    const createdRequest = await request('/api/partnerships', {
      method: 'POST',
      cookie: accounts.firstClimber.cookie,
      body: { recipientId: accounts.secondClimber.userId },
    })
    assert.equal(createdRequest.response.status, 201, JSON.stringify(createdRequest.body))
    assert.equal(createdRequest.body.request.status, 'pending')
    partnershipId = createdRequest.body.request.id

    const duplicateRequest = await request('/api/partnerships', {
      method: 'POST',
      cookie: accounts.firstClimber.cookie,
      body: { recipientId: accounts.secondClimber.userId },
    })
    assert.equal(duplicateRequest.response.status, 409)

    const forbiddenResponse = await request(`/api/partnerships/${partnershipId}`, {
      method: 'PATCH',
      cookie: accounts.firstClimber.cookie,
      body: { status: 'accepted' },
    })
    assert.equal(forbiddenResponse.response.status, 403)

    const acceptedRequest = await request(`/api/partnerships/${partnershipId}`, {
      method: 'PATCH',
      cookie: accounts.secondClimber.cookie,
      body: { status: 'accepted' },
    })
    assert.equal(acceptedRequest.response.status, 200, JSON.stringify(acceptedRequest.body))
    assert.equal(acceptedRequest.body.request.status, 'accepted')
  })

  await context.test('les mutations contrôlent l’origine et le rôle', async () => {
    const invalidOrigin = await request('/api/events', {
      method: 'POST',
      cookie: accounts.club.cookie,
      origin: 'https://example.invalid',
      body: {},
    })
    assert.equal(invalidOrigin.response.status, 403)

    const climberCreation = await request('/api/events', {
      method: 'POST',
      cookie: accounts.firstClimber.cookie,
      body: {},
    })
    assert.equal(climberCreation.response.status, 403)
  })

  await context.test('le club crée un événement futur', async () => {
    const startsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000)
    const createdEvent = await request('/api/events', {
      method: 'POST',
      cookie: accounts.club.cookie,
      body: {
        title: 'Contest d’intégration BC02',
        type: 'contest',
        description: 'Événement créé par le test automatisé.',
        location: 'Lyon',
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        capacity: 1,
      },
    })

    assert.equal(createdEvent.response.status, 201, JSON.stringify(createdEvent.body))
    assert.equal(createdEvent.body.event.isOwner, true)
    assert.equal(createdEvent.body.event.remainingCapacity, 1)
    eventId = createdEvent.body.event.id
  })

  await context.test('deux inscriptions concurrentes ne dépassent pas la dernière place', async () => {
    const attempts = await Promise.all([
      request(`/api/events/${eventId}/registrations`, {
        method: 'POST',
        cookie: accounts.firstClimber.cookie,
      }),
      request(`/api/events/${eventId}/registrations`, {
        method: 'POST',
        cookie: accounts.secondClimber.cookie,
      }),
    ])
    const statuses = attempts.map((attempt) => attempt.response.status).sort((first, second) => first - second)

    assert.deepEqual(statuses, [200, 409])
    registrationWinner = attempts[0].response.status === 200 ? accounts.firstClimber : accounts.secondClimber
    registrationLoser = attempts[0].response.status === 409 ? accounts.firstClimber : accounts.secondClimber

    const clubEvents = await request('/api/events', { cookie: accounts.club.cookie })
    const ownedEvent = clubEvents.body.events.find((event) => event.id === eventId)

    assert.equal(ownedEvent.registeredCount, 1)
    assert.equal(ownedEvent.remainingCapacity, 0)
    assert.equal(ownedEvent.participants.length, 1)

    const climberEvents = await request('/api/events', { cookie: registrationWinner.cookie })
    const publicEvent = climberEvents.body.events.find((event) => event.id === eventId)
    assert.deepEqual(publicEvent.participants, [])
  })

  await context.test('la désinscription libère la place et réactive une inscription annulée', async () => {
    const cancellation = await request(`/api/events/${eventId}/registrations`, {
      method: 'DELETE',
      cookie: registrationWinner.cookie,
    })
    assert.equal(cancellation.response.status, 200)
    assert.equal(cancellation.body.event.remainingCapacity, 1)

    const newRegistration = await request(`/api/events/${eventId}/registrations`, {
      method: 'POST',
      cookie: registrationLoser.cookie,
    })
    assert.equal(newRegistration.response.status, 200, JSON.stringify(newRegistration.body))
    assert.equal(newRegistration.body.event.registeredCount, 1)
  })

  await context.test('un événement annulé reste traçable et refuse toute nouvelle inscription', async () => {
    const cancellation = await request(`/api/events/${eventId}`, {
      method: 'PATCH',
      cookie: accounts.club.cookie,
      body: { status: 'cancelled' },
    })
    assert.equal(cancellation.response.status, 200, JSON.stringify(cancellation.body))
    assert.equal(cancellation.body.event.status, 'cancelled')

    const blockedRegistration = await request(`/api/events/${eventId}/registrations`, {
      method: 'POST',
      cookie: registrationWinner.cookie,
    })
    assert.equal(blockedRegistration.response.status, 409)
  })
})
