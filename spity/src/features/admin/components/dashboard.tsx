import Link from 'next/link'
import type { ReactNode } from 'react'
import { getAdminDashboard } from '../lib/repository'
import { comparison } from '../lib/statistics'
import { actionLabels, adminHref } from '../schemas'

export const panelClass = 'min-w-0 rounded-xl border border-border bg-card p-5 text-card-foreground sm:p-6'
export const number = (value: number) => value.toLocaleString('fr-FR')
export const dateTime = (value: Date) => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' }).format(value)

function Metric({ label, value, previous, detail }: { label: string; value: number; previous: number; detail: string }) {
  return <article className={panelClass}>
    <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
    <p className="mt-3 text-4xl font-bold tabular-nums">{number(value)}</p>
    <p className="mt-2 text-sm font-semibold">{comparison(value, previous)}</p>
    <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
  </article>
}

function QuickLink({ href, children, value }: { href: string; children: ReactNode; value: number }) {
  return <Link href={href} className="flex min-h-16 items-center justify-between gap-3 rounded-lg border border-border bg-secondary p-4 font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">{children}<span className="text-2xl tabular-nums">{number(value)}</span></Link>
}

export default async function AdminDashboard({ days }: { days: number }) {
  const data = await getAdminDashboard(days)
  const groupSize = days === 7 ? 1 : days === 30 ? 3 : 10
  const buckets = Array.from({ length: Math.ceil(days / groupSize) }, (_, index) => {
    const points = data.points.slice(index * groupSize, (index + 1) * groupSize)
    return { start: points[0].date, end: points.at(-1)!.date, posts: points.reduce((sum, p) => sum + p.posts, 0), interactions: points.reduce((sum, p) => sum + p.interactions, 0) }
  })
  const ceiling = Math.max(4, Math.ceil(Math.max(...buckets.flatMap((p) => [p.posts, p.interactions])) / 4) * 4)
  const totalUsers = data.roles.reduce((sum, role) => sum + role.total, 0)
  const shortDate = (date: string) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))

  return <div className="space-y-5">
    <section className="flex flex-wrap items-center justify-between gap-4" aria-label="Période des statistiques">
      <div><h2 className="text-xl font-bold text-white">Vue d’ensemble</h2><p className="mt-1 text-sm text-zinc-300">Données réelles · actualisées le {dateTime(data.generatedAt)}</p></div>
      <nav aria-label="Période" className="flex rounded-lg border border-zinc-600 p-1">{[7, 30, 90].map((period) => <Link key={period} href={adminHref({ days: period as 7 | 30 | 90 })} aria-current={days === period ? 'true' : undefined} className={`rounded-md px-4 py-3 text-sm font-semibold ${days === period ? 'bg-primary text-primary-foreground' : 'text-white hover:bg-zinc-700'}`}>{period} jours</Link>)}</nav>
    </section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Nouveaux comptes" value={data.current.accounts} previous={data.previous.accounts} detail="Inscriptions sur la période" />
      <Metric label="Publications" value={data.current.posts} previous={data.previous.posts} detail="Publications créées, masquées incluses" />
      <Metric label="Interactions" value={data.current.interactions} previous={data.previous.interactions} detail="Likes datés et commentaires conservés" />
      <Metric label="Contributeurs" value={data.contributors} previous={data.previousContributors} detail="Auteurs distincts ayant publié" />
    </div>
    <div className="grid gap-5 xl:grid-cols-3">
      <section className={`${panelClass} xl:col-span-2`} aria-labelledby="activity-title">
        <div className="flex flex-wrap justify-between gap-3"><div><h2 id="activity-title" className="text-lg font-bold">Activité de la communauté</h2><p className="text-sm text-muted-foreground">Du {shortDate(data.points[0].date)} au {shortDate(data.points.at(-1)!.date)} · journées UTC</p></div><div className="flex gap-4 text-sm"><span>● Publications</span><span className="text-[#41691d]">■ Interactions</span></div></div>
        <svg viewBox="0 0 680 260" className="mt-5 w-full" role="img" aria-labelledby="chart-title chart-description">
          <title id="chart-title">Publications et interactions sur {days} jours</title><desc id="chart-description">Les valeurs exactes sont disponibles dans le tableau sous le graphique.</desc>
          {[0, 1, 2, 3, 4].map((tick) => <g key={tick}><line x1="40" x2="670" y1={220 - tick * 50} y2={220 - tick * 50} stroke="#ccd9c7" /><text x="30" y={225 - tick * 50} textAnchor="end" fontSize="12" fill="#55645b">{number(ceiling * tick / 4)}</text></g>)}
          {buckets.map((point, index) => {
            const width = 620 / buckets.length
            const x = 45 + width * index
            return <g key={point.start}><rect x={x + width * .15} y={220 - point.posts / ceiling * 200} width={width * .27} height={point.posts / ceiling * 200} rx="3" fill="#173236" /><rect x={x + width * .48} y={220 - point.interactions / ceiling * 200} width={width * .27} height={point.interactions / ceiling * 200} rx="3" fill="#6d983b" /><text x={x + width * .45} y="246" textAnchor="middle" fontSize="12" fill="#55645b">{shortDate(point.start)}</text></g>
          })}
        </svg>
        <details className="mt-3 text-sm"><summary className="min-h-11 cursor-pointer py-3 font-semibold">Afficher les valeurs exactes</summary><div className="overflow-x-auto"><table className="w-full text-left tabular-nums"><caption className="sr-only">Activité par intervalle de {groupSize} jour(s)</caption><thead><tr><th scope="col" className="py-2">Période UTC</th><th scope="col">Publications</th><th scope="col">Interactions</th></tr></thead><tbody>{buckets.map((point) => <tr key={point.start} className="border-t border-border"><th scope="row" className="py-2 font-normal">{shortDate(point.start)}{point.start !== point.end && ` – ${shortDate(point.end)}`}</th><td>{number(point.posts)}</td><td>{number(point.interactions)}</td></tr>)}</tbody></table></div></details>
        <p className="mt-3 text-xs text-muted-foreground">Comparaison avec les {days} jours précédents. La journée en cours est partielle. Les contenus supprimés et likes retirés ne sont pas conservés dans ces statistiques.{data.undatedLikes > 0 && ` ${number(data.undatedLikes)} ancien(s) like(s) sans date sont exclus de l’historique.`}</p>
      </section>
      <section className={panelClass} aria-labelledby="community-title"><h2 id="community-title" className="text-lg font-bold">La communauté Spity</h2><p className="mt-4 text-4xl font-bold tabular-nums">{number(totalUsers)}</p><p className="text-sm text-muted-foreground">comptes au total, tous statuts</p><div className="mt-6 space-y-5">{(['grimpeur', 'club'] as const).map((role) => {
        const value = data.roles.find((row) => row.role === role)?.total ?? 0
        return <div key={role}><div className="flex justify-between text-sm"><span>{role === 'club' ? 'Clubs' : 'Grimpeurs'}</span><span className="font-semibold tabular-nums">{number(value)} · {totalUsers ? Math.round(value / totalUsers * 100) : 0} %</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary" aria-hidden="true"><div className="h-full rounded-full bg-primary" style={{ width: `${totalUsers ? value / totalUsers * 100 : 0}%` }} /></div></div>
      })}</div><p className="mt-7 border-t border-border pt-4 text-sm text-muted-foreground">{number(data.admins)} administrateur(s) · {number(data.totalPosts)} publication(s) conservée(s).</p></section>
    </div>
    <section className={panelClass}><h2 className="text-lg font-bold">Modération</h2><p className="mt-1 text-sm text-muted-foreground">Actions réversibles, avec motif et historique.</p><div className="mt-4 grid gap-3 md:grid-cols-3"><QuickLink href={adminHref({ view: 'accounts', status: 'restricted' })} value={data.suspended}>Comptes suspendus</QuickLink><QuickLink href={adminHref({ view: 'posts', status: 'restricted' })} value={data.hiddenPosts}>Publications masquées</QuickLink><QuickLink href={adminHref({ view: 'accounts' })} value={totalUsers}>Gérer les comptes</QuickLink></div></section>
    <div className="grid gap-5 lg:grid-cols-2">
      <section className={panelClass}><h2 className="text-lg font-bold">Dernières inscriptions</h2><ul className="mt-3 divide-y divide-border">{data.recentAccounts.map((account) => <li key={account.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span className="min-w-0 break-all font-medium">{account.email}</span><span className="text-muted-foreground">{dateTime(account.createdAt)}</span></li>)}</ul>{!data.recentAccounts.length && <p className="mt-4 text-sm">Aucun compte pour le moment.</p>}<Link className="mt-3 inline-block py-2 font-semibold underline" href={adminHref({ view: 'accounts' })}>Tous les comptes</Link></section>
      <section className={panelClass}><h2 className="text-lg font-bold">Dernières actions</h2><ul className="mt-3 divide-y divide-border">{data.recentActions.map((action) => <li key={action.id} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><span className="font-medium">{actionLabels[action.action]}</span><span className="text-muted-foreground">{dateTime(action.createdAt)}</span></li>)}</ul>{!data.recentActions.length && <p className="mt-4 text-sm">Aucune action de modération enregistrée.</p>}<Link className="mt-3 inline-block py-2 font-semibold underline" href={adminHref({ view: 'history' })}>Consulter l’historique</Link></section>
    </div>
  </div>
}
