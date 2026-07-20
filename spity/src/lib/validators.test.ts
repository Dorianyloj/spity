import {
  createCommentSchema,
  createEventSchema,
  createGrimpeurProfileSchema,
  createPostSchema,
  gradeSchema,
  loginSchema,
  registerSchema,
} from './validators'

describe('authentication validators', () => {
  it('accepts a valid registration', () => {
    expect(registerSchema.safeParse({
      email: 'grimpeur@spity.test',
      password: 'Spity-test1!',
      role: 'grimpeur',
    }).success).toBe(true)
  })

  it.each([
    ['an invalid email', { email: 'invalid', password: 'Spity-test1!', role: 'grimpeur' }],
    ['a short password', { email: 'test@spity.test', password: 'Aa1!', role: 'grimpeur' }],
    ['a password without uppercase', { email: 'test@spity.test', password: 'spity-test1!', role: 'grimpeur' }],
    ['a password without lowercase', { email: 'test@spity.test', password: 'SPITY-TEST1!', role: 'grimpeur' }],
    ['a password without number', { email: 'test@spity.test', password: 'Spity-test!', role: 'grimpeur' }],
    ['a password without special character', { email: 'test@spity.test', password: 'Spitytest1', role: 'grimpeur' }],
    ['an unknown role', { email: 'test@spity.test', password: 'Spity-test1!', role: 'admin' }],
  ])('rejects %s', (_label, input) => {
    expect(registerSchema.safeParse(input).success).toBe(false)
  })

  it('requires a password to log in', () => {
    expect(loginSchema.safeParse({ email: 'test@spity.test', password: '' }).success).toBe(false)
  })
})

describe('climbing domain validators', () => {
  it.each(['4a', '6c+', '8c+', '9a'])('accepts grade %s', (grade) => {
    expect(gradeSchema.safeParse(grade).success).toBe(true)
  })

  it.each(['3c', '6d', '10a', '7a++'])('rejects grade %s', (grade) => {
    expect(gradeSchema.safeParse(grade).success).toBe(false)
  })

  it('accepts a complete climber profile', () => {
    expect(createGrimpeurProfileSchema.safeParse({
      userId: '7c1886a3-5e76-4dd1-a240-3ecfa634dbc6',
      disciplines: ['bloc', 'voie'],
      niveaux: { bloc: '6b', voie: '6c+' },
      materiel: ['chaussons', 'baudrier'],
    }).success).toBe(true)
  })

  it('rejects a profile without a discipline', () => {
    expect(createGrimpeurProfileSchema.safeParse({
      userId: '7c1886a3-5e76-4dd1-a240-3ecfa634dbc6',
      disciplines: [],
      niveaux: {},
      materiel: [],
    }).success).toBe(false)
  })
})

describe('content and event validators', () => {
  it('defaults a post to a standard publication', () => {
    const result = createPostSchema.parse({
      authorId: '7c1886a3-5e76-4dd1-a240-3ecfa634dbc6',
      contenu: 'Session du soir',
    })

    expect(result.isStory).toBe(false)
  })

  it('rejects an empty comment', () => {
    expect(createCommentSchema.safeParse({
      postId: '7c1886a3-5e76-4dd1-a240-3ecfa634dbc6',
      authorId: 'f2e3f296-948d-413a-aa45-2a33d07493b1',
      contenu: '',
    }).success).toBe(false)
  })

  it('accepts an event with an ISO date and a positive capacity', () => {
    expect(createEventSchema.safeParse({
      clubId: '7c1886a3-5e76-4dd1-a240-3ecfa634dbc6',
      titre: 'Sortie falaise',
      debut: '2026-09-12T08:00:00.000Z',
      capacite: 12,
    }).success).toBe(true)
  })

  it('rejects a non-positive event capacity', () => {
    expect(createEventSchema.safeParse({
      clubId: '7c1886a3-5e76-4dd1-a240-3ecfa634dbc6',
      titre: 'Sortie falaise',
      debut: new Date('2026-09-12T08:00:00.000Z'),
      capacite: 0,
    }).success).toBe(false)
  })
})
