/** @jest-environment node */
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { reviewPlaceRequest } from '@/features/admin/lib/repository'
import { PATCH } from './[id]/route'

jest.mock('@/features/auth/lib/current-user', () => ({ getCurrentUser: jest.fn() }))
jest.mock('@/features/admin/lib/repository', () => ({ reviewPlaceRequest: jest.fn() }))

const id = '11111111-1111-4111-8111-111111111111'
const context = { params: Promise.resolve({ id }) }
const admin = { id, email: 'admin@spity.test', role: 'grimpeur' as const, avatarUrl: null, emailVerified: true, isAdmin: true }

const request = (body: unknown) => new Request(`http://localhost:3000/api/admin/place-requests/${id}`, {
  method: 'PATCH',
  headers: { Host: 'localhost:3000', Origin: 'http://localhost:3000', 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(getCurrentUser).mockResolvedValue(admin)
  jest.mocked(reviewPlaceRequest).mockResolvedValue(undefined)
})

it('accepts an approval from an administrator', async () => {
  const response = await PATCH(request({ decision: 'approve', reason: '' }), context)
  expect(response.status).toBe(200)
  expect(reviewPlaceRequest).toHaveBeenCalledWith(id, { decision: 'approve', reason: '' })
})

it('requires administrator access and a reason when rejecting', async () => {
  jest.mocked(getCurrentUser).mockResolvedValueOnce(null)
  expect((await PATCH(request({ decision: 'approve', reason: '' }), context)).status).toBe(401)
  expect((await PATCH(request({ decision: 'reject', reason: 'court' }), context)).status).toBe(422)
  expect(reviewPlaceRequest).not.toHaveBeenCalled()
})
