/** @jest-environment node */
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { consumeRateLimit } from '@/lib/rate-limit'
import { GET } from './route'

jest.mock('@/features/profile/lib/current-profile', () => ({ getCurrentProfile: jest.fn() }))
jest.mock('@/lib/rate-limit', () => ({ consumeRateLimit: jest.fn() }))

const fetchMock = jest.fn()
const profile = {
  user: { id: '11111111-1111-4111-8111-111111111111', email: 'grimpeur@spity.test', role: 'grimpeur' as const, avatarUrl: null, emailVerified: true, isAdmin: false },
  grimpeurProfile: {},
  clubProfile: null,
  equipment: [],

} as unknown as NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>>
beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = fetchMock
  jest.mocked(getCurrentProfile).mockResolvedValue(profile)
  jest.mocked(consumeRateLimit).mockReturnValue({ allowed: true, limit: 40, remaining: 39, resetAt: Date.now(), retryAfterSeconds: 0 })
})

it('returns compact map results from the geocoding service', async () => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({
      features: [{
        geometry: { coordinates: [4.835, 45.758] },
        properties: { id: '69123', label: 'Lyon', type: 'municipality' },
      }],
    }),
  } as Response)

  const response = await GET(new Request('http://localhost:3000/api/places/search?q=Lyon'))
  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({
    results: [{ id: '69123-0', label: 'Lyon', latitude: 45.758, longitude: 4.835, type: 'municipality' }],
  })
})

it('requires a climber and a useful query', async () => {
  jest.mocked(getCurrentProfile).mockResolvedValueOnce(null)
  expect((await GET(new Request('http://localhost:3000/api/places/search?q=Lyon'))).status).toBe(401)
  expect((await GET(new Request('http://localhost:3000/api/places/search?q=L'))).status).toBe(422)
  expect(fetchMock).not.toHaveBeenCalled()
})
