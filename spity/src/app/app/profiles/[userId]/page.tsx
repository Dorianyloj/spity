import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Award, MapPin, Mountain, Settings, UsersRound } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { Avatar, Badge, EmptyState } from '@/components/ui'
import AppShell from '@/features/app/components/app-shell'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { findPublicProfileByUserId } from '@/features/profile/lib/public-profile-repository'

type PublicProfilePageProps = {
  params: Promise<{
    userId: string
  }>
}

export const metadata: Metadata = {
  title: 'Profil - Spity',
  description: 'Profil public d’un membre de la communauté Spity.',
}

const environmentLabels = {
  indoor: 'Principalement en salle',
  outdoor: 'Principalement en falaise',
  mixed: 'Salle et falaise',
} as const

const formatMemberSince = (date: Date) => {
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date)
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const { userId } = await params
  const profile = await findPublicProfileByUserId(userId)

  if (!profile) {
    notFound()
  }

  const isCurrentUser = profile.userId === currentProfile.user.id
  const levels = Object.entries(profile.niveaux)
  const primaryLevel = levels.at(0)?.[1]

  return (
    <AppShell activeItem="profile" user={currentProfile.user}>
      <div className="mx-auto max-w-5xl space-y-7">
        <Link
          className="inline-flex items-center gap-2 rounded text-sm font-semibold text-white/75 underline-offset-4 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          href="/app"
        >
          <ArrowLeft aria-hidden="true" size={16} />
          Retour au feed
        </Link>

        <section className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm sm:p-8" aria-labelledby="profile-heading">
          <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-9">
            <Avatar
              alt={`Avatar de ${profile.displayName}`}
              className="size-28 border-4 border-background shadow-md sm:size-36"
              fallback={profile.displayName}
              size="xl"
              sizes="(max-width: 640px) 112px, 144px"
              src={profile.avatarUrl ?? undefined}
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 id="profile-heading" className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                  {profile.displayName}
                </h1>
                <Badge variant={profile.role === 'club' ? 'primary' : 'secondary'}>
                  {profile.role === 'club' ? 'Club' : 'Grimpeur'}
                </Badge>
              </div>

              <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-border py-4 text-center sm:max-w-lg">
                <div>
                  <dd className="text-lg font-bold text-foreground tabular-nums">{profile.posts.length}</dd>
                  <dt className="text-xs text-muted-foreground">publications</dt>
                </div>
                <div>
                  <dd className="text-lg font-bold text-foreground tabular-nums">
                    {profile.role === 'grimpeur' ? profile.karma : profile.ffmeNum ?? '—'}
                  </dd>
                  <dt className="text-xs text-muted-foreground">
                    {profile.role === 'grimpeur' ? 'karma' : 'n° FFME'}
                  </dt>
                </div>
                <div>
                  <dd className="text-lg font-bold text-foreground tabular-nums">
                    {profile.role === 'grimpeur' ? profile.disciplines.length : profile.createdAt.getFullYear()}
                  </dd>
                  <dt className="text-xs text-muted-foreground">
                    {profile.role === 'grimpeur' ? 'disciplines' : 'membre depuis'}
                  </dt>
                </div>
              </dl>

              {profile.location && (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin aria-hidden="true" className="shrink-0 text-primary" size={17} />
                  {profile.location}
                </p>
              )}
              {profile.bio && <p className="mt-3 max-w-2xl text-pretty text-sm text-foreground">{profile.bio}</p>}
              <p className="mt-3 text-xs text-muted-foreground">Membre depuis {formatMemberSince(profile.createdAt)}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {isCurrentUser ? (
                  <Link className="spity-btn spity-btn--primary" href="/profile/me">
                    <Settings aria-hidden="true" size={17} />
                    Modifier mon profil
                  </Link>
                ) : profile.role === 'grimpeur' ? (
                  <Link className="spity-btn spity-btn--primary" href="/app/matching">
                    <UsersRound aria-hidden="true" size={17} />
                    Trouver un partenaire
                  </Link>
                ) : (
                  <Link className="spity-btn spity-btn--primary" href="/app/events">
                    Voir les événements
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {profile.role === 'grimpeur' && (
          <section className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6" aria-labelledby="climbing-details-heading">
            <div className="flex items-center gap-2">
              <Mountain aria-hidden="true" className="text-primary" size={20} />
              <h2 id="climbing-details-heading" className="text-balance text-xl font-bold text-foreground">
                Profil de grimpe
              </h2>
            </div>

            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-foreground">Pratiques et niveau</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.disciplines.map((discipline) => (
                    <Badge key={discipline} variant="secondary">{discipline}</Badge>
                  ))}
                  {primaryLevel && <Badge variant="primary">Niveau {primaryLevel}</Badge>}
                  {profile.disciplines.length === 0 && !primaryLevel && (
                    <p className="text-sm text-muted-foreground">Informations à compléter.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">Préférences</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.climbingEnvironment && (
                    <Badge variant="default">{environmentLabels[profile.climbingEnvironment]}</Badge>
                  )}
                  {profile.goals.map((goal) => <Badge key={goal} variant="secondary">{goal}</Badge>)}
                  {!profile.climbingEnvironment && profile.goals.length === 0 && (
                    <p className="text-sm text-muted-foreground">Informations à compléter.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <section aria-labelledby="profile-posts-heading">
          <div className="mb-4 flex items-center gap-2">
            <Award aria-hidden="true" className="text-primary" size={20} />
            <h2 id="profile-posts-heading" className="text-balance text-xl font-bold text-white">
              Publications
            </h2>
          </div>

          {profile.posts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {profile.posts.map((post) => (
                <article
                  key={post.id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border/80 bg-card"
                >
                  {post.imageUrl ? (
                    <Image
                      alt={`Publication de ${profile.displayName}`}
                      className="object-cover"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                      src={post.imageUrl}
                    />
                  ) : (
                    <div className="flex size-full items-end bg-muted p-4">
                      <p className="line-clamp-5 text-pretty text-sm font-medium text-foreground">{post.content}</p>
                    </div>
                  )}
                  {post.cotation && (
                    <Badge className="absolute left-3 top-3 shadow-sm" variant="primary">{post.cotation}</Badge>
                  )}
                  {post.imageUrl && <p className="sr-only">{post.content}</p>}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Award}
              title="Aucune publication pour le moment"
              description="Les prochains contenus partagés par ce profil apparaîtront ici."
            />
          )}
        </section>
      </div>
    </AppShell>
  )
}
