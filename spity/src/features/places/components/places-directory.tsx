import { Building2, MapPin, Mountain, Route, ShieldCheck, UsersRound } from 'lucide-react'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'

type SallePlace = {
  id: string
  nom: string
  location: string
  adresse: string
  disciplines: string[]
}

type FalaisePlace = {
  id: string
  nom: string
  location: string
  acces: string | null
  niveaux: string[] | null
}

type ClubPlace = {
  id: string
  nom: string
  bio: string | null
  location: string | null
  ffmeNum: string | null
}

type RoutePlace = {
  id: string
  falaiseId: string
  nom: string
  cotation: string
}

type PlacesDirectoryProps = {
  salles: SallePlace[]
  falaises: FalaisePlace[]
  clubs: ClubPlace[]
  voies: RoutePlace[]
}

const disciplineLabels: Record<string, string> = {
  bloc: 'Bloc',
  voie: 'Voie',
  trad: 'Trad',
}

const placeCards = [
  {
    label: 'Salles',
    description: 'Bloc, voie et spots indoor proches.',
    icon: Building2,
    image: brandAssets.indoor,
  },
  {
    label: 'Falaises',
    description: 'Accès, niveaux et voies collaboratives.',
    icon: Mountain,
    image: brandAssets.crag,
  },
  {
    label: 'Clubs',
    description: 'Sorties, initiations et communauté locale.',
    icon: UsersRound,
    image: brandAssets.heroSunset,
  },
]

const getRoutesForCrag = (voies: RoutePlace[], falaiseId: string) => {
  return voies.filter((voie) => voie.falaiseId === falaiseId)
}

export default function PlacesDirectory({ salles, falaises, clubs, voies }: PlacesDirectoryProps) {
  const totalPlaces = salles.length + falaises.length + clubs.length

  return (
    <div className="space-y-7">
      <section
        className="overflow-hidden rounded-lg border border-white/10 bg-cover bg-center p-6 shadow-2xl shadow-black/20 md:p-8"
        style={{ backgroundImage: makePanelBackground(brandAssets.crag) }}
      >
        <Badge className="bg-[#f4a261] text-[#050a2a]" variant="default">
          Répertoire MVP
        </Badge>
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <h1 className="text-4xl font-black text-white md:text-5xl">Lieux d’escalade</h1>
            <p className="mt-3 max-w-2xl text-white/[0.76]">
              Une première vue unifiée des salles, falaises et clubs, alimentée par MariaDB pour la démo.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-[#050a2a]/60 p-3 backdrop-blur">
            <div>
              <p className="text-2xl font-black text-[#f4a261]">{totalPlaces}</p>
              <p className="text-xs font-semibold uppercase text-white/[0.62]">lieux</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#f4a261]">{voies.length}</p>
              <p className="text-xs font-semibold uppercase text-white/[0.62]">voies</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#f4a261]">{clubs.length}</p>
              <p className="text-xs font-semibold uppercase text-white/[0.62]">clubs</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {placeCards.map((placeCard) => {
          const Icon = placeCard.icon

          return (
            <Card key={placeCard.label} hover={false} className="overflow-hidden">
              <div
                className="h-28 bg-cover bg-center"
                style={{ backgroundImage: makePanelBackground(placeCard.image) }}
                aria-hidden="true"
              />
              <CardHeader>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon size={22} />
                </div>
                <CardTitle>{placeCard.label}</CardTitle>
                <CardDescription>{placeCard.description}</CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-6">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Salles</CardTitle>
              <CardDescription>Les lieux indoor disponibles dans le répertoire.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {salles.map((salle) => (
                <article key={salle.id} className="rounded-lg border border-border bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-foreground">{salle.nom}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin size={15} />
                        {salle.location}
                      </p>
                    </div>
                    <Badge variant="primary">Salle</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{salle.adresse}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {salle.disciplines.map((discipline) => (
                      <Badge key={discipline} variant="secondary">
                        {disciplineLabels[discipline] ?? discipline}
                      </Badge>
                    ))}
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Falaises</CardTitle>
              <CardDescription>Sites naturels et voies associées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {falaises.map((falaise) => {
                const routes = getRoutesForCrag(voies, falaise.id)

                return (
                  <article key={falaise.id} className="rounded-lg border border-border bg-white/[0.03] p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-foreground">{falaise.nom}</h3>
                          <Badge variant="primary">Falaise</Badge>
                        </div>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin size={15} />
                          {falaise.location}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                          {falaise.acces ?? 'Accès à compléter par la communauté.'}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2 md:max-w-52 md:justify-end">
                        {(falaise.niveaux ?? []).map((niveau) => (
                          <Badge key={niveau} variant="secondary">
                            {niveau}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {routes.length > 0 && (
                      <div className="mt-4 grid gap-2 md:grid-cols-3">
                        {routes.map((route) => (
                          <div key={route.id} className="rounded-lg border border-border bg-[#050a2a]/40 p-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                              <Route size={15} className="text-primary" />
                              {route.nom}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">Cotation {route.cotation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </article>
                )
              })}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Carte à venir</CardTitle>
              <CardDescription>Préparation du futur affichage Mapbox ou Leaflet.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative min-h-[280px] overflow-hidden rounded-lg border border-border bg-[#050a2a]">
                <div className="absolute inset-0 topo-lines opacity-80" />
                {[
                  { label: 'Salle', x: '22%', y: '28%' },
                  { label: 'Falaise', x: '64%', y: '42%' },
                  { label: 'Club', x: '44%', y: '68%' },
                ].map((pin) => (
                  <div
                    key={pin.label}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg shadow-black/30"
                    style={{ left: pin.x, top: pin.y }}
                  >
                    <MapPin size={14} />
                    {pin.label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Clubs</CardTitle>
              <CardDescription>Structures locales prêtes pour les événements.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {clubs.map((club) => (
                <article key={club.id} className="rounded-lg border border-border bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-foreground">{club.nom}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{club.location ?? 'Localisation à compléter'}</p>
                    </div>
                    <ShieldCheck className="shrink-0 text-primary" size={20} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {club.bio ?? 'Présentation club à compléter.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="primary">Club</Badge>
                    {club.ffmeNum && <Badge variant="secondary">{club.ffmeNum}</Badge>}
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
