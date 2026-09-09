import Link from 'next/link'
import { Button, Input } from '@/components/ui'
import { listAdminAccounts, listAdminHistory, listAdminPosts, PAGE_SIZE } from '../lib/repository'
import { actionLabels, adminHref, type AdminQuery } from '../schemas'
import { dateTime, number, panelClass } from './dashboard'
import ModerationButton from './moderation-button'

function Pagination({ query, total }: { query: AdminQuery; total: number }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  return <nav aria-label="Pagination" className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm"><p className="tabular-nums">{number(total)} résultat(s) · page {query.page} sur {pages}</p><div className="flex gap-3">{query.page > 1 && <Link className="spity-btn spity-btn--secondary" href={adminHref({ ...query, page: query.page - 1 })}>Précédente</Link>}{query.page < pages && <Link className="spity-btn spity-btn--secondary" href={adminHref({ ...query, page: query.page + 1 })}>Suivante</Link>}</div></nav>
}

function Filters({ query }: { query: AdminQuery }) {
  return <form action="/app/admin" className="my-5 grid items-end gap-3 sm:grid-cols-[1fr_auto_auto]">
    <input type="hidden" name="view" value={query.view} />
    <Input name="q" label={query.view === 'accounts' ? 'Rechercher un e-mail' : 'Rechercher dans les publications'} defaultValue={query.q} maxLength={100} type="search" />
    <div><label htmlFor="admin-status" className="mb-1.5 block text-sm font-medium">Statut</label><select id="admin-status" name="status" defaultValue={query.status} className="spity-input min-h-11"><option value="all">Tous les statuts</option><option value="active">{query.view === 'accounts' ? 'Actifs' : 'Visibles'}</option><option value="restricted">{query.view === 'accounts' ? 'Suspendus' : 'Masqués'}</option></select></div>
    <Button type="submit">Filtrer</Button>
  </form>
}

export default async function AdminManagement({ query }: { query: AdminQuery }) {
  if (query.view === 'accounts') {
    const data = await listAdminAccounts(query)
    return <section className={panelClass}><h2 className="text-xl font-bold">Comptes</h2><p className="mt-2 text-pretty text-sm text-muted-foreground">La suspension bloque l’accès sans supprimer de données. Les comptes administrateurs sont protégés ; aucun droit admin ne peut être accordé depuis cette page.</p><Filters query={query} /><div className="space-y-3">{data.rows.map((account) => <article key={account.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"><div className="min-w-0"><h3 className="break-all font-semibold">{account.email}</h3><p className="mt-1 text-sm text-muted-foreground">{account.role === 'club' ? 'Club' : 'Grimpeur'} · {account.isAdmin ? 'Administrateur' : account.isSuspended ? 'Suspendu' : 'Actif'}</p><p className="mt-1 text-xs text-muted-foreground">Inscrit le {dateTime(account.createdAt)}</p></div>{!account.isAdmin && <ModerationButton kind="users" id={account.id} restricted={account.isSuspended} label={account.email} />}</article>)}</div>{!data.rows.length && <p className="py-8 text-center text-muted-foreground">Aucun compte ne correspond à ces filtres.</p>}<Pagination query={query} total={data.total} /></section>
  }
  if (query.view === 'posts') {
    const data = await listAdminPosts(query)
    return <section className={panelClass}><h2 className="text-xl font-bold">Publications</h2><p className="mt-2 text-sm text-muted-foreground">Les publications masquées sont retirées du fil et des profils publics. Leurs données sont conservées pour permettre une restauration.</p><Filters query={query} /><div className="space-y-3">{data.rows.map((post) => <article key={post.id} className="rounded-lg border border-border p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h3 className="break-all font-semibold">{post.email}</h3><p className="mt-1 text-xs text-muted-foreground">{dateTime(post.createdAt)} · {post.isHidden ? 'Masquée' : 'Visible'}</p></div><ModerationButton kind="posts" id={post.id} restricted={post.isHidden} label={`Publication de ${post.email}`} /></div><p className="mt-4 whitespace-pre-wrap break-words text-pretty text-sm">{post.content || 'Publication sans texte'}</p></article>)}</div>{!data.rows.length && <p className="py-8 text-center text-muted-foreground">Aucune publication ne correspond à ces filtres.</p>}<Pagination query={query} total={data.total} /></section>
  }
  const data = await listAdminHistory(query.page)
  return <section className={panelClass}><h2 className="text-xl font-bold">Historique de modération</h2><p className="mt-2 text-sm text-muted-foreground">Journal des actions administratives. Horaires de Paris. Les identifiants de cible restent consultables après suppression d’un contenu.</p><ol className="mt-5 space-y-3">{data.rows.map((entry) => <li key={entry.id} className="rounded-lg border border-border p-4"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{actionLabels[entry.action]}</h3><time dateTime={entry.createdAt.toISOString()} className="text-sm text-muted-foreground">{dateTime(entry.createdAt)}</time></div><p className="mt-2 break-all text-sm">Par {entry.actor ?? 'Opération serveur / compte supprimé'}</p><p className="mt-1 break-all text-xs text-muted-foreground">Cible : {entry.targetId}</p><p className="mt-3 whitespace-pre-wrap break-words text-pretty text-sm">{entry.reason}</p></li>)}</ol>{!data.rows.length && <p className="py-8 text-center text-muted-foreground">Aucune action enregistrée pour le moment.</p>}<Pagination query={query} total={data.total} /></section>
}
