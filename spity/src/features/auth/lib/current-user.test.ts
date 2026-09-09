/** @jest-environment node */
import { db } from '@/db'
import { getSessionFromCookies } from './session'
import { getCurrentUser } from './current-user'
import { sessionPayloadSchema } from '../schemas'

jest.mock('@/db', () => ({ db: { select: jest.fn() } }))
jest.mock('./session', () => ({ getSessionFromCookies: jest.fn() }))
const id = '11111111-1111-4111-8111-111111111111'
const session = { sub: id, email: 'admin@spity.test', role: 'grimpeur' as const, ver: 2, iat: 1, exp: 9999999999 }
const row = { id, email: session.email, role: 'grimpeur', avatarUrl: null, emailVerified: false, isAdmin: true, isSuspended: false, sessionVersion: 2, passwordHash: 'must-never-be-returned', resetPasswordToken: 'private' }
const limit = jest.fn()
beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(getSessionFromCookies).mockResolvedValue(session)
  jest.mocked(db.select).mockReturnValue({ from: () => ({ where: () => ({ limit }) }) } as never)
  limit.mockResolvedValue([row])
})
it('reloads permissions from the database and returns only a safe DTO', async () => {
  const result = await getCurrentUser()
  expect(result).toEqual({ id, email: session.email, role: 'grimpeur', avatarUrl: null, emailVerified: false, isAdmin: true })
  limit.mockResolvedValue([{ ...row, isAdmin: false }])
  expect((await getCurrentUser())?.isAdmin).toBe(false)
})
it('rejects missing cookies, deleted users, suspended users and revoked sessions', async () => {
  jest.mocked(getSessionFromCookies).mockResolvedValue(null)
  expect(await getCurrentUser()).toBeNull()
  expect(db.select).not.toHaveBeenCalled()
  jest.mocked(getSessionFromCookies).mockResolvedValue(session)
  for (const rows of [[], [{ ...row, isSuspended: true }], [{ ...row, sessionVersion: 3 }]]) {
    limit.mockResolvedValue(rows)
    expect(await getCurrentUser()).toBeNull()
  }
})
it('preserves legacy signed sessions at version zero but rejects negative versions', () => {
  const { ver: _, ...legacy } = session
  void _
  expect(sessionPayloadSchema.parse(legacy).ver).toBe(0)
  expect(sessionPayloadSchema.safeParse({ ...legacy, ver: -1 }).success).toBe(false)
})
