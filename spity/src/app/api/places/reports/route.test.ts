/** @jest-environment node */
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { ProfileOperationError } from '@/features/profile/lib/http'
import { createCragReport } from '@/features/places/lib/request-repository'
import { consumeRateLimit } from '@/lib/rate-limit'
import { POST } from './route'

jest.mock('@/features/profile/lib/current-profile', () => ({ getCurrentProfile: jest.fn() }))
jest.mock('@/features/places/lib/request-repository', () => ({ createCragReport: jest.fn() }))
jest.mock('@/lib/rate-limit', () => ({ consumeRateLimit: jest.fn() }))

const profile = {
  user: { id: '11111111-1111-4111-8111-111111111111', email: 'grimpeur@spity.test', role: 'grimpeur' as const, avatarUrl: null, emailVerified: true, isAdmin: false },
  grimpeurProfile: {}, clubProfile: null, equipment: [],
} as unknown as NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>>

const request = (body: unknown) => new Request('http://localhost:3000/api/places/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', Host: 'localhost:3000' },
  body: JSON.stringify(body),
})

const validReport = {
  falaiseId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e', type: 'condition', conditionState: 'humide', message: '',
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(getCurrentProfile).mockResolvedValue(profile)
  jest.mocked(consumeRateLimit).mockReturnValue({ allowed: true, limit: 12, remaining: 11, resetAt: Date.now(), retryAfterSeconds: 0 })
  jest.mocked(createCragReport).mockResolvedValue({ id: '33333333-3333-4333-8333-333333333333' })
})

describe('POST /api/places/reports', () => {
  it('creates a condition report for a completed climber profile', async () => {
    const response = await POST(request(validReport))
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({ report: { id: '33333333-3333-4333-8333-333333333333' } })
    expect(createCragReport).toHaveBeenCalledWith(profile.user.id, validReport)
  })

  it('rejects invalid reports, anonymous requests and reported repository errors', async () => {
    expect((await POST(request({ ...validReport, conditionState: 'inconnu' }))).status).toBe(422)
    jest.mocked(getCurrentProfile).mockResolvedValueOnce(null)
    expect((await POST(request(validReport))).status).toBe(401)
    jest.mocked(createCragReport).mockRejectedValueOnce(new ProfileOperationError('Cette falaise n’existe plus.', 404))
    expect((await POST(request(validReport))).status).toBe(404)
  })
})
