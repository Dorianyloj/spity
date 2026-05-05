import { eq } from 'drizzle-orm'
import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  CalendarDays,
  Clock,
  Dumbbell,
  ExternalLink,
  MapPin,
  Route,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { medias, placeReports, posts, salles, users } from '@/db/schema'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import AppShell from '@/features/app/components/app-shell'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'

type GymDetailPageProps = {
  params: Promise<{
    salleId: string
  }>
}

export const metadata: Metadata = {
  title: 'Fiche salle - Spity',
  description: 'Détail d’une salle, services, publications et signalements Spity.',
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

const parseStringRecord = (value: unknown) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    )
  }

  if (typeof value !== 'string') {
    return {}
  }

  try {
    const parsedValue: unknown = JSON.parse(value)

    return parsedValue && typeof parsedValue === 'object' && !Array.isArray(parsedValue)
      ? Object.fromEntries(
          Object.entries(parsedValue).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
        )
      : {}
  } catch {
    return {}
  }
}

const disciplineLabels: Record<string, string> = {
  bloc: 'Bloc',
  voie: 'Voie',
  trad: 'Trad',
}

const frequentationLabels = {
  calme: 'Calme',
  moderee: 'Modérée',
  elevee: 'Élevée',
} as const

const reportTypeLabels = {
  condition: 'Condition',
  access: 'Accès',
  safety: 'Sécurité',
  info: 'Info',
} as const

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default async function GymDetailPage({ params }: GymDetailPageProps) {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const { salleId } = await params
  const [salle] = await db.select().from(salles).where(eq(salles.id, salleId)).limit(1)

  if (!salle) {
    notFound()
  }

  const [reportRows, postRows] = await Promise.all([
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
      .where(eq(placeReports.salleId, salle.id)),
    db
      .select({
        id: posts.id,
        contenu: posts.contenu,
        cotation: posts.cotation,
        isStory: posts.isStory,
        createdAt: posts.createdAt,
        authorEmail: users.email,
        mediaUrl: medias.url,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .leftJoin(medias, eq(medias.postId, posts.id))
      .where(eq(posts.salleId, salle.id)),
  ])
  const disciplines = parseStringArray(salle.disciplines)
  const horaires = parseStringRecord(salle.horaires)
  const tarifs = parseStringRecord(salle.tarifs)
  const services = parseStringArray(salle.services)
  const photoUrl = salle.photoUrl ?? brandAssets.indoor

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
          <Badge className="bg-[#f4a261] text-[#050a2a]" variant="default">
            Salle
          </Badge>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div>
              <h1 className="text-4xl font-black text-white md:text-5xl">{salle.nom}</h1>
              <p className="mt-3 flex items-center gap-2 text-white/[0.76]">
                <MapPin size={18} />
                {salle.location}
              </p>
              <p className="mt-4 max-w-2xl text-white/[0.76]">{salle.adresse}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-[#050a2a]/60 p-3 backdrop-blur">
              <div>
                <p className="text-2xl font-black text-[#f4a261]">{disciplines.length}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">pratiques</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#f4a261]">{services.length}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">services</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#f4a261]">{reportRows.length}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">alertes</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Expérience salle</CardTitle>
                <CardDescription>Disciplines, niveaux et services utiles avant la session.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <article className="rounded-lg border border-border bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Route className="text-primary" size={18} />
                    Disciplines
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {disciplines.map((discipline) => (
                      <Badge key={discipline} variant="secondary">
                        {disciplineLabels[discipline] ?? discipline}
                      </Badge>
                    ))}
                  </div>
                </article>
                <article className="rounded-lg border border-border bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <Dumbbell className="text-primary" size={18} />
                    Niveaux
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    De {salle.niveauMin ?? '4a'} à {salle.niveauMax ?? '8a'}
                  </p>
                </article>
                <article className="rounded-lg border border-border bg-white/[0.03] p-4 md:col-span-2">
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <ShieldCheck className="text-primary" size={18} />
                    Services
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </article>
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Activité de la communauté</CardTitle>
                <CardDescription>Posts reliés à cette salle pour préparer ou rejoindre une session.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {postRows.map((post) => (
                  <article key={post.id} className="overflow-hidden rounded-lg border border-border bg-white/[0.03]">
                    {post.mediaUrl && (
                      <div
                        className="h-36 bg-cover bg-center"
                        style={{ backgroundImage: makePanelBackground(post.mediaUrl) }}
                        aria-hidden="true"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">{post.authorEmail}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.cotation && <Badge variant="primary">{post.cotation}</Badge>}
                          {post.isStory && <Badge variant="secondary">Story</Badge>}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{post.contenu ?? 'Publication sans contenu.'}</p>
                      <p className="mt-3 text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                    </div>
                  </article>
                ))}
                {postRows.length === 0 && (
                  <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                    Aucune publication rattachée à cette salle.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Infos pratiques</CardTitle>
                <CardDescription>Horaires, tarifs et fréquentation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Clock className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Horaires</p>
                    <p className="mt-1 text-muted-foreground">Semaine : {horaires.semaine ?? 'À compléter'}</p>
                    <p className="mt-1 text-muted-foreground">Week-end : {horaires.weekEnd ?? 'À compléter'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Banknote className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Tarifs</p>
                    <p className="mt-1 text-muted-foreground">Entrée : {tarifs.entree ?? 'À compléter'}</p>
                    <p className="mt-1 text-muted-foreground">Abonnement : {tarifs.abonnement ?? 'À compléter'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <UsersRound className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Fréquentation</p>
                    <p className="mt-1 text-muted-foreground">
                      {salle.frequentation ? frequentationLabels[salle.frequentation] : 'À préciser'}
                    </p>
                  </div>
                </div>
                {salle.siteWeb && (
                  <Link
                    href={salle.siteWeb}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-[#e76f51]"
                  >
                    Site officiel
                    <ExternalLink size={16} />
                  </Link>
                )}
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Signalements</CardTitle>
                <CardDescription>Infos temps réel remontées par les grimpeurs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {reportRows.map((report) => (
                  <article key={report.id} className="rounded-lg border border-border bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="text-primary" size={18} />
                        <h2 className="font-bold text-foreground">{reportTypeLabels[report.type]}</h2>
                      </div>
                      <Badge variant={report.status === 'open' ? 'warning' : 'success'}>
                        {report.status === 'open' ? 'Ouvert' : 'Résolu'}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{report.message}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Signalé par {report.authorEmail} · {formatDate(report.createdAt)}
                    </p>
                  </article>
                ))}
                {reportRows.length === 0 && (
                  <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                    Aucun signalement pour cette salle.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
                <CardDescription>Repères pour la future carte interactive.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border bg-[#050a2a]/40 p-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <CalendarDays className="text-primary" size={18} />
                    Coordonnées
                  </div>
                  <p className="mt-3">
                    {salle.latitude && salle.longitude
                      ? `${salle.latitude.toFixed(4)}, ${salle.longitude.toFixed(4)}`
                      : 'Coordonnées à compléter'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppShell>
  )
}
