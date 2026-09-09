// Pure calculations shared by the local preview and its tests. No live analytics.
export const DEMO_DATE = '2026-09-09'
const DAY = 86_400_000
const dateOf = (value) => Date.parse(`${value}T00:00:00Z`)
const isoDate = (value) => new Date(value).toISOString().slice(0, 10)
export const formatDay = (value) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(dateOf(value)))

export const demoInteractions = [
  ['2026-08-16', 'p5', 8, 2], ['2026-08-19', 'p5', 4, 1],
  ['2026-08-23', 'p4', 14, 3], ['2026-08-25', 'p4', 7, 2],
  ['2026-08-28', 'p3', 3, 1], ['2026-08-30', 'p3', 2, 1],
  ['2026-09-02', 'p2', 16, 4], ['2026-09-03', 'p2', 9, 3],
  ['2026-09-05', 'p2', 6, 2], ['2026-09-07', 'p4', 5, 2],
  ['2026-09-09', 'p1', 18, 5],
].map(([date, postId, likes, comments]) => ({ date, postId, likes, comments }))

export function getWindow(days, endDate = DEMO_DATE) {
  if (![7, 30, 90].includes(days)) throw new RangeError('Période non prise en charge')
  const end = dateOf(endDate) + DAY
  if (!Number.isFinite(end)) throw new RangeError('Date invalide')
  return { start: end - days * DAY, end, previousStart: end - days * DAY * 2 }
}

export function calculateDashboard({ accounts, posts, interactions, history, days = 30, endDate = DEMO_DATE }) {
  const window = getWindow(days, endDate)
  const between = (date, start, end) => dateOf(date) >= start && dateOf(date) < end
  function metrics(start, end) {
    const periodPosts = posts.filter((post) => between(post.publishedAt, start, end))
    const periodInteractions = interactions.filter((event) => between(event.date, start, end))
    const likes = periodInteractions.reduce((total, event) => total + event.likes, 0)
    const comments = periodInteractions.reduce((total, event) => total + event.comments, 0)
    return {
      accounts: accounts.filter((account) => between(account.createdAt, start, end)).length,
      posts: periodPosts.length,
      interactions: likes + comments,
      contributors: new Set(periodPosts.map((post) => post.authorId)).size,
      likes, comments,
    }
  }
  const bucketDays = days === 7 ? 1 : days === 30 ? 3 : 10
  const buckets = []
  for (let start = window.start; start < window.end; start += bucketDays * DAY) {
    const end = Math.min(start + bucketDays * DAY, window.end)
    buckets.push({ start: isoDate(start), end: isoDate(end - DAY), ...metrics(start, end) })
  }
  return {
    days, bucketDays, start: isoDate(window.start), end: isoDate(window.end - DAY),
    current: metrics(window.start, window.end),
    previous: metrics(window.previousStart, window.start),
    buckets,
    totals: {
      accounts: accounts.length,
      climbers: accounts.filter((account) => account.role === 'Grimpeur').length,
      clubs: accounts.filter((account) => account.role === 'Club').length,
      admins: accounts.filter((account) => account.admin).length,
      suspended: accounts.filter((account) => account.suspended).length,
      posts: posts.length,
      hidden: posts.filter((post) => post.hidden).length,
      actions: history.filter((entry) => between(entry.occurredAt, window.start, window.end)).length,
    },
  }
}

export function comparison(current, previous) {
  const difference = current - previous
  if (previous === 0) return current === 0 ? 'Aucune activité sur les deux périodes' : `+${current} · 0 sur la période précédente`
  if (difference === 0) return 'Stable par rapport à la période précédente'
  const percentage = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(Math.abs(difference / previous) * 100)
  return `${difference > 0 ? '+' : '−'}${percentage} % · ${previous} sur la période précédente`
}
