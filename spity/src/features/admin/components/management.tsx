import Link from 'next/link'
import Image from 'next/image'
import { Badge, Button, Input } from '@/components/ui'
import { disciplineLabels, orientationLabels, rockTypeLabels, seasonLabels } from '@/features/places/schemas'
import { listAdminAccounts, listAdminHistory, listAdminPlaceRequests, listAdminPosts, PAGE_SIZE } from '../lib/repository'
import { actionLabels, adminHref, type AdminQuery } from '../schemas'
import { dateTime, number, panelClass } from './dashboard'
import ModerationButton from './moderation-button'
import PlaceReviewButton from './place-review-button'

function Pagination({ query, total }: { query: AdminQuery; total: number }) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  return <nav aria-label="Pagination" className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-sm"><p className="tabular-nums">{number(total)} résultat(s) · page {query.page} sur {pages}</p><div className="flex gap-3">{query.page > 1 && <Link className="spity-btn spity-btn--secondary" href={adminHref({ ...query, page: query.page - 1 })}>Précédente</Link>}{query.page < pages && <Link className="spity-btn spity-btn--secondary" href={adminHref({ ...query, page: query.page + 1 })}>Suivante</Link>}</div></nav>
}

function Filters({ query }: { query: AdminQuery }) {
  const searchLabel = query.view === 'accounts'
    ? 'Rechercher un e-mail'
    : query.view === 'places'
      ? 'Rechercher un lieu, une ville ou un e-mail'
      : 'Rechercher dans les publications'
  const selectedStatus = query.view === 'places'
    ? ['pending', 'approved', 'rejected'].includes(query.status) ? query.status : 'all'
    : ['active', 'restricted'].includes(query.status) ? query.status : 'all'

  return <form action="/app/admin" className="my-5 grid items-end gap-3 sm:grid-cols-[1fr_auto_auto]">
    <input type="hidden" name="view" value={query.view} />
    <Input name="q" label={searchLabel} defaultValue={query.q} maxLength={100} type="search" />
    <div>
      <label htmlFor="admin-status" className="mb-1.5 block text-sm font-medium">Statut</label>
      <select id="admin-status" name="status" defaultValue={selectedStatus} className="spity-input min-h-11">
        <option value="all">Tous les statuts</option>
        {query.view === 'places' ? <>
          <option value="pending">À valider</option>
          <option value="approved">Validés</option>
          <option value="rejected">Refusés</option>
        </> : <>
          <option value="active">{query.view === 'accounts' ? 'Actifs' : 'Visibles'}</option>
          <option value="restricted">{query.view === 'accounts' ? 'Suspendus' : 'Masqués'}</option>
        </>}
      </select>
    </div>
    <Button type="submit">Filtrer</Button>
  </form>
}

const storedArray = (value: unknown) => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')
  if (typeof value !== 'string') return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

const listLabels = (value: unknown, labels: Record<string, string>) => storedArray(value).map((item) => labels[item] ?? item).join(', ')

export default async function AdminManagement({ query }: { query: AdminQuery }) {
  if (query.view === 'accounts') {
    const data = await listAdminAccounts(query)
    return <section className={panelClass}><h2 className="text-xl font-bold">Comptes</h2><p className="mt-2 text-pretty text-sm text-muted-foreground">La suspension bloque l’accès sans supprimer de données. Les comptes administrateurs sont protégés ; aucun droit admin ne peut être accordé depuis cette page.</p><Filters query={query} /><div className="space-y-3">{data.rows.map((account) => <article key={account.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"><div className="min-w-0"><h3 className="break-all font-semibold">{account.email}</h3><p className="mt-1 text-sm text-muted-foreground">{account.role === 'club' ? 'Club' : 'Grimpeur'} · {account.isAdmin ? 'Administrateur' : account.isSuspended ? 'Suspendu' : 'Actif'}</p><p className="mt-1 text-xs text-muted-foreground">Inscrit le {dateTime(account.createdAt)}</p></div>{!account.isAdmin && <ModerationButton kind="users" id={account.id} restricted={account.isSuspended} label={account.email} />}</article>)}</div>{!data.rows.length && <p className="py-8 text-center text-muted-foreground">Aucun compte ne correspond à ces filtres.</p>}<Pagination query={query} total={data.total} /></section>
  }
  if (query.view === 'posts') {
    const data = await listAdminPosts(query)
    return <section className={panelClass}><h2 className="text-xl font-bold">Publications</h2><p className="mt-2 text-sm text-muted-foreground">Les publications masquées sont retirées du fil et des profils publics. Leurs données sont conservées pour permettre une restauration.</p><Filters query={query} /><div className="space-y-3">{data.rows.map((post) => <article key={post.id} className="rounded-lg border border-border p-4"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h3 className="break-all font-semibold">{post.email}</h3><p className="mt-1 text-xs text-muted-foreground">{dateTime(post.createdAt)} · {post.isHidden ? 'Masquée' : 'Visible'}</p></div><ModerationButton kind="posts" id={post.id} restricted={post.isHidden} label={`Publication de ${post.email}`} /></div><p className="mt-4 whitespace-pre-wrap break-words text-pretty text-sm">{post.content || 'Publication sans texte'}</p></article>)}</div>{!data.rows.length && <p className="py-8 text-center text-muted-foreground">Aucune publication ne correspond à ces filtres.</p>}<Pagination query={query} total={data.total} /></section>
  }
  if (query.view === 'places') {
    const data = await listAdminPlaceRequests(query)
    const status = {
      pending: { label: 'À valider', variant: 'warning' as const },
      approved: { label: 'Validé', variant: 'success' as const },
      rejected: { label: 'Refusé', variant: 'destructive' as const },
    }

    return <section className={panelClass}>
      <h2 className="text-xl font-bold">Demandes de lieux</h2>
      <Filters query={query} />
      <div className="space-y-4">
        {data.rows.map(({ request, authorEmail }) => {
          const currentStatus = status[request.status]
          const disciplines = listLabels(request.disciplines, disciplineLabels)
          const seasons = listLabels(request.seasons, seasonLabels)
          const orientations = listLabels(request.orientations, orientationLabels)
          const services = storedArray(request.services).join(', ')
          const siteMapUrl = `https://www.openstreetmap.org/?mlat=${request.latitude}&mlon=${request.longitude}#map=16/${request.latitude}/${request.longitude}`
          const parkingMapUrl = request.parkingLatitude !== null && request.parkingLongitude !== null
            ? `https://www.openstreetmap.org/?mlat=${request.parkingLatitude}&mlon=${request.parkingLongitude}#map=17/${request.parkingLatitude}/${request.parkingLongitude}`
            : null

          return <article className="rounded-lg border border-border p-4 sm:p-5" key={request.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-balance">{request.name}</h3>
                  <Badge variant="secondary">{request.kind === 'salle' ? 'Salle' : 'Falaise'}</Badge>
                  <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{request.city} · {request.department} · {request.region}</p>
                <p className="mt-1 break-all text-xs text-muted-foreground">Par {authorEmail} · {dateTime(request.createdAt)}</p>
              </div>
              {request.status === 'pending' && <div className="flex flex-wrap gap-2">
                <PlaceReviewButton decision="reject" id={request.id} name={request.name} />
                <PlaceReviewButton decision="approve" id={request.id} name={request.name} />
              </div>}
            </div>
            {request.photoMediaId && (
              <div className="relative mt-4 aspect-video max-h-80 overflow-hidden rounded-lg border border-border">
                <Image
                  alt={`Photo proposée pour ${request.name}`}
                  className="object-cover"
                  fill
                  sizes="(min-width: 1280px) 900px, 100vw"
                  src={`/api/admin/place-media/${request.photoMediaId}`}
                  unoptimized
                />
              </div>
            )}
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div><dt className="font-semibold">Disciplines</dt><dd className="text-muted-foreground">{disciplines || 'Non renseignées'}</dd></div>
              {request.kind === 'salle' ? <>
                <div><dt className="font-semibold">Adresse</dt><dd className="text-muted-foreground">{request.address}</dd></div>
                <div><dt className="font-semibold">Services</dt><dd className="text-muted-foreground">{services || 'Aucun'}</dd></div>
              </> : <>
                <div><dt className="font-semibold">Roche</dt><dd className="text-muted-foreground">{request.rockType ? rockTypeLabels[request.rockType] : 'Non renseignée'}</dd></div>
                <div><dt className="font-semibold">Saisons</dt><dd className="text-muted-foreground">{seasons}</dd></div>
                <div><dt className="font-semibold">Orientations</dt><dd className="text-muted-foreground">{orientations}</dd></div>
                <div><dt className="font-semibold">Approche</dt><dd className="text-muted-foreground">{request.approach || 'Non renseignée'}</dd></div>
                <div><dt className="font-semibold">Parking</dt><dd className="text-muted-foreground">{request.parking || 'Non renseigné'}</dd></div>
              </>}
            </dl>
            {(request.access || request.restrictions || request.notes) && <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-pretty">
              {request.access && <p><strong>Accès :</strong> {request.access}</p>}
              {request.restrictions && <p><strong>Restrictions :</strong> {request.restrictions}</p>}
              {request.notes && <p><strong>Notes :</strong> {request.notes}</p>}
            </div>}
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <a href={siteMapUrl} target="_blank" rel="noreferrer" className="underline">Voir le lieu sur la carte</a>
              {parkingMapUrl && <a href={parkingMapUrl} target="_blank" rel="noreferrer" className="underline">Voir le parking</a>}
              {request.sourceUrl && <a href={request.sourceUrl} target="_blank" rel="noreferrer" className="underline">Voir la source</a>}
            </div>
            {request.reviewReason && <p className="mt-4 rounded-lg bg-secondary p-3 text-sm"><strong>Décision :</strong> {request.reviewReason}</p>}
          </article>
        })}
      </div>
      {!data.rows.length && <p className="py-8 text-center text-muted-foreground">Aucune demande de lieu.</p>}
      <Pagination query={query} total={data.total} />
    </section>
  }
  const data = await listAdminHistory(query.page)
  return <section className={panelClass}><h2 className="text-xl font-bold">Historique de modération</h2><p className="mt-2 text-sm text-muted-foreground">Journal des actions administratives. Horaires de Paris. Les identifiants de cible restent consultables après suppression d’un contenu.</p><ol className="mt-5 space-y-3">{data.rows.map((entry) => <li key={entry.id} className="rounded-lg border border-border p-4"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{actionLabels[entry.action]}</h3><time dateTime={entry.createdAt.toISOString()} className="text-sm text-muted-foreground">{dateTime(entry.createdAt)}</time></div><p className="mt-2 break-all text-sm">Par {entry.actor ?? 'Opération serveur / compte supprimé'}</p><p className="mt-1 break-all text-xs text-muted-foreground">Cible : {entry.targetId}</p><p className="mt-3 whitespace-pre-wrap break-words text-pretty text-sm">{entry.reason}</p></li>)}</ol>{!data.rows.length && <p className="py-8 text-center text-muted-foreground">Aucune action enregistrée pour le moment.</p>}<Pagination query={query} total={data.total} /></section>
}
