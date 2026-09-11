import { desc, eq } from 'drizzle-orm'
import { AlertTriangle, ArrowLeft, Clock, ExternalLink, FileDown, FileText, MapPin, Mountain, ParkingCircle, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { cragTopos, falaises, placePhotos, placeReports, users, voies } from '@/db/schema'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import AppShell from '@/features/app/components/app-shell'
import CragContributionActions from '@/features/places/components/crag-contribution-actions'
import CragRouteList from '@/features/places/components/crag-route-list'
import PlaceSectionMenu from '@/features/places/components/place-section-menu'
import { conditionStateLabels, parseConditionReport } from '@/features/places/lib/crag-reports'
import { formatGradeRange } from '@/features/places/lib/grade-range'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'
import { getClimbingDisciplineLabel } from '@/lib/climbing-disciplines'

type CragDetailPageProps = {
  params: Promise<{
    falaiseId: string
  }>
  searchParams: Promise<{
    section?: string
  }>
}

export const metadata: Metadata = {
  title: 'Fiche falaise - Spity',
  description: 'Détail d’une falaise, voies et signalements Spity.',
}

const parseStringArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value !== 'string') {
    return []
  }

  try {
    const parsedValue: unknown = JSON.parse(value)

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

const parseNumberRecord = (value: unknown) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value).filter((entry): entry is [string, number] => typeof entry[1] === 'number')
    )
  }

  if (typeof value !== 'string') {
    return {}
  }

  try {
    const parsedValue: unknown = JSON.parse(value)

    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)
      ? Object.fromEntries(
          Object.entries(parsedValue).filter((entry): entry is [string, number] => typeof entry[1] === 'number')
        )
      : {}
  } catch {
    return {}
  }
}

const reportTypeLabels = {
  condition: 'Condition',
  access: 'Accès',
  safety: 'Sécurité',
  info: 'Info',
} as const

const seasonLabels: Record<string, string> = {
  printemps: 'Printemps',
  ete: 'Été',
  automne: 'Automne',
  hiver: 'Hiver',
}

const rockLabels: Record<string, string> = {
  calcaire: 'Calcaire', gres: 'Grès', granite: 'Granite', gneiss: 'Gneiss', schiste: 'Schiste', conglomerat: 'Conglomérat', volcanique: 'Volcanique', autre: 'Autre',
}

const rainLabels: Record<string, string> = { abrite: 'abrité', partiellement_abrite: 'partiellement abrité', expose: 'exposé' }
const sunlightLabels: Record<string, string> = { ombrage: 'ombragé', mixte: 'mixte', ensoleille: 'ensoleillé' }
const formatFileSize = (bytes: number | null) => bytes === null ? '' : `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} Mio`

export default async function CragDetailPage({ params, searchParams }: CragDetailPageProps) {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const { falaiseId } = await params
  const { section: requestedSection } = await searchParams
  const [falaise] = await db.select().from(falaises).where(eq(falaises.id, falaiseId)).limit(1)

  if (!falaise) {
    notFound()
  }

  const [routeRows, reportRows, galleryRows, topoRows] = await Promise.all([
    db.select().from(voies).where(eq(voies.falaiseId, falaise.id)),
    db
      .select({
        id: placeReports.id,
        type: placeReports.type,
        status: placeReports.status,
        message: placeReports.message,
        createdAt: placeReports.createdAt,
        authorEmail: users.email,
      })
      .from(placeReports)
      .innerJoin(users, eq(placeReports.authorId, users.id))
      .where(eq(placeReports.falaiseId, falaise.id))
      .orderBy(desc(placeReports.createdAt)),
    db.select({ id: placePhotos.id, mediaId: placePhotos.mediaId }).from(placePhotos).where(eq(placePhotos.falaiseId, falaise.id)),
    db
      .select({
        id: cragTopos.id,
        kind: cragTopos.kind,
        title: cragTopos.title,
        externalUrl: cragTopos.externalUrl,
        byteSize: cragTopos.byteSize,
      })
      .from(cragTopos)
      .where(eq(cragTopos.falaiseId, falaise.id))
      .orderBy(desc(cragTopos.createdAt)),
  ])
  const niveaux = parseStringArray(falaise.niveaux)
  const gradeRange = formatGradeRange(routeRows.map((route) => route.cotation))
    ?? formatGradeRange(niveaux)
  const saisons = parseStringArray(falaise.saison)
  const disciplines = parseStringArray(falaise.disciplines)
  const orientations = parseStringArray(falaise.orientations)
  const photoUrl = falaise.photoUrl ?? brandAssets.crag
  const reports = reportRows.map((report) => ({
    ...report,
    condition: report.type === 'condition' ? parseConditionReport(report.message) : null,
  }))
  const latestCondition = reports.find((report) => report.status === 'open' && report.condition?.state)
  const currentState = latestCondition?.condition?.state ?? falaise.status
  const openAlerts = reports.filter((report) => report.type !== 'condition' && report.status === 'open')
  const availableSections = currentProfile.user.role === 'grimpeur'
    ? ['routes', 'photos', 'reports', 'contribute']
    : ['routes', 'photos', 'reports']
  const activeSection = availableSections.includes(requestedSection ?? '') ? requestedSection! : 'routes'

  return (
    <AppShell activeItem="places" user={currentProfile.user}>
      <div className="space-y-6">
        <Link href="/app/places" className="inline-flex items-center gap-2 text-sm font-semibold text-white/[0.76] hover:text-white">
          <ArrowLeft size={16} />
          Retour aux lieux
        </Link>

        <section
          className="overflow-hidden rounded-lg border border-white/10 bg-cover bg-center p-6 shadow-2xl shadow-black/20 md:p-8"
          style={{ backgroundImage: makePanelBackground(photoUrl) }}
        >
          <Badge className="bg-[#8bb957] text-[#173236]" variant="default">
            Falaise
          </Badge>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="text-4xl font-black text-white md:text-5xl">{falaise.nom}</h1>
              <p className="mt-3 flex items-center gap-2 text-white/[0.76]">
                <MapPin size={18} />
                {falaise.location}
              </p>
              <p className="mt-4 max-w-2xl text-white/[0.76]">
                {falaise.acces ?? 'Accès à compléter par la communauté.'}
              </p>
              {currentProfile.user.role === 'grimpeur' && <div className="mt-5 flex flex-wrap gap-3">
                <Link className="inline-flex min-h-11 items-center rounded-lg border border-white/30 bg-black/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/10" href={`/app/places/falaises/${falaise.id}/contribute`}>Corriger la fiche / photos</Link>
              </div>}
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-[#173236]/60 p-3 backdrop-blur">
              <div>
                <p className="text-2xl font-black text-[#8bb957]">{routeRows.length}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">voies</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#8bb957]">{openAlerts.length}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">alertes ouvertes</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#8bb957]">{currentState ? conditionStateLabels[currentState] : 'N/A'}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">état</p>
              </div>
            </div>
          </div>
        </section>

        <PlaceSectionMenu activeSection={activeSection as 'routes' | 'photos' | 'reports' | 'contribute'} sections={[
          { href: '?section=routes', label: 'Voies', section: 'routes' },
          { href: '?section=photos', label: 'Photos', section: 'photos' },
          { href: '?section=reports', label: 'Signalements', section: 'reports' },
          ...(currentProfile.user.role === 'grimpeur' ? [{ href: '?section=contribute', label: 'Contribuer', section: 'contribute' as const }] : []),
        ]} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            {activeSection === 'contribute' && currentProfile.user.role === 'grimpeur' && <section id="contribuer">
              <CragContributionActions falaiseId={falaise.id} falaiseName={falaise.nom} />
            </section>}

            {activeSection === 'routes' && <Card hover={false} id="voies">
              <CardHeader>
                <CardTitle>Voies</CardTitle>
                <CardDescription>Recherche, filtres et état communautaire, sans surcharge visuelle.</CardDescription>
              </CardHeader>
              <CardContent>
                <CragRouteList routes={routeRows.map((routeRow) => ({
                  id: routeRow.id,
                  nom: routeRow.nom,
                  discipline: routeRow.discipline,
                  cotation: routeRow.cotation,
                  secteur: routeRow.secteur,
                  style: routeRow.style,
                  hauteur: routeRow.hauteur,
                  degaines: routeRow.degaines,
                  status: routeRow.status,
                  voteCount: Object.values(parseNumberRecord(routeRow.etatVotes)).reduce((total, vote) => total + vote, 0),
                }))} />
              </CardContent>
            </Card>}

            {activeSection === 'photos' && <Card hover={false} id="photos">
              <CardHeader>
                <CardTitle>Photos de la communauté</CardTitle>
                <CardDescription>Photos proposées par des grimpeurs et validées par Spity.</CardDescription>
              </CardHeader>
              <CardContent>
                {galleryRows.length > 0 ? <ul className="grid gap-3 sm:grid-cols-2">
                  {galleryRows.map((photo, index) => <li className="relative aspect-video overflow-hidden rounded-lg border border-border" key={photo.id}>
                    <Image alt={`Photo ${index + 1} de ${falaise.nom}`} className="object-cover" fill sizes="(min-width: 768px) 45vw, 100vw" src={`/api/place-media/${photo.mediaId}`} unoptimized />
                  </li>)}
                </ul> : <p className="text-pretty text-sm text-muted-foreground">
                  Pas encore de photo partagée.{currentProfile.user.role === 'grimpeur' && <> <Link className="font-semibold text-foreground underline underline-offset-4" href={`/app/places/falaises/${falaise.id}/contribute`}>Ajouter la première.</Link></>}
                </p>}
              </CardContent>
            </Card>}

            {activeSection === 'reports' && <Card hover={false} id="signalements">
              <CardHeader>
                <CardTitle>Signalements</CardTitle>
                <CardDescription>Informations temps réel pour préparer la sortie.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reports.map((report) => (
                  <article key={report.id} className="rounded-lg border border-border bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-primary" size={18} />
                        <h2 className="font-bold text-foreground">{reportTypeLabels[report.type]}</h2>
                        {report.condition?.state && <Badge variant="secondary">{conditionStateLabels[report.condition.state]}</Badge>}
                      </div>
                      <Badge variant={report.status === 'open' ? 'warning' : 'success'}>
                        {report.status === 'open' ? 'Ouvert' : 'Résolu'}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{report.condition?.message ?? report.message}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Signalé par {report.authorEmail} · {report.createdAt.toLocaleDateString('fr-FR')}
                    </p>
                  </article>
                ))}
                {reports.length === 0 && (
                  <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                    Aucun signalement pour cette falaise.
                  </p>
                )}
              </CardContent>
            </Card>}
          </section>

          <aside className="space-y-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Infos pratiques</CardTitle>
                <CardDescription>Les données utiles avant de partir.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Mountain className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Niveaux</p>
                    {gradeRange
                      ? <Badge className="mt-2 tabular-nums" variant="secondary">{gradeRange}</Badge>
                      : <p className="mt-1 text-muted-foreground">À compléter</p>}
                  </div>
                </div>
                {(falaise.rockType || falaise.rainExposure || falaise.sunlight || disciplines.length > 0) && <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Mountain className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Terrain</p>
                    <p className="mt-1 text-muted-foreground">{disciplines.map(getClimbingDisciplineLabel).join(', ') || 'Pratique à préciser'} · {falaise.rockType ? rockLabels[falaise.rockType] : 'roche à préciser'}</p>
                    <p className="mt-1 text-muted-foreground">{falaise.rainExposure ? `Pluie : ${rainLabels[falaise.rainExposure]}` : 'Exposition à la pluie à préciser'} · {falaise.sunlight ? sunlightLabels[falaise.sunlight] : 'ensoleillement à préciser'}</p>
                  </div>
                </div>}
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Clock className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Approche</p>
                    <p className="mt-1 text-muted-foreground">{falaise.approche ?? 'À compléter'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <ParkingCircle className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Parking</p>
                    <p className="mt-1 text-muted-foreground">{falaise.parking ?? 'À compléter'}</p>
                    {falaise.parkingLatitude !== null && falaise.parkingLongitude !== null && (
                      <a
                        className="mt-2 inline-block font-semibold text-foreground underline"
                        href={`https://www.openstreetmap.org/?mlat=${falaise.parkingLatitude}&mlon=${falaise.parkingLongitude}#map=17/${falaise.parkingLatitude}/${falaise.parkingLongitude}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Voir sur la carte
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <ShieldCheck className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Saison et orientation</p>
                    <p className="mt-1 text-muted-foreground">
                      {saisons.map((saison) => seasonLabels[saison] ?? saison).join(', ') || 'Saison à préciser'} · {orientations.join(', ') || falaise.orientation || 'orientation à préciser'}
                    </p>
                  </div>
                </div>
                {(falaise.restrictions || falaise.notes) && <div className="rounded-lg border border-border p-3">
                  <p className="font-semibold text-foreground">À savoir</p>
                  {falaise.restrictions && <p className="mt-1 text-muted-foreground">{falaise.restrictions}</p>}
                  {falaise.notes && <p className="mt-2 text-muted-foreground">{falaise.notes}</p>}
                </div>}
              </CardContent>
            </Card>
            {activeSection === 'routes' && <Card hover={false}>
              <CardHeader>
                <CardTitle className="text-balance">Topos</CardTitle>
                <CardDescription className="text-pretty">Liens et PDF partagés par la communauté.</CardDescription>
              </CardHeader>
              <CardContent>
                {topoRows.length > 0 ? <ul className="space-y-2">
                  {topoRows.map((topo) => <li key={topo.id}>
                    {topo.kind === 'link' && topo.externalUrl
                      ? <a className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 font-semibold text-foreground hover:border-primary/50" href={topo.externalUrl} rel="noreferrer" target="_blank">
                        <span className="flex min-w-0 items-center gap-2"><ExternalLink className="shrink-0 text-primary" size={17} /><span className="truncate">{topo.title}</span></span>
                        <span className="shrink-0 text-xs text-muted-foreground">Ouvrir</span>
                      </a>
                      : <a className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 font-semibold text-foreground hover:border-primary/50" href={`/api/place-topos/${topo.id}`}>
                        <span className="flex min-w-0 items-center gap-2"><FileText className="shrink-0 text-primary" size={17} /><span className="truncate">{topo.title}</span></span>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><FileDown size={14} />{formatFileSize(topo.byteSize) || 'PDF'}</span>
                      </a>}
                  </li>)}
                </ul> : <p className="text-pretty text-sm text-muted-foreground">
                  Pas encore de topo partagé.{currentProfile.user.role === 'grimpeur' && <> <Link className="font-semibold text-foreground underline underline-offset-4" href="?section=contribute">Ajouter le premier.</Link></>}
                </p>}
              </CardContent>
            </Card>}
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
