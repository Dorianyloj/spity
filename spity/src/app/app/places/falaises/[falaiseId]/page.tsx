import { desc, eq } from 'drizzle-orm'
import { AlertTriangle, ArrowLeft, Clock, MapPin, Mountain, ParkingCircle, Route, ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { falaises, placePhotos, placeReports, users, voies } from '@/db/schema'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import AppShell from '@/features/app/components/app-shell'
import CragContributionActions from '@/features/places/components/crag-contribution-actions'
import { conditionStateLabels, parseConditionReport } from '@/features/places/lib/crag-reports'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'

type CragDetailPageProps = {
  params: Promise<{
    falaiseId: string
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

const routeStatusLabels = {
  ok: 'OK',
  humide: 'Humide',
  spit_a_verifier: 'Spit à vérifier',
  fermee: 'Fermée',
} as const

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

export default async function CragDetailPage({ params }: CragDetailPageProps) {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const { falaiseId } = await params
  const [falaise] = await db.select().from(falaises).where(eq(falaises.id, falaiseId)).limit(1)

  if (!falaise) {
    notFound()
  }

  const [routeRows, reportRows, galleryRows] = await Promise.all([
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
  ])
  const niveaux = parseStringArray(falaise.niveaux)
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
                <a className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-[#c8ef4e]" href="#contribuer">Ajouter une voie ou l’état</a>
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            {currentProfile.user.role === 'grimpeur' && <section id="contribuer">
              <CragContributionActions falaiseId={falaise.id} falaiseName={falaise.nom} />
            </section>}

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Voies</CardTitle>
                <CardDescription>Cotations, secteurs, hauteur et état communautaire.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {routeRows.map((routeRow) => {
                  const votes = parseNumberRecord(routeRow.etatVotes)

                  return (
                    <article key={routeRow.id} className="rounded-lg border border-border bg-white/[0.03] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="flex items-center gap-2 font-bold text-foreground">
                            <Route className="text-primary" size={18} />
                            {routeRow.nom}
                          </h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {routeRow.secteur ?? 'Secteur à préciser'} · {routeRow.style ?? 'style à préciser'}
                          </p>
                        </div>
                        <Badge variant="primary">{routeRow.cotation}</Badge>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                        <span>{routeRow.hauteur ?? '?'} m</span>
                        <span>{routeRow.degaines ?? '?'} dégaines</span>
                        <span>{routeRow.status ? routeStatusLabels[routeRow.status] : 'État à confirmer'}</span>
                        <span>{Object.values(votes).reduce((total, vote) => total + vote, 0)} votes état</span>
                      </div>
                    </article>
                  )
                })}
                {routeRows.length === 0 && <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground md:col-span-2">
                  Pas encore de voie répertoriée. Ajoute la première juste au-dessus.
                </p>}
              </CardContent>
            </Card>

            {galleryRows.length > 0 && <Card hover={false}>
              <CardHeader>
                <CardTitle>Photos de la communauté</CardTitle>
                <CardDescription>Photos proposées par des grimpeurs et validées par Spity.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {galleryRows.map((photo, index) => <li className="relative aspect-video overflow-hidden rounded-lg border border-border" key={photo.id}>
                    <Image alt={`Photo ${index + 1} de ${falaise.nom}`} className="object-cover" fill sizes="(min-width: 768px) 45vw, 100vw" src={`/api/place-media/${photo.mediaId}`} unoptimized />
                  </li>)}
                </ul>
              </CardContent>
            </Card>}

            <Card hover={false}>
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
            </Card>
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
                    <div className="mt-2 flex flex-wrap gap-2">
                      {niveaux.map((niveau) => (
                        <Badge key={niveau} variant="secondary">{niveau}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                {(falaise.rockType || falaise.rainExposure || falaise.sunlight || disciplines.length > 0) && <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Mountain className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Terrain</p>
                    <p className="mt-1 text-muted-foreground">{disciplines.join(', ') || 'Pratique à préciser'} · {falaise.rockType ? rockLabels[falaise.rockType] : 'roche à préciser'}</p>
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
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
