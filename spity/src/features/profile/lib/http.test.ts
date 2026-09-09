/** @jest-environment node */
import { readProfileBody, privateProfileResponse, profileFailure, ProfileOperationError } from './http'
import { profileSettingsSchema, createProfilePostSchema } from '../workspace-schemas'
jest.mock('@/lib/logger', () => ({ logger: { error: jest.fn() } }))
const identity = { section: 'identity', displayName: 'Camille', bio: null, location: null }
const request = (body = '{}', headers = {}) => new Request('http://localhost/api/profile/settings', { method: 'PATCH', headers: { Origin: 'http://localhost', Host: 'localhost', 'Content-Type': 'application/json', ...headers }, body })
it('reads real JSON and returns private responses', async () => {
  expect(await readProfileBody(request(JSON.stringify(identity)))).toEqual(identity)
  expect(privateProfileResponse({ ok: true }).headers.get('cache-control')).toBe('private, no-store')
  expect(profileFailure(new ProfileOperationError('Refus', 409)).status).toBe(409)
  const failure = profileFailure(new Error('secret mysql password'))
  expect(failure.status).toBe(503)
  expect(await failure.text()).not.toContain('secret')
})
it.each([
  ['{}', { Origin: 'https://attacker.test' }, 403], ['{}', { Origin: '' }, 403],
  ['{}', { 'Content-Type': 'text/plain' }, 415], ['{', {}, 400], ['x'.repeat(16385), {}, 413],
])('rejects unsafe or malformed requests', async (body, headers, status) => {
  await expect(readProfileBody(request(body, headers))).rejects.toMatchObject({ status })
})
it('rejects bodyless requests and injected identity/administration fields', async () => {
  await expect(readProfileBody(new Request('http://localhost', { method: 'PATCH', headers: { Origin: 'http://localhost', Host: 'localhost', 'Content-Type': 'application/json' } }))).rejects.toMatchObject({ status: 400 })
  expect(profileSettingsSchema.safeParse(identity).success).toBe(true)
  for (const extra of [{ userId: 'someone' }, { isAdmin: true }, { avatarUrl: 'https://elsewhere.test/image' }]) expect(profileSettingsSchema.safeParse({ ...identity, ...extra }).success).toBe(false)
  expect(profileSettingsSchema.safeParse({ section: 'practice', disciplines: ['bloc'], niveaux: {}, climbingEnvironment: null, goals: [] }).success).toBe(false)
  expect(createProfilePostSchema.safeParse({ content: '   ', cotation: null }).success).toBe(false)
  expect(createProfilePostSchema.safeParse({ content: 'test', cotation: null, authorId: 'someone' }).success).toBe(false)
})
