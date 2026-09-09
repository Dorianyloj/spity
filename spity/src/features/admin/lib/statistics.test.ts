import { adminHref, adminQuerySchema, moderationSchema, moderationTargetSchema } from '../schemas'
import { buildActivity, comparison, periodBounds } from './statistics'

it('uses UTC calendar days and equally sized previous periods', () => {
  const now = new Date('2026-09-09T23:59:59.999Z')
  const { start, end, previousStart } = periodBounds(7, now)
  expect(end - start).toBe(7)
  expect(start - previousStart).toBe(7)
  expect(new Date(start * 86400000).toISOString()).toBe('2026-09-03T00:00:00.000Z')
  const data = buildActivity(7, { accounts: [{ day: start, value: 2 }, { day: start - 1, value: 3 }], posts: [], comments: [{ day: end - 1, value: 1 }], likes: [{ day: end - 1, value: 2 }] }, now)
  expect(data.points).toHaveLength(7)
  expect(data.current).toEqual({ accounts: 2, posts: 0, interactions: 3 })
  expect(data.previous).toEqual({ accounts: 3, posts: 0, interactions: 0 })
})

it('handles empty periods, months and years without inventing growth', () => {
  for (const days of [7, 30, 90]) {
    const data = buildActivity(days, { accounts: [], posts: [], comments: [], likes: [] }, new Date('2027-01-02Z'))
    expect(data.points).toHaveLength(days)
    expect(data.current.interactions).toBe(0)
  }
  expect(comparison(0, 0)).toBe('Aucune variation')
  expect(comparison(3, 0)).toBe('Nouveau sur la période')
  expect(comparison(2, 4)).toMatch('-50 %')
  expect(comparison(4, 2)).toMatch('+100 %')
  expect(comparison(4, 4)).toMatch('0 %')
})

it('bounds URL filters and strictly validates privileged operations', () => {
  expect(adminQuerySchema.parse({ view: 'hack', days: 200, page: -1, q: 'x'.repeat(101), status: 'none' })).toEqual({ view: 'dashboard', days: 30, page: 1, q: '', status: 'all' })
  expect(adminQuerySchema.parse({ view: 'posts', days: '7', q: ' bloc ', page: '2' })).toMatchObject({ days: 7, q: 'bloc', page: 2 })
  expect(moderationSchema.safeParse({ state: true, reason: ' court ' }).success).toBe(false)
  expect(moderationSchema.safeParse({ state: true, reason: 'Motif valide', isAdmin: true }).success).toBe(false)
  expect(moderationTargetSchema.safeParse({ kind: 'roles', id: 'invalid' }).success).toBe(false)
  expect(adminHref({ view: 'accounts', q: 'a+b@example.test' })).toBe('/app/admin?view=accounts&q=a%2Bb%40example.test')
})
