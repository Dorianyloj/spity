'use client'

import { Building2, Filter, MapPin, Mountain, Route, Search, ShieldCheck, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'

type SallePlace = {
  id: string
  nom: string
  location: string
  adresse: string
  disciplines: string[]
  photoUrl: string | null
  horaires: Record<string, string>
  tarifs: Record<string, string>
  services: string[]
  siteWeb: string | null
  latitude: number | null
  longitude: number | null
  niveauMin: string | null
  niveauMax: string | null
  frequentation: 'calme' | 'moderee' | 'elevee' | null
}

type FalaisePlace = {
  id: string
  nom: string
  location: string
  acces: string | null
  niveaux: string[] | null
  photoUrl: string | null
  latitude: number | null
  longitude: number | null
  orientation: 'nord' | 'sud' | 'est' | 'ouest' | 'multi' | null
  approche: string | null
  parking: string | null
  saison: string[]
  status: 'sec' | 'humide' | 'attention' | 'ferme' | null
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
  hauteur: number | null
  degaines: number | null
  secteur: string | null
  style: 'dalle' | 'devers' | 'vertical' | 'fissure' | 'pilier' | 'mixte' | null
  status: 'ok' | 'humide' | 'spit_a_verifier' | 'fermee' | null
}

type PlaceKind = 'all' | 'salles' | 'falaises' | 'clubs'
type DisciplineFilter = 'all' | 'bloc' | 'voie' | 'trad'
type StatusFilter = 'all' | 'sec' | 'attention'

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

const statusLabels = {
  sec: 'Sec',
  humide: 'Humide',
  attention: 'Attention',
  ferme: 'Fermé',
} as const

const routeStatusLabels = {
  ok: 'OK',
  humide: 'Humide',
  spit_a_verifier: 'Spit à vérifier',
  fermee: 'Fermée',
} as const

const frequentationLabels = {
  calme: 'Calme',
  moderee: 'Modérée',
  elevee: 'Élevée',
} as const

const seasonLabels: Record<string, string> = {
  printemps: 'Printemps',
  ete: 'Été',
  automne: 'Automne',
  hiver: 'Hiver',
}

const filters = [
  { value: 'all', label: 'Tous' },
  { value: 'salles', label: 'Salles' },
  { value: 'falaises', label: 'Falaises' },
  { value: 'clubs', label: 'Clubs' },
] satisfies Array<{ value: PlaceKind; label: string }>

const disciplineFilters = [
  { value: 'all', label: 'Toutes pratiques' },
  { value: 'bloc', label: 'Bloc' },
  { value: 'voie', label: 'Voie' },
  { value: 'trad', label: 'Trad' },
] satisfies Array<{ value: DisciplineFilter; label: string }>

const statusFilters = [
  { value: 'all', label: 'Tous statuts' },
  { value: 'sec', label: 'Falaises sèches' },
  { value: 'attention', label: 'Points à surveiller' },
] satisfies Array<{ value: StatusFilter; label: string }>

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
  const [query, setQuery] = useState('')
  const [placeKind, setPlaceKind] = useState<PlaceKind>('all')
  const [discipline, setDiscipline] = useState<DisciplineFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const totalPlaces = salles.length + falaises.length + clubs.length
  const normalizedQuery = query.trim().toLowerCase()
  const filteredSalles = useMemo(() => {
    return salles.filter((salle) => {
      const matchesKind = placeKind === 'all' || placeKind === 'salles'
      const matchesDiscipline = discipline === 'all' || salle.disciplines.includes(discipline)
      const matchesStatus = status === 'all'
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [salle.nom, salle.location, salle.adresse, ...salle.disciplines, ...salle.services]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesKind && matchesDiscipline && matchesStatus && matchesQuery
    })
  }, [discipline, normalizedQuery, placeKind, salles, status])
  const filteredFalaises = useMemo(() => {
    return falaises.filter((falaise) => {
      const routes = getRoutesForCrag(voies, falaise.id)
      const matchesKind = placeKind === 'all' || placeKind === 'falaises'
      const matchesDiscipline = discipline === 'all' || discipline === 'voie' || discipline === 'trad'
      const matchesStatus =
        status === 'all' ||
        (status === 'sec' && falaise.status === 'sec') ||
        (status === 'attention' && ['attention', 'ferme'].includes(falaise.status ?? ''))
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          falaise.nom,
          falaise.location,
          falaise.acces ?? '',
          falaise.approche ?? '',
          falaise.parking ?? '',
          ...(falaise.niveaux ?? []),
          ...falaise.saison,
          ...routes.map((route) => `${route.nom} ${route.cotation} ${route.secteur ?? ''}`),
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesKind && matchesDiscipline && matchesStatus && matchesQuery
    })
  }, [discipline, falaises, normalizedQuery, placeKind, status, voies])
  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const matchesKind = placeKind === 'all' || placeKind === 'clubs'
      const matchesDiscipline = discipline === 'all'
      const matchesStatus = status === 'all'
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [club.nom, club.location ?? '', club.bio ?? '', club.ffmeNum ?? '']
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesKind && matchesDiscipline && matchesStatus && matchesQuery
    })
  }, [clubs, discipline, normalizedQuery, placeKind, status])
  const visiblePlaces = filteredSalles.length + filteredFalaises.length + filteredClubs.length

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

      <Card hover={false}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
            <label className="min-w-0 flex-1 space-y-2">
              <span className="text-xs font-bold uppercase text-white/62">Recherche</span>
              <span className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  className="spity-input h-12 pl-10"
                  placeholder="Nom, ville, voie, service..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </span>
            </label>

            <div className="grid gap-3 sm:grid-cols-3 xl:w-[660px]">
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase text-white/62">Type</span>
                <select className="spity-input h-12" value={placeKind} onChange={(event) => setPlaceKind(event.target.value as PlaceKind)}>
                  {filters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase text-white/62">Discipline</span>
                <select className="spity-input h-12" value={discipline} onChange={(event) => setDiscipline(event.target.value as DisciplineFilter)}>
                  {disciplineFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase text-white/62">État</span>
                <select className="spity-input h-12" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
                  {statusFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-sm text-muted-foreground">
            <Filter size={16} />
            <span>{visiblePlaces} résultat(s) affiché(s)</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-6">
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Salles</CardTitle>
              <CardDescription>Les lieux indoor disponibles dans le répertoire.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {filteredSalles.map((salle) => (
                <article key={salle.id} className="overflow-hidden rounded-lg border border-border bg-white/[0.03]">
                  <div
                    className="h-28 bg-cover bg-center"
                    style={{ backgroundImage: makePanelBackground(salle.photoUrl ?? brandAssets.indoor) }}
                    aria-hidden="true"
                  />
                  <div className="p-4">
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
                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <span>Horaires : {salle.horaires.semaine ?? 'À compléter'}</span>
                    <span>Entrée : {salle.tarifs.entree ?? 'À compléter'}</span>
                    <span>Niveaux : {salle.niveauMin ?? '4a'} → {salle.niveauMax ?? '8a'}</span>
                    <span>Fréquentation : {salle.frequentation ? frequentationLabels[salle.frequentation] : 'À préciser'}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {salle.disciplines.map((discipline) => (
                      <Badge key={discipline} variant="secondary">
                        {disciplineLabels[discipline] ?? discipline}
                      </Badge>
                    ))}
                    {salle.services.slice(0, 4).map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                  <Link
                    href={`/app/places/salles/${salle.id}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-[#e76f51]"
                  >
                    Voir la fiche salle
                  </Link>
                  </div>
                </article>
              ))}
              {filteredSalles.length === 0 && (
                <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground md:col-span-2">
                  Aucune salle ne correspond aux filtres.
                </p>
              )}
            </CardContent>
          </Card>

          <Card hover={false}>
            <CardHeader>
              <CardTitle>Falaises</CardTitle>
              <CardDescription>Sites naturels et voies associées.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredFalaises.map((falaise) => {
                const routes = getRoutesForCrag(voies, falaise.id)

                return (
                  <article key={falaise.id} className="overflow-hidden rounded-lg border border-border bg-white/[0.03]">
                    <div
                      className="h-36 bg-cover bg-center"
                      style={{ backgroundImage: makePanelBackground(falaise.photoUrl ?? brandAssets.crag) }}
                      aria-hidden="true"
                    />
                    <div className="p-4">
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
                        <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                          <span>Orientation : {falaise.orientation ?? 'À préciser'}</span>
                          <span>Approche : {falaise.approche ?? 'À compléter'}</span>
                          <span>Parking : {falaise.parking ?? 'À compléter'}</span>
                          <span>État : {falaise.status ? statusLabels[falaise.status] : 'À confirmer'}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2 md:max-w-52 md:justify-end">
                        {(falaise.niveaux ?? []).map((niveau) => (
                          <Badge key={niveau} variant="secondary">
                            {niveau}
                          </Badge>
                        ))}
                        {falaise.saison.map((season) => (
                          <Badge key={season} variant="secondary">
                            {seasonLabels[season] ?? season}
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
                            <p className="mt-1 text-xs text-muted-foreground">
                              {route.secteur ?? 'Secteur à préciser'} · {route.hauteur ?? '?'} m · {route.status ? routeStatusLabels[route.status] : 'État à confirmer'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/app/places/falaises/${falaise.id}`}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-[#e76f51]"
                    >
                      Voir la fiche falaise
                    </Link>
                    </div>
                  </article>
                )
              })}
              {filteredFalaises.length === 0 && (
                <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                  Aucune falaise ne correspond aux filtres.
                </p>
              )}
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
              {filteredClubs.map((club) => (
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
                  <Link
                    href={`/app/places/clubs/${club.id}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-[#e76f51]"
                  >
                    Voir la fiche club
                  </Link>
                </article>
              ))}
              {filteredClubs.length === 0 && (
                <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
                  Aucun club ne correspond aux filtres.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
