/** @jest-environment node */
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { ProfileOperationError } from '@/features/profile/lib/http'
import { createCragRoute } from '@/features/places/lib/request-repository'
import { consumeRateLimit } from '@/lib/rate-limit'
import { POST } from './route'

jest.mock('@/features/profile/lib/current-profile', () => ({ getCurrentProfile: jest.fn() }))
jest.mock('@/features/places/lib/request-repository', () => ({ createCragRoute: jest.fn() }))
jest.mock('@/lib/rate-limit', () => ({ consumeRateLimit: jest.fn() }))

const profile = {
  user: { id: '11111111-1111-4111-8111-111111111111', email: 'grimpeur@spity.test', role: 'grimpeur' as const, avatarUrl: null, emailVerified: true, isAdmin: false },
  grimpeurProfile: {}, clubProfile: null, equipment: [],
} as unknown as NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>>

const request = (body: unknown) => new Request('http://localhost:3000/api/places/routes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', Host: 'localhost:3000' },
  body: JSON.stringify(body),
})

const validRoute = {
  falaiseId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e', nom: 'La sortie du loup', cotation: '6a+', secteur: '',
  discipline: 'trad', hauteur: null, degaines: null, style: '', status: 'ok',
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(getCurrentProfile).mockResolvedValue(profile)
  jest.mocked(consumeRateLimit).mockReturnValue({ allowed: true, limit: 12, remaining: 11, resetAt: Date.now(), retryAfterSeconds: 0 })
  jest.mocked(createCragRoute).mockResolvedValue({ id: '22222222-2222-4222-8222-222222222222' })
})

describe('POST /api/places/routes', () => {
  it('creates a route for a completed climber profile', async () => {
    const response = await POST(request(validRoute))
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ route: { id: '22222222-2222-4222-8222-222222222222' } })
    expect(createCragRoute).toHaveBeenCalledWith(profile.user.id, validRoute)
  })

  it('rejects malformed, rate-limited and duplicate route contributions', async () => {
    expect((await POST(request({ ...validRoute, cotation: 'dur' }))).status).toBe(422)
    jest.mocked(consumeRateLimit).mockReturnValueOnce({ allowed: false, limit: 12, remaining: 0, resetAt: Date.now(), retryAfterSeconds: 60 })
    expect((await POST(request(validRoute))).status).toBe(429)
    jest.mocked(createCragRoute).mockRejectedValueOnce(new ProfileOperationError('Une voie porte déjà ce nom sur cette falaise.', 409))
    expect((await POST(request(validRoute))).status).toBe(409)
  })
})
