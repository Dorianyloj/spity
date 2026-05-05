import { asc, eq } from 'drizzle-orm'
import { ArrowLeft, CalendarDays, MapPin, Megaphone, ShieldCheck, Ticket, UsersRound } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { clubProfiles, events, medias, posts, users } from '@/db/schema'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import AppShell from '@/features/app/components/app-shell'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'

type ClubDetailPageProps = {
  params: Promise<{
    clubId: string
  }>
}

export const metadata: Metadata = {
  title: 'Fiche club - Spity',
  description: 'Détail d’un club, événements et publications Spity.',
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatDateTime = (date: Date) => {
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const { clubId } = await params
  const [club] = await db.select().from(clubProfiles).where(eq(clubProfiles.id, clubId)).limit(1)

  if (!club) {
    notFound()
  }

  const [eventRows, postRows] = await Promise.all([
    db.select().from(events).where(eq(events.clubId, club.id)).orderBy(asc(events.debut)),
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
      .where(eq(posts.clubId, club.id)),
  ])

  return (
    <AppShell activeItem="places" user={currentProfile.user}>
      <div className="space-y-6">
        <Link href="/app/places" className="inline-flex items-center gap-2 text-sm font-semibold text-white/[0.76] hover:text-white">
          <ArrowLeft size={16} />
          Retour aux lieux
        </Link>

        <section
          className="overflow-hidden rounded-lg border border-white/10 bg-cover bg-center p-6 shadow-2xl shadow-black/20 md:p-8"
          style={{ backgroundImage: makePanelBackground(brandAssets.heroSunset) }}
        >
          <Badge className="bg-[#f4a261] text-[#050a2a]" variant="default">
            Club
          </Badge>
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <h1 className="text-4xl font-black text-white md:text-5xl">{club.nom}</h1>
              <p className="mt-3 flex items-center gap-2 text-white/[0.76]">
                <MapPin size={18} />
                {club.location ?? 'Localisation à compléter'}
              </p>
              <p className="mt-4 max-w-2xl text-white/[0.76]">
                {club.bio ?? 'Présentation club à compléter.'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-[#050a2a]/60 p-3 backdrop-blur">
              <div>
                <p className="text-2xl font-black text-[#f4a261]">{eventRows.length}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">événements</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#f4a261]">{postRows.length}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">posts</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#f4a261]">{club.ffmeNum ? 'Oui' : 'N/A'}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">FFME</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="space-y-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Événements</CardTitle>
                <CardDescription>Sorties, contests et initiations organisés par le club.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {eventRows.map((event) => (
                  <article key={event.id} className="rounded-lg border border-border bg-white/[0.03] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-bold text-foreground">{event.titre}</h2>
                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarDays className="text-primary" size={16} />
                          {formatDateTime(event.debut)}
                        </p>
                      </div>
                      <Badge variant="primary">{event.capacite} places</Badge>
                    </div>
                  </article>
                ))}
                {eventRows.length === 0 && (
                  <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground md:col-span-2">
                    Aucun événement rattaché à ce club.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Publications du club</CardTitle>
                <CardDescription>Contenus associés aux sorties et annonces locales.</CardDescription>
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
                    Aucune publication rattachée à ce club.
                  </p>
                )}
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Profil club</CardTitle>
                <CardDescription>Informations de confiance pour la communauté.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <ShieldCheck className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Affiliation</p>
                    <p className="mt-1 text-muted-foreground">{club.ffmeNum ?? 'Numéro FFME à compléter'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <UsersRound className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Public visé</p>
                    <p className="mt-1 text-muted-foreground">Grimpeurs autonomes, débutants encadrés et sorties collectives.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Ticket className="mt-0.5 text-primary" size={18} />
                  <div>
                    <p className="font-semibold text-foreground">Capacité annoncée</p>
                    <p className="mt-1 text-muted-foreground">
                      {eventRows.reduce((total, event) => total + event.capacite, 0)} places cumulées sur les événements démo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Parcours RNCP</CardTitle>
                <CardDescription>Éléments visibles pour démontrer la valeur du module.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="rounded-lg border border-border bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Megaphone className="text-primary" size={18} />
                    Animation locale
                  </div>
                  <p className="mt-2">
                    La fiche regroupe les annonces du club, ses événements et ses informations de confiance dans un seul écran.
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
