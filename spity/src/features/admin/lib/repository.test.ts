/** @jest-environment node */
import { db } from '@/db'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { getSessionFromCookies } from '@/features/auth/lib/session'
import { adminQuerySchema } from '../schemas'
import { getAdminDashboard, listAdminAccounts, listAdminHistory, listAdminPosts, moderate } from './repository'

jest.mock('@/db', () => ({ db: { select: jest.fn(), transaction: jest.fn() } }))
jest.mock('@/features/auth/lib/current-user', () => ({ getCurrentUser: jest.fn() }))
jest.mock('@/features/auth/lib/session', () => ({ getSessionFromCookies: jest.fn() }))
const id = '11111111-1111-4111-8111-111111111111'
const targetId = '22222222-2222-4222-8222-222222222222'
const actor = { id, isAdmin: true, isSuspended: false, version: 1 }
const lock = jest.fn()
const values = jest.fn()
const set = jest.fn()
beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(getCurrentUser).mockResolvedValue({ id, email: 'admin@spity.test', role: 'grimpeur', avatarUrl: null, emailVerified: false, isAdmin: true })
  jest.mocked(getSessionFromCookies).mockResolvedValue({ sub: id, email: 'admin@spity.test', role: 'grimpeur', ver: 1, iat: 0, exp: 9999999999 })
  set.mockReturnValue({ where: jest.fn() })
  jest.mocked(db.transaction).mockImplementation(async (callback) => callback({
    select: () => ({ from: () => ({ where: () => ({ limit: () => ({ for: lock }) }) }) }),
    update: () => ({ set }), insert: () => ({ values }),
  } as unknown as Parameters<Parameters<typeof db.transaction>[0]>[0]))
})
const input = { state: true, reason: 'Motif de modération' }

it('rechecks permission at every data-access boundary', async () => {
  jest.mocked(getCurrentUser).mockResolvedValue(null)
  const query = adminQuerySchema.parse({})
  for (const operation of [() => getAdminDashboard(7), () => listAdminAccounts(query), () => listAdminPosts(query), () => listAdminHistory(1), () => moderate({ kind: 'users', id: targetId }, input)]) {
    await expect(operation()).rejects.toMatchObject({ status: 401 })
  }
  expect(db.select).not.toHaveBeenCalled()
  expect(db.transaction).not.toHaveBeenCalled()
})

it.each([[], [{ ...actor, isAdmin: false }], [{ ...actor, isSuspended: true }], [{ ...actor, version: 2 }]].map((rows) => ({ rows })))('locks and checks the current actor before writing: %j', async ({ rows }) => {
  lock.mockResolvedValue(rows)
  await expect(moderate({ kind: 'users', id: targetId }, input)).rejects.toMatchObject({ status: 403 })
  expect(lock).toHaveBeenCalledWith('update')
  expect(set).not.toHaveBeenCalled()
  expect(values).not.toHaveBeenCalled()
})

it('rejects a vanished session, absent target, self and another administrator', async () => {
  jest.mocked(getSessionFromCookies).mockResolvedValueOnce(null)
  await expect(moderate({ kind: 'users', id: targetId }, input)).rejects.toMatchObject({ status: 401 })
  for (const [target, status] of [[[], 404], [[{ id, isAdmin: false }], 409], [[{ id: targetId, isAdmin: true }], 409]] as const) {
    lock.mockResolvedValueOnce([actor]).mockResolvedValueOnce(target)
    await expect(moderate({ kind: 'users', id: targetId }, input)).rejects.toMatchObject({ status })
  }
  lock.mockResolvedValueOnce([actor]).mockResolvedValueOnce([])
  await expect(moderate({ kind: 'posts', id: targetId }, input)).rejects.toMatchObject({ status: 404 })
  expect(set).not.toHaveBeenCalled()
})

it.each([
  ['users', true, 'user_suspended'], ['users', false, 'user_restored'],
  ['posts', true, 'post_hidden'], ['posts', false, 'post_restored'],
] as const)('writes %s state %s together with audit %s', async (kind, state, action) => {
  lock.mockResolvedValueOnce([actor]).mockResolvedValueOnce([{ id: targetId, isAdmin: false, isSuspended: !state, isHidden: !state }])
  await moderate({ kind, id: targetId }, { ...input, state })
  expect(set).toHaveBeenCalledWith(expect.objectContaining(kind === 'users' ? { isSuspended: state, sessionVersion: expect.anything() } : { isHidden: state }))
  expect(values).toHaveBeenCalledWith({ actorId: id, action, targetId, reason: input.reason })
})

it.each(['users', 'posts'] as const)('does not fabricate an audit event for repeated %s state', async (kind) => {
  lock.mockResolvedValueOnce([actor]).mockResolvedValueOnce([{ id: targetId, isAdmin: false, isSuspended: true, isHidden: true }])
  await moderate({ kind, id: targetId }, input)
  expect(set).not.toHaveBeenCalled()
  expect(values).not.toHaveBeenCalled()
})

it('does not swallow audit failures so that the surrounding transaction rolls back', async () => {
  lock.mockResolvedValueOnce([actor]).mockResolvedValueOnce([{ id: targetId, isHidden: false }])
  values.mockRejectedValue(new Error('audit unavailable'))
  await expect(moderate({ kind: 'posts', id: targetId }, input)).rejects.toThrow('audit unavailable')
})
