import { randomUUID } from 'node:crypto'
import { expect, request, test, type APIRequestContext, type Browser, type Locator, type Page } from '@playwright/test'
import mysql from 'mysql2/promise'

const port = Number(process.env.ACCEPTANCE_PORT ?? 3103)
const localHostname = process.env.CI ? 'localhost' : '127.0.0.1'
const baseURL = process.env.ACCEPTANCE_BASE_URL ?? `http://${localHostname}:${port}`
const databaseUrl = process.env.DATABASE_URL
const runId = randomUUID().slice(0, 8)
const password = 'Recette2026!'
const eventTitle = `Initiation recette BC02 ${runId}`
const accounts = {
  firstClimber: {
    email: `recette.alice.${runId}@spity.test`,
    displayName: `Alice Recette ${runId}`,
    location: 'Lyon',
    grade: '6a',
  },
  secondClimber: {
    email: `recette.bastien.${runId}@spity.test`,
    displayName: `Bastien Recette ${runId}`,
    location: 'Lyon',
    grade: '6b',
  },
  thirdClimber: {
    email: `recette.chloe.${runId}@spity.test`,
    displayName: `Chloé Recette ${runId}`,
    location: 'Grenoble',
    grade: '5c',
  },
  club: {
    email: `recette.club.${runId}@spity.test`,
    displayName: `Club Recette ${runId}`,
  },
  uiClimber: {
    email: `recette.ui.${runId}@spity.test`,
  },
} as const

type StorageState = Awaited<ReturnType<APIRequestContext['storageState']>>

let firstClimberApi: APIRequestContext
let secondClimberApi: APIRequestContext
let thirdClimberApi: APIRequestContext
let clubApi: APIRequestContext
let firstClimberState: StorageState
let secondClimberState: StorageState
let thirdClimberState: StorageState
let clubState: StorageState

const trackedEmails = Object.values(accounts).map((account) => account.email)

const cleanupDatabase = async () => {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL est requis pour la recette BC02')
  }

  const connection = await mysql.createConnection(databaseUrl)

  try {
    await connection.query('delete from users where email in (?)', [trackedEmails])
  } finally {
    await connection.end()
  }
}

const createApiContext = () => request.newContext({
  baseURL,
  extraHTTPHeaders: {
    Accept: 'application/json',
    Origin: baseURL,
  },
})

const registerAccount = async (api: APIRequestContext, email: string, role: 'grimpeur' | 'club') => {
  const response = await api.post('/api/auth/register', {
    data: { email, password, role },
  })

  expect(response.status(), await response.text()).toBe(201)
}

const createClimberProfile = async (
  api: APIRequestContext,
  account: typeof accounts.firstClimber | typeof accounts.secondClimber | typeof accounts.thirdClimber,
) => {
  const profileResponse = await api.post('/api/profile/grimpeur', {
    data: {
      disciplines: ['bloc'],
      niveaux: { bloc: account.grade },
      materiel: ['chaussons'],
    },
  })
  expect(profileResponse.status(), await profileResponse.text()).toBe(201)

  const publicProfileResponse = await api.patch('/api/profile/public', {
    data: {
      avatarUrl: null,
      displayName: account.displayName,
      bio: `Profil utilisé pour la recette ${runId}`,
      location: account.location,
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
  expect(publicProfileResponse.status(), await publicProfileResponse.text()).toBe(200)
}

const newAuthenticatedPage = async (browser: Browser, storageState: StorageState) => {
  const context = await browser.newContext({ storageState })
  const page = await context.newPage()

  return { context, page }
}

const cardContainingHeading = (page: Page, heading: string): Locator => page
  .getByRole('heading', { name: heading, exact: true })
  .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " spity-card ")]')

const toLocalDateTimeInput = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

test.describe.serial('Cahier de recettes BC02 - fonctions F01 à F10', () => {
  test.beforeAll(async () => {
    await cleanupDatabase()

    firstClimberApi = await createApiContext()
    secondClimberApi = await createApiContext()
    thirdClimberApi = await createApiContext()
    clubApi = await createApiContext()

    await registerAccount(firstClimberApi, accounts.firstClimber.email, 'grimpeur')
    await registerAccount(secondClimberApi, accounts.secondClimber.email, 'grimpeur')
    await registerAccount(thirdClimberApi, accounts.thirdClimber.email, 'grimpeur')
    await registerAccount(clubApi, accounts.club.email, 'club')

    await createClimberProfile(firstClimberApi, accounts.firstClimber)
    await createClimberProfile(secondClimberApi, accounts.secondClimber)
    await createClimberProfile(thirdClimberApi, accounts.thirdClimber)

    firstClimberState = await firstClimberApi.storageState()
    secondClimberState = await secondClimberApi.storageState()
    thirdClimberState = await thirdClimberApi.storageState()
    clubState = await clubApi.storageState()
  })

  test.afterAll(async () => {
    await Promise.all([
      firstClimberApi?.dispose(),
      secondClimberApi?.dispose(),
      thirdClimberApi?.dispose(),
      clubApi?.dispose(),
    ])
    await cleanupDatabase()
  })

  test('REC-F01-001 - inscription, onboarding, déconnexion et reconnexion', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Inscription' })).toBeVisible()

    await page.getByLabel('Email').fill(accounts.uiClimber.email)
    await page.locator('#register-password').fill('simple')
    await page.getByRole('button', { name: 'Créer mon compte' }).click()
    await expect(page.locator('#register-password-error')).toContainText('au moins 8 caractères')

    await page.locator('#register-password').fill(password)
    await page.getByLabel('Grimpeur').check()
    await page.getByRole('button', { name: 'Créer mon compte' }).click()
    await expect(page).toHaveURL(/\/profile\/onboarding$/)

    await page.getByRole('button', { name: 'Créer le profil' }).click()
    await expect(page.getByText('Profil grimpeur créé')).toBeVisible()
    await page.getByRole('link', { name: 'Entrer dans l’app' }).first().click()
    await expect(page).toHaveURL(/\/app$/)

    await page.getByRole('button', { name: /Déconnexion|Se déconnecter/ }).click()
    await expect(page).toHaveURL(/\/login$/)
    await page.getByLabel('Email').fill(accounts.uiClimber.email)
    await page.locator('#login-password').fill(password)
    await page.getByRole('button', { name: 'Se connecter' }).click()
    await expect(page).toHaveURL(/\/app$/)
  })

  test('REC-F02-001 - consultation grimpeur et création du profil club', async ({ browser }) => {
    const climber = await newAuthenticatedPage(browser, firstClimberState)

    await climber.page.goto('/profile/me')
    await expect(climber.page.getByRole('heading', { name: accounts.firstClimber.displayName })).toBeVisible()
    await expect(climber.page.getByLabel('Nom affiché')).toHaveValue(accounts.firstClimber.displayName)
    await climber.page.getByLabel('Bio courte').fill(`Profil vérifié par la recette ${runId}`)
    await climber.page.getByRole('button', { name: 'Mettre à jour la fiche publique' }).click()
    await expect(climber.page.getByText('Profil public mis à jour')).toBeVisible()
    await climber.context.close()

    const club = await newAuthenticatedPage(browser, clubState)

    await club.page.goto('/profile/onboarding')
    await club.page.getByLabel('Nom du club').fill(accounts.club.displayName)
    await club.page.getByLabel('Localisation').fill('Lyon')
    await club.page.getByLabel('Numéro FFME').fill(`REC-${runId}`)
    await club.page.getByLabel('Bio').fill('Club créé pendant la recette fonctionnelle BC02.')
    await club.page.getByRole('button', { name: 'Créer le profil' }).click()
    await expect(club.page.getByText('Profil club créé')).toBeVisible()
    await expect(club.page.getByRole('link', { name: 'Entrer dans l’app' }).first()).toBeVisible()
    await club.context.close()
  })

  test('REC-F03-F04-001 - filtres de matching, acceptation et refus', async ({ browser }) => {
    const sender = await newAuthenticatedPage(browser, firstClimberState)

    await sender.page.goto('/app/matching')
    await sender.page.getByLabel('Nom ou localisation').fill('Lyon')
    await sender.page.getByLabel('Discipline').selectOption('bloc')
    await sender.page.getByLabel('Niveau').selectOption('6b')
    await sender.page.getByLabel('Disponibilité').selectOption('weekend_morning')
    await sender.page.getByLabel('Environnement').selectOption('mixed')
    await expect(sender.page.getByRole('heading', { name: accounts.secondClimber.displayName })).toBeVisible()
    await expect(sender.page.getByRole('heading', { name: accounts.thirdClimber.displayName })).toHaveCount(0)

    await sender.page.getByLabel('Nom ou localisation').fill('profil qui n’existe pas')
    await expect(sender.page.getByRole('heading', { name: 'Aucun profil ne correspond' })).toBeVisible()
    await sender.page.getByRole('button', { name: 'Réinitialiser les filtres' }).click()

    const acceptedCard = cardContainingHeading(sender.page, accounts.secondClimber.displayName)
    await acceptedCard.getByRole('button', { name: 'Envoyer une demande' }).click()
    await expect(sender.page.getByText(`Demande envoyée à ${accounts.secondClimber.displayName}.`)).toBeVisible()

    const declinedCard = cardContainingHeading(sender.page, accounts.thirdClimber.displayName)
    await declinedCard.getByRole('button', { name: 'Envoyer une demande' }).click()
    await expect(sender.page.getByText(`Demande envoyée à ${accounts.thirdClimber.displayName}.`)).toBeVisible()
    await sender.context.close()

    const recipient = await newAuthenticatedPage(browser, secondClimberState)
    await recipient.page.goto('/app/partnerships')
    await recipient.page.getByRole('button', {
      name: `Accepter la demande de ${accounts.firstClimber.displayName}`,
    }).click()
    await expect(recipient.page.getByText('Demande acceptée.')).toBeVisible()
    await recipient.context.close()

    const decliningRecipient = await newAuthenticatedPage(browser, thirdClimberState)
    await decliningRecipient.page.goto('/app/partnerships')
    await decliningRecipient.page.getByRole('button', {
      name: `Refuser la demande de ${accounts.firstClimber.displayName}`,
    }).click()
    await expect(decliningRecipient.page.getByText('Demande refusée.')).toBeVisible()
    await decliningRecipient.context.close()

    const history = await newAuthenticatedPage(browser, firstClimberState)
    await history.page.goto('/app/partnerships')
    await expect(cardContainingHeading(history.page, accounts.secondClimber.displayName).getByText('Acceptée')).toBeVisible()
    await expect(cardContainingHeading(history.page, accounts.thirdClimber.displayName).getByText('Refusée')).toBeVisible()
    await history.context.close()
  })

  test('REC-F05-F08-001 - cycle complet d’un événement et suivi des participants', async ({ browser }) => {
    const club = await newAuthenticatedPage(browser, clubState)
    const startsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000)

    await club.page.goto('/app/events')
    await club.page.getByRole('button', { name: 'Nouvel événement' }).click()
    await club.page.getByLabel('Titre').fill(eventTitle)
    await club.page.getByLabel('Type').selectOption('initiation')
    await club.page.getByLabel('Description').fill('Parcours fonctionnel automatisé du cahier de recettes.')
    await club.page.getByLabel('Lieu').fill('Mur de Lyon')
    await club.page.getByLabel('Début').fill(toLocalDateTimeInput(startsAt))
    await club.page.getByLabel('Fin').fill(toLocalDateTimeInput(endsAt))
    await club.page.getByLabel('Capacité').fill('1')
    await club.page.getByRole('button', { name: 'Publier' }).click()
    await expect(club.page.getByText('Événement enregistré.')).toBeVisible()
    await expect(club.page.getByRole('heading', { name: eventTitle })).toBeVisible()

    const first = await newAuthenticatedPage(browser, firstClimberState)
    await first.page.goto('/app/events')
    await cardContainingHeading(first.page, eventTitle).getByRole('button', { name: 'S’inscrire' }).click()
    await expect(first.page.getByText('Inscription confirmée.')).toBeVisible()

    const second = await newAuthenticatedPage(browser, secondClimberState)
    await second.page.goto('/app/events')
    await expect(cardContainingHeading(second.page, eventTitle).getByRole('button', { name: 'S’inscrire' })).toBeDisabled()

    await club.page.reload()
    let eventCard = cardContainingHeading(club.page, eventTitle)
    await expect(eventCard.getByText('Participants')).toBeVisible()
    await expect(eventCard.getByText(accounts.firstClimber.displayName)).toBeVisible()
    await eventCard.getByRole('button', { name: 'Modifier' }).click()
    await club.page.getByLabel('Capacité').fill('2')
    await club.page.getByRole('button', { name: 'Enregistrer' }).click()
    await expect(club.page.getByText('Événement enregistré.')).toBeVisible()

    await second.page.reload()
    await cardContainingHeading(second.page, eventTitle).getByRole('button', { name: 'S’inscrire' }).click()
    await expect(second.page.getByText('Inscription confirmée.')).toBeVisible()

    await first.page.reload()
    await cardContainingHeading(first.page, eventTitle).getByRole('button', { name: 'Annuler mon inscription' }).click()
    await expect(first.page.getByText('Inscription annulée.')).toBeVisible()

    await club.page.reload()
    eventCard = cardContainingHeading(club.page, eventTitle)
    await expect(eventCard.getByText(accounts.secondClimber.displayName)).toBeVisible()
    await expect(eventCard.getByText(accounts.firstClimber.displayName)).toHaveCount(0)
    await eventCard.getByRole('button', { name: 'Annuler l’événement' }).click()
    await expect(club.page.getByText('Événement annulé.')).toBeVisible()
    await expect(eventCard.getByText('Annulation enregistrée')).toBeVisible()
    await expect(eventCard.getByText('Annulé', { exact: true })).toBeVisible()

    await Promise.all([first.context.close(), second.context.close(), club.context.close()])
  })

  test('REC-F09-001 - authentification, rôle, origine et validation bloquent les accès invalides', async ({ page }) => {
    const protectedResponse = await page.goto('/app/matching')
    await expect(page).toHaveURL(/\/login$/)
    expect(protectedResponse?.headers()['content-security-policy']).toContain("default-src 'self'")

    const forbiddenRole = await clubApi.get('/api/matching')
    expect(forbiddenRole.status()).toBe(403)

    const invalidOrigin = await clubApi.post('/api/events', {
      headers: { Origin: 'https://example.invalid' },
      data: {},
    })
    expect(invalidOrigin.status()).toBe(403)

    const invalidPayload = await firstClimberApi.post('/api/partnerships', {
      data: { recipientId: 'identifiant-invalide' },
    })
    expect(invalidPayload.status()).toBe(422)
    await expect(invalidPayload.json()).resolves.toMatchObject({ error: expect.any(String) })
  })

  test('REC-F10-001 - structure, navigation clavier et affichage mobile', async ({ browser }) => {
    const context = await browser.newContext({
      storageState: firstClimberState,
      viewport: { width: 360, height: 800 },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()

    await page.goto('/app/matching')
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toBeVisible()

    const matchingLink = page.getByRole('link', { name: 'Partenaires', exact: true })
    for (let attempt = 0; attempt < 20; attempt += 1) {
      if (await matchingLink.evaluate((element) => element === document.activeElement)) {
        break
      }
      await page.keyboard.press('Tab')
    }
    await expect(matchingLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/app\/matching$/)

    const hasHorizontalOverflow = await page.evaluate(() => (
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    ))
    expect(hasHorizontalOverflow).toBe(false)
    await expect(page.getByLabel('Nom ou localisation')).toBeVisible()
    await context.close()
  })
})
