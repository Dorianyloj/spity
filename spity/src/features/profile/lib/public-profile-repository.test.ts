/** @jest-environment node */
import { db } from '@/db'
import { findPublicProfileByUserId } from './public-profile-repository'
jest.mock('@/db', () => ({ db: { select: jest.fn() } }))
const now = new Date('2026-01-01T12:00:00Z')
const row = { userId: 'user', role: 'grimpeur', avatarUrl: 'https://spity.test/images/avatar.webp', createdAt: now, climberId: 'profile', climberName: 'Camille', climberBio: 'Bio', climberLocation: 'Lyon', disciplines: '["bloc",4]', niveaux: '{"bloc":"6a","bad":false}', goals: '["Progresser"]', availability: '["weekday_evening","bad"]', partnerSearch: { enabled: true, levelPreference: 'any', style: 'relaxed', notes: null }, climbingEnvironment: 'mixed', karma: 0 }
const selects: unknown[] = []
const conditions: unknown[] = []
const limits: unknown[] = []
const offsets: unknown[] = []
function setup(results: unknown[][]) {
  selects.length = 0; conditions.length = 0; limits.length = 0; offsets.length = 0
  jest.mocked(db.select).mockImplementation((selection?: unknown) => {
    selects.push(selection)
    const value = results.shift()
    const query = { from: () => query, leftJoin: () => query, where: (where: unknown) => { conditions.push(where); return query }, orderBy: () => query, limit: (limit: number) => { limits.push(limit); return query }, offset: (offset: number) => { offsets.push(offset); return query }, then: (resolve: (value: unknown) => unknown) => Promise.resolve(value).then(resolve) }
    return query as never
  })
}
it('maps only public fields, normalizes stored JSON and paginates visible posts', async () => {
  setup([[row], [{ total: 25 }], [{ id: 'post', content: null, cotation: '6a', createdAt: now }], [{ postId: 'post', url: 'invalid' }, { postId: 'post', url: 'https://spity.test/images/photo.jpg' }, { postId: 'post', url: '/unused.jpg' }]])
  const profile = await findPublicProfileByUserId('user', 99)
  expect(profile).toMatchObject({ page: 3, pageCount: 3, postCount: 25, avatarUrl: '/images/avatar.webp', disciplines: ['bloc'], niveaux: { bloc: '6a' }, availability: ['weekday_evening'], sharedEquipment: [], posts: [{ content: 'Publication sans texte', imageUrl: '/images/photo.jpg', createdAt: now.toISOString() }] })
  expect(profile).not.toHaveProperty('email')
  expect(selects[0]).not.toHaveProperty('email')
  expect(selects).toHaveLength(4)
  expect(limits).toContain(12); expect(offsets).toEqual([24])
})
it('queries only safe equipment columns after explicit opt-in', async () => {
  setup([[{ ...row, partnerSearch: { ...row.partnerSearch, shareEquipment: true } }], [{ total: 0 }], [], [{ id: 'shared' }]])
  const profile = await findPublicProfileByUserId('user', NaN)
  expect(profile).toMatchObject({ page: 1, sharedEquipment: [{ id: 'shared' }] })
  expect(selects[3]).toHaveProperty('model')
  expect(selects[3]).not.toHaveProperty('notes')
  expect(selects[3]).not.toHaveProperty('userId')
  // The SQL predicate must include availability as well as ownership.
  const serialized = JSON.stringify(conditions[3], (key, value) => key === 'table' ? undefined : value)
  expect(serialized).toContain('available_for_partner')
})
it.each([{ rows: [] }, { rows: [{ ...row, climberId: null, clubId: null }] }])('returns null for unavailable profiles', async ({ rows }) => {
  setup([rows]); expect(await findPublicProfileByUserId('user')).toBeNull()
})
it('handles malformed legacy JSON and club profiles without leaking inventory', async () => {
  setup([[{ ...row, avatarUrl: null, disciplines: 'broken', niveaux: [], goals: null, partnerSearch: 'broken' }], [{ total: 0 }], []])
  expect(await findPublicProfileByUserId('user', -2)).toMatchObject({ disciplines: [], niveaux: {}, goals: [], partnerSearch: null, page: 1 })
  setup([[{ ...row, role: 'club', climberId: null, clubId: 'club', clubName: null, clubBio: null, clubLocation: null, ffmeNum: 'FFME', avatarUrl: '/images/club.png' }], [{ total: 1 }], [{ id: 'post', content: 'Club', createdAt: now, cotation: null }], []])
  expect(await findPublicProfileByUserId('user')).toMatchObject({ displayName: 'Club Spity', disciplines: [], ffmeNum: 'FFME', partnerSearch: null, posts: [{ imageUrl: null }] })
})
