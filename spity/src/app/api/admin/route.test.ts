/** @jest-environment node */
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { AdminError } from '@/features/admin/lib/access'
import { moderate } from '@/features/admin/lib/repository'
import { PATCH } from './[kind]/[id]/route'

jest.mock('@/features/auth/lib/current-user', () => ({ getCurrentUser: jest.fn() }))
jest.mock('@/features/admin/lib/repository', () => ({ moderate: jest.fn() }))
const id = '11111111-1111-4111-8111-111111111111'
const context = { params: Promise.resolve({ kind: 'users', id }) }
const user = { id, email: 'admin@spity.test', role: 'grimpeur' as const, avatarUrl: null, emailVerified: false, isAdmin: true }
function request(body = JSON.stringify({ state: true, reason: 'Motif de test' }), headers: Record<string, string> = {}) {
  return new Request(`http://localhost:3000/api/admin/users/${id}`, { method: 'PATCH', headers: { Host: 'localhost:3000', Origin: 'http://localhost:3000', 'Content-Type': 'application/json', ...headers }, body })
}
beforeEach(() => { jest.clearAllMocks(); jest.mocked(getCurrentUser).mockResolvedValue(user); jest.mocked(moderate).mockResolvedValue(undefined) })

it('requires fresh administrator rights for every call', async () => {
  jest.mocked(getCurrentUser).mockResolvedValue(null)
  expect((await PATCH(request(), context)).status).toBe(401)
  jest.mocked(getCurrentUser).mockResolvedValue({ ...user, isAdmin: false })
  expect((await PATCH(request(), context)).status).toBe(403)
  expect(moderate).not.toHaveBeenCalled()
})

it.each<Record<string, string>>([{ Origin: 'https://attacker.test' }, { Origin: '' }, { Origin: 'null' }, { 'Sec-Fetch-Site': 'cross-site' }, { Host: '' }])('rejects missing/cross-site origin: %j', async (headers) => {
  expect((await PATCH(request(undefined, headers), context)).status).toBe(403)
  expect(moderate).not.toHaveBeenCalled()
})

it('limits content type, body size, JSON structure and allowed targets', async () => {
  expect((await PATCH(request('{}', { 'Content-Type': 'text/plain' }), context)).status).toBe(415)
  expect((await PATCH(request('{'), context)).status).toBe(400)
  expect((await PATCH(request('x'.repeat(4097)), context)).status).toBe(413)
  expect((await PATCH(request('{}'), context)).status).toBe(422)
  expect((await PATCH(request(JSON.stringify({ state: true, reason: 'Motif de test', isAdmin: true })), context)).status).toBe(422)
  expect((await PATCH(request(), { params: Promise.resolve({ kind: 'roles', id }) })).status).toBe(400)
  expect((await PATCH(request(), { params: Promise.resolve({ kind: 'posts', id: 'invalid' }) })).status).toBe(400)
  const empty = new Request('http://localhost:3000', { method: 'PATCH', headers: { Host: 'localhost:3000', Origin: 'http://localhost:3000', 'Content-Type': 'application/json' } })
  expect((await PATCH(empty, context)).status).toBe(400)
  expect(moderate).not.toHaveBeenCalled()
})

it('writes a validated operation and prevents caching of private results', async () => {
  const response = await PATCH(request(), context)
  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({ ok: true })
  expect(moderate).toHaveBeenCalledWith({ kind: 'users', id }, { state: true, reason: 'Motif de test' })
  expect(response.headers.get('cache-control')).toBe('private, no-store')
  expect(response.headers.get('vary')).toBe('Cookie')
  expect(response.headers.get('x-robots-tag')).toContain('noindex')
})

it('returns safe errors without leaking database diagnostics', async () => {
  jest.mocked(moderate).mockRejectedValue(new AdminError('Compte protégé.', 409))
  expect((await PATCH(request(), context)).status).toBe(409)
  jest.mocked(moderate).mockRejectedValue(new Error('mysql://secret'))
  const response = await PATCH(request(), context)
  expect(response.status).toBe(500)
  expect(JSON.stringify(await response.json())).not.toContain('secret')
})
