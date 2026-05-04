import {
  Compass,
  Mountain,
  Route,
  UserRound,
  Users,
} from 'lucide-react'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@/components/ui'
import type { AuthUser } from '@/features/auth/schemas'
import type { ClubProfile, GrimpeurProfile, UserEquipment } from '@/features/profile/schemas'
import AppShell from './app-shell'

type AppDashboardProps = {
  user: AuthUser
  grimpeurProfile: GrimpeurProfile | null
  clubProfile: ClubProfile | null
  equipment: UserEquipment[]
}

const nearbyPartners = [
  { name: 'Lina M.', discipline: 'Bloc', grade: '6b', place: 'Arkose Lyon', availability: 'Ce soir' },
  { name: 'Nassim B.', discipline: 'Voie', grade: '6a+', place: 'MROC Villeurbanne', availability: 'Demain' },
  { name: 'Camille R.', discipline: 'Trad', grade: '5c', place: 'Falaise de Curis', availability: 'Samedi' },
]

const upcomingEvents = [
  { title: 'Sortie falaise découverte', club: 'Club Alpin Lyon', date: 'Samedi 18 mai', capacity: '8 places' },
  { title: 'Contest bloc local', club: 'Spity Crew', date: 'Mercredi 22 mai', capacity: '24 places' },
  { title: 'Initiation grandes voies', club: 'Verticale FFME', date: 'Dimanche 26 mai', capacity: '6 places' },
]

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
  },
  {
    author: 'Club Alpin Lyon',
    context: 'Curis-au-Mont-d’Or · Sortie club',
    content: 'Sortie falaise samedi matin. Groupe limité à 8 personnes, niveau conseillé 5c/6a, encadrement bénévole.',
    tag: 'Événement',
    meta: 'Il y a 1 h',
  },
  {
    author: 'Nassim B.',
    context: 'MROC Villeurbanne · Voie · 6a+',
    content: 'Bonne session voie hier, les nouvelles ouvertures en dalle sont propres. Disponible demain midi pour assurer.',
    tag: 'Session',
    meta: 'Hier',
  },
]

const getDisplayName = (grimpeurProfile: GrimpeurProfile | null, clubProfile: ClubProfile | null, user: AuthUser) => {
  if (clubProfile) {
    return clubProfile.nom
  }

  return grimpeurProfile?.displayName ?? user.email.split('@')[0]
}

export default function AppDashboard({ user, grimpeurProfile, clubProfile, equipment }: AppDashboardProps) {
  const displayName = getDisplayName(grimpeurProfile, clubProfile, user)
  const isClub = user.role === 'club'
  const disciplineCount = grimpeurProfile?.disciplines.length ?? 0
  const detailedGearCount = equipment.reduce((total, item) => total + item.quantity, 0)
  const gearCount = detailedGearCount || grimpeurProfile?.materiel.length || 0

  return (
    <AppShell activeItem="feed" user={user}>
      <section className="mb-6">
        <Badge variant="success">MVP feed</Badge>
        <h1 className="mt-3 text-4xl font-bold text-foreground">Bonjour {displayName}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Un premier fil communautaire pour connecter les grimpeurs, les clubs, les lieux et les sessions à venir.
        </p>
      </section>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard value={isClub ? 'Club' : String(disciplineCount)} label={isClub ? 'Type de compte' : 'Disciplines'} icon={Mountain} />
          <StatCard value={isClub ? '0' : String(gearCount)} label={isClub ? 'Événements publiés' : 'Objets déclarés'} icon={Route} />
        <StatCard value="3" label="Suggestions locales" icon={Compass} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-6">
            <Card hover={false}>
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
              <Card key={`${post.author}-${post.meta}`} hover={false}>
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

            <Card hover={false}>
              <CardHeader>
                <CardTitle>{isClub ? 'Demandes et activité locale' : 'Partenaires recommandés'}</CardTitle>
                <CardDescription>
                  {isClub ? 'Premiers signaux pour recruter et animer votre communauté.' : 'Suggestions statiques en attendant l’algorithme de matching.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {nearbyPartners.map((partner) => (
                  <div key={partner.name} className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-light text-coral">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {partner.discipline} · {partner.grade} · {partner.place}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{partner.availability}</Badge>
                  </div>
                ))}
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
                <CardDescription>Base statique avant le module calendrier clubs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.title} className="rounded-lg border border-border p-4">
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{event.club}</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span>{event.date}</span>
                      <Badge variant="secondary">{event.capacity}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card hover={false}>
              <CardHeader>
                <CardTitle>Lieux populaires</CardTitle>
                <CardDescription>Départ du futur répertoire salles/falaises/clubs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {popularPlaces.map((place) => (
                  <div key={place.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">{place.name}</p>
                      <p className="text-sm text-muted-foreground">{place.detail}</p>
                    </div>
                    <Badge variant="primary">{place.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
    </AppShell>
  )
}
