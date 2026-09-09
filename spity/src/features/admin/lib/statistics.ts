export const DAY_SECONDS = 86400
export type DailyCount = { day: number; value: number }
export type ActivitySources = Record<'accounts' | 'posts' | 'comments' | 'likes', DailyCount[]>

export function periodBounds(days: number, now = new Date()) {
  const today = Math.floor(now.getTime() / 1000 / DAY_SECONDS)
  const end = today + 1
  return { start: end - days, previousStart: end - days * 2, end }
}

export function buildActivity(days: number, sources: ActivitySources, now = new Date()) {
  const bounds = periodBounds(days, now)
  const maps = Object.fromEntries(Object.entries(sources).map(([key, rows]) => [key, new Map(rows.map((row) => [row.day, Number(row.value)]))])) as Record<keyof ActivitySources, Map<number, number>>
  const points = Array.from({ length: days * 2 }, (_, index) => {
    const day = bounds.previousStart + index
    return {
      date: new Date(day * DAY_SECONDS * 1000).toISOString().slice(0, 10),
      accounts: maps.accounts.get(day) ?? 0,
      posts: maps.posts.get(day) ?? 0,
      interactions: (maps.comments.get(day) ?? 0) + (maps.likes.get(day) ?? 0),
    }
  })
  const sum = (rows: typeof points) => rows.reduce((total, row) => ({ accounts: total.accounts + row.accounts, posts: total.posts + row.posts, interactions: total.interactions + row.interactions }), { accounts: 0, posts: 0, interactions: 0 })
  return { points: points.slice(days), current: sum(points.slice(days)), previous: sum(points.slice(0, days)) }
}

export function comparison(current: number, previous: number) {
  if (!previous) return current ? 'Nouveau sur la période' : 'Aucune variation'
  const percent = Math.round((current - previous) / previous * 100)
  return `${percent > 0 ? '+' : ''}${percent} % vs période précédente`
}
