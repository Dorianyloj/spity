import {
  Compass,
  Mountain,
  Route,
  UserRound,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import {
  AppHero,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  InfoTile,
  MediaHeader,
  StatCard,
} from '@/components/ui'
import type { AuthUser } from '@/features/auth/schemas'
import type { SpityEvent } from '@/features/events/schemas'
import type { PublicClimber } from '@/features/matching/schemas'
import type { ClubProfile, GrimpeurProfile, UserEquipment } from '@/features/profile/schemas'
import { demoClimbingAssets } from '@/lib/brand-assets'
import AppShell from './app-shell'

type AppDashboardProps = {
  user: AuthUser
  grimpeurProfile: GrimpeurProfile | null
  clubProfile: ClubProfile | null
  equipment: UserEquipment[]
  events: SpityEvent[]
  matchingClimbers: PublicClimber[]
}

const popularPlaces = [
  { name: 'Arkose Lyon', type: 'Salle', detail: 'Bloc · 2.4 km' },
  { name: 'Curis-au-Mont-d’Or', type: 'Falaise', detail: 'Voie · 18 km' },
  { name: 'MROC Villeurbanne', type: 'Salle', detail: 'Bloc + voie · 5.1 km' },
]

const feedPosts = [
  {
    author: 'Lina M.',
    context: 'Arkose Lyon · Bloc · 6b',
    content: 'Session bloc ce soir vers 19h. Je cherche quelqu’un pour travailler les profils déversants et filmer quelques essais.',
    tag: 'Recherche partenaire',
    meta: 'Il y a 18 min',
    image: demoClimbingAssets.indoorWall,
  },
  {
    author: 'Club Alpin Lyon',
    context: 'Curis-au-Mont-d’Or · Sortie club',
    content: 'Sortie falaise samedi matin. Groupe limité à 8 personnes, niveau conseillé 5c/6a, encadrement bénévole.',
    tag: 'Événement',
    meta: 'Il y a 1 h',
    image: demoClimbingAssets.verdonRoute,
  },
  {
    author: 'Nassim B.',
    context: 'MROC Villeurbanne · Voie · 6a+',
    content: 'Bonne session voie hier, les nouvelles ouvertures en dalle sont propres. Disponible demain midi pour assurer.',
    tag: 'Session',
    meta: 'Hier',
    image: demoClimbingAssets.indoorCrack,
  },
]

const getDisplayName = (grimpeurProfile: GrimpeurProfile | null, clubProfile: ClubProfile | null, user: AuthUser) => {
  if (clubProfile) {
    return clubProfile.nom
  }

  return grimpeurProfile?.displayName ?? user.email.split('@')[0]
}

export default function AppDashboard({
  user,
  grimpeurProfile,
  clubProfile,
  equipment,
  events,
  matchingClimbers,
}: AppDashboardProps) {
  const displayName = getDisplayName(grimpeurProfile, clubProfile, user)
  const isClub = user.role === 'club'
  const disciplineCount = grimpeurProfile?.disciplines.length ?? 0
  const detailedGearCount = equipment.reduce((total, item) => total + item.quantity, 0)
  const gearCount = detailedGearCount || grimpeurProfile?.materiel.length || 0
  const ownedEventCount = events.filter((event) => event.isOwner).length
  const upcomingEvents = events.filter((event) => event.status === 'scheduled').slice(0, 3)

  return (
    <AppShell activeItem="feed" user={user}>
      <AppHero
        className="mb-6"
        backgroundImage={isClub ? demoClimbingAssets.indoorGym : demoClimbingAssets.verdonWall}
        description="Un premier fil communautaire pour connecter les grimpeurs, les clubs, les lieux et les sessions à venir."
        eyebrow="MVP feed"
        title={`Bonjour ${displayName}`}
      >
        <Badge className="bg-white/10 text-white" variant="default">Matching local</Badge>
        <Badge className="bg-white/10 text-white" variant="default">Topos vivants</Badge>
        <Badge className="bg-white/10 text-white" variant="default">Événements clubs</Badge>
      </AppHero>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard value={isClub ? 'Club' : String(disciplineCount)} label={isClub ? 'Type de compte' : 'Disciplines'} icon={Mountain} />
          <StatCard value={isClub ? String(ownedEventCount) : String(gearCount)} label={isClub ? 'Événements publiés' : 'Objets déclarés'} icon={Route} />
        <StatCard value={isClub ? String(upcomingEvents.length) : String(matchingClimbers.length)} label={isClub ? 'Événements à venir' : 'Profils disponibles'} icon={Compass} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
            <Card hover={false} className="overflow-hidden">
              <MediaHeader imageUrl={demoClimbingAssets.indoorGym} />
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral-light text-coral">
                    <UserRound size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {isClub ? 'Publiez une sortie ou une annonce club.' : 'Partagez une session ou trouvez un partenaire.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="primary">Session</Badge>
                      <Badge variant="secondary">Partenaire</Badge>
                      <Badge variant="secondary">Lieu</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {feedPosts.map((post) => (
              <Card key={`${post.author}-${post.meta}`} hover={false} className="overflow-hidden">
                <MediaHeader imageUrl={post.image} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{post.author}</p>
                        <p className="text-sm text-muted-foreground">{post.context}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">{post.meta}</span>
                  </div>
                  <p className="mt-4 text-foreground">{post.content}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <Badge variant="primary">{post.tag}</Badge>
                    <div className="flex gap-2">
                      <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground" type="button">
                        J’aime
                      </button>
                      <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground" type="button">
                        Commenter
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card hover={false} className="overflow-hidden">
              <MediaHeader className="h-24" imageUrl={demoClimbingAssets.fontainebleau} />
              <CardHeader>
                <CardTitle>{isClub ? 'Demandes et activité locale' : 'Partenaires recommandés'}</CardTitle>
                <CardDescription>
                  {isClub ? 'L’agenda permet de publier et suivre vos rendez-vous.' : 'Profils publics actuellement ouverts au matching.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(isClub ? [] : matchingClimbers.slice(0, 3)).map((partner) => (
                  <div key={partner.userId} className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-light text-coral">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{partner.displayName}</p>
                        <p className="text-sm text-muted-foreground">
                          {partner.disciplines.join(', ')} · {partner.location ?? 'Localisation à préciser'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{Object.values(partner.niveaux)[0] ?? 'Niveau libre'}</Badge>
                  </div>
                ))}
                <Link className="spity-btn spity-btn--primary" href={isClub ? '/app/events' : '/app/matching'}>
                  {isClub ? 'Gérer les événements' : 'Voir tous les partenaires'}
                </Link>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-6">
            <Card hover={false}>
              <CardHeader>
                <CardTitle>Profil actif</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {grimpeurProfile && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-foreground">Disciplines</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {grimpeurProfile.disciplines.map((discipline) => (
                          <Badge key={discipline} variant="primary">
                            {discipline}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Matériel</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {equipment.length > 0 ? (
                          equipment.slice(0, 4).map((item) => (
                            <Badge key={item.id} variant="secondary">
                              {item.quantity} x {item.model}
                            </Badge>
                          ))
                        ) : (
                          grimpeurProfile.materiel.map((item) => (
                            <Badge key={item} variant="secondary">
                              {item}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}

                {clubProfile && (
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Localisation</span>
                      <span className="font-medium">{clubProfile.location ?? 'À compléter'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">FFME</span>
                      <span className="font-medium">{clubProfile.ffmeNum ?? 'Non renseigné'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Événements proches</CardTitle>
                <CardDescription>Prochains rendez-vous publiés par les clubs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-border p-4">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{event.clubName}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span>{new Date(event.startsAt).toLocaleDateString('fr-FR')}</span>
                      <Badge variant="secondary">{event.remainingCapacity} places</Badge>
                    </div>
                  </div>
                ))}
                <Link className="spity-btn spity-btn--secondary" href="/app/events">Ouvrir l’agenda</Link>
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Lieux populaires</CardTitle>
                <CardDescription>Départ du futur répertoire salles/falaises/clubs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularPlaces.map((place) => (
                  <InfoTile key={place.name} label={place.name}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">{place.detail}</span>
                      <Badge variant="primary">{place.type}</Badge>
                    </div>
                  </InfoTile>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
    </AppShell>
  )
}
