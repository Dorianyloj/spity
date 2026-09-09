/** @jest-environment node */
import { renderToStaticMarkup } from 'react-dom/server'
import { getAdminDashboard } from '../lib/repository'
import { buildActivity } from '../lib/statistics'
import AdminDashboard from './dashboard'

jest.mock('../lib/repository', () => ({ getAdminDashboard: jest.fn() }))

it.each([7, 30, 90])('renders a stable, single-text SVG title and an exact-data table for %s days', async (days) => {
  const now = new Date('2026-09-09T12:00:00Z')
  jest.mocked(getAdminDashboard).mockResolvedValue({
    ...buildActivity(days, { accounts: [], posts: [], comments: [], likes: [] }, now),
    generatedAt: now, roles: [], totalPosts: 0, hiddenPosts: 0, suspended: 0, admins: 0, undatedLikes: 1,
    contributors: 0, previousContributors: 0, recentAccounts: [], recentActions: [],
  })
  const html = renderToStaticMarkup(await AdminDashboard({ days }))
  // React treats title as raw text. Multiple JSX children here break hydration.
  expect(html).toContain(`<title id="chart-title">Publications et interactions sur ${days} jours</title>`)
  expect(html).toContain('Afficher les valeurs exactes')
  expect(html).toContain('sans date')
  expect(html).not.toMatch(/NaN|Infinity/)
  expect(html).toContain('Aucune action de modération enregistrée')
})
