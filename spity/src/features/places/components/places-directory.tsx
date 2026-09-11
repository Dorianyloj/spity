'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowUpRight, Building2, MapPin, Maximize2, Minimize2, Mountain, Plus, SearchX, UsersRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  FilterToolbar,
  MediaHeader,
} from '@/components/ui'
import { brandAssets } from '@/lib/brand-assets'
import { cn } from '@/lib/class-names'
import { getMapDiscipline, mapDisciplines, mapDisciplineStyles, type MapDiscipline } from '../lib/map-marker-styles'
import type { PlaceMapPoint } from './places-map'

const PlacesMap = dynamic(() => import('./places-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center rounded-lg bg-secondary text-sm text-muted-foreground" role="status">
      Chargement de la carte…
    </div>
  ),
})

type SallePlace = {
  id: string
  nom: string
  location: string
  adresse: string
  disciplines: string[]
  photoUrl: string | null
  latitude: number | null
  longitude: number | null
  niveauMin: string | null
  niveauMax: string | null
}

type FalaisePlace = {
  id: string
  nom: string
  location: string
  disciplines: string[]
  niveaux: string[] | null
  photoUrl: string | null
  latitude: number | null
  longitude: number | null
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
  secteur: string | null
}

type PlaceKind = 'all' | 'salles' | 'falaises' | 'clubs'
type MapKind = 'salles' | 'falaises'
type DisciplineFilter = 'all' | 'bloc' | 'voie' | 'grande_voie' | 'trad' | 'artif' | 'deep_water_solo' | 'via_ferrata' | 'speed'
type StatusFilter = 'all' | 'sec' | 'attention'

type DirectoryResult = {
  discipline: MapDiscipline | null
  details: string[]
  href: string
  id: string
  imageUrl: string
  kind: 'salle' | 'falaise' | 'club'
  location: string
  mapPoint: PlaceMapPoint | null
  name: string
  status: FalaisePlace['status']
}

type PlacesDirectoryProps = {
  canSuggest?: boolean
  salles: SallePlace[]
  falaises: FalaisePlace[]
  clubs: ClubPlace[]
  voies: RoutePlace[]
}

const PAGE_SIZE = 12

const disciplineLabels: Record<string, string> = {
  bloc: 'Bloc',
  voie: 'Voie',
  grande_voie: 'Grande voie',
  trad: 'Trad',
  artif: 'Artif',
  deep_water_solo: 'Deep water solo',
  via_ferrata: 'Via ferrata',
  speed: 'Vitesse',
}

const statusLabels = {
  sec: 'Sec',
  humide: 'Humide',
  attention: 'À surveiller',
  ferme: 'Fermé',
} as const

const placeKindLabels = {
  salle: 'Salle',
  falaise: 'Falaise',
  club: 'Club',
} as const

const filters = [
  { value: 'all', label: 'Tous les lieux' },
  { value: 'salles', label: 'Salles' },
  { value: 'falaises', label: 'Falaises' },
  { value: 'clubs', label: 'Clubs' },
] satisfies Array<{ value: PlaceKind; label: string }>

const disciplineFilters = [
  { value: 'all', label: 'Toutes pratiques' },
  { value: 'bloc', label: 'Bloc' },
  { value: 'voie', label: 'Voie' },
  { value: 'grande_voie', label: 'Grande voie' },
  { value: 'trad', label: 'Trad' },
  { value: 'artif', label: 'Artif' },
  { value: 'deep_water_solo', label: 'Deep water solo' },
  { value: 'via_ferrata', label: 'Via ferrata' },
  { value: 'speed', label: 'Vitesse' },
] satisfies Array<{ value: DisciplineFilter; label: string }>

const statusFilters = [
  { value: 'all', label: 'Toutes conditions' },
  { value: 'sec', label: 'Falaise sèche' },
  { value: 'attention', label: 'À surveiller ou fermée' },
] satisfies Array<{ value: StatusFilter; label: string }>

const getRoutesForCrag = (voies: RoutePlace[], falaiseId: string) => voies.filter((voie) => voie.falaiseId === falaiseId)

const includesQuery = (query: string, values: Array<string | null | undefined>) =>
  query.length === 0 || values.filter((value): value is string => Boolean(value)).join(' ').toLowerCase().includes(query)

export default function PlacesDirectory({ canSuggest = false, salles, falaises, clubs, voies }: PlacesDirectoryProps) {
  const [query, setQuery] = useState('')
  const [placeKind, setPlaceKind] = useState<PlaceKind>('all')
  const [discipline, setDiscipline] = useState<DisciplineFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [expandedMap, setExpandedMap] = useState<MapKind | null>(null)
  const normalizedQuery = query.trim().toLowerCase()

  const filteredSalles = useMemo(
    () =>
      salles.filter((salle) =>
        (placeKind === 'all' || placeKind === 'salles') &&
        (discipline === 'all' || salle.disciplines.includes(discipline)) &&
        status === 'all' &&
        includesQuery(normalizedQuery, [salle.nom, salle.location, salle.adresse, ...salle.disciplines])
      ),
    [discipline, normalizedQuery, placeKind, salles, status]
  )

  const filteredFalaises = useMemo(
    () =>
      falaises.filter((falaise) => {
        const routes = getRoutesForCrag(voies, falaise.id)
        const matchesStatus =
          status === 'all' ||
          (status === 'sec' && falaise.status === 'sec') ||
          (status === 'attention' && ['attention', 'ferme'].includes(falaise.status ?? ''))

        return (
          (placeKind === 'all' || placeKind === 'falaises') &&
          (discipline === 'all' || falaise.disciplines.includes(discipline)) &&
          matchesStatus &&
          includesQuery(normalizedQuery, [
            falaise.nom,
            falaise.location,
            ...falaise.disciplines,
            ...(falaise.niveaux ?? []),
            ...routes.flatMap((route) => [route.nom, route.cotation, route.secteur]),
          ])
        )
      }),
    [discipline, falaises, normalizedQuery, placeKind, status, voies]
  )

  const filteredClubs = useMemo(
    () =>
      clubs.filter(
        (club) =>
          (placeKind === 'all' || placeKind === 'clubs') &&
          discipline === 'all' &&
          status === 'all' &&
          includesQuery(normalizedQuery, [club.nom, club.location, club.bio, club.ffmeNum])
      ),
    [clubs, discipline, normalizedQuery, placeKind, status]
  )

  const results = useMemo<DirectoryResult[]>(
    () => [
      ...filteredSalles.map((salle) => ({
        id: salle.id,
        kind: 'salle' as const,
        discipline: getMapDiscipline(salle.disciplines, discipline === 'all' ? undefined : discipline),
        name: salle.nom,
        location: salle.location,
        href: `/app/places/salles/${salle.id}`,
        imageUrl: salle.photoUrl ?? brandAssets.indoor,
        details: [
          salle.disciplines.slice(0, 2).map((value) => disciplineLabels[value] ?? value).join(' · '),
          salle.niveauMin && salle.niveauMax ? `${salle.niveauMin} – ${salle.niveauMax}` : '',
        ].filter(Boolean),
        status: null,
        mapPoint:
          salle.latitude !== null && salle.longitude !== null
            ? {
                id: salle.id,
                kind: 'salle' as const,
                name: salle.nom,
                location: salle.location,
                href: `/app/places/salles/${salle.id}`,
                latitude: salle.latitude,
                longitude: salle.longitude,
                discipline: getMapDiscipline(salle.disciplines, discipline === 'all' ? undefined : discipline),
              }
            : null,
      })),
      ...filteredFalaises.map((falaise) => {
        const routes = getRoutesForCrag(voies, falaise.id)

        return {
          id: falaise.id,
          kind: 'falaise' as const,
          discipline: getMapDiscipline(falaise.disciplines, discipline === 'all' ? undefined : discipline),
          name: falaise.nom,
          location: falaise.location,
          href: `/app/places/falaises/${falaise.id}`,
          imageUrl: falaise.photoUrl ?? brandAssets.crag,
          details: [
            falaise.disciplines.slice(0, 2).map((value) => disciplineLabels[value] ?? value).join(' · '),
            routes.length > 0 ? `${routes.length} voie${routes.length > 1 ? 's' : ''}` : '',
          ].filter(Boolean),
          status: falaise.status,
          mapPoint:
            falaise.latitude !== null && falaise.longitude !== null
              ? {
                  id: falaise.id,
                  kind: 'falaise' as const,
                  name: falaise.nom,
                  location: falaise.location,
                  href: `/app/places/falaises/${falaise.id}`,
                  latitude: falaise.latitude,
                  longitude: falaise.longitude,
                  discipline: getMapDiscipline(falaise.disciplines, discipline === 'all' ? undefined : discipline),
                }
              : null,
        }
      }),
      ...filteredClubs.map((club) => ({
        id: club.id,
        kind: 'club' as const,
        discipline: null,
        name: club.nom,
        location: club.location ?? 'Localisation à compléter',
        href: `/app/places/clubs/${club.id}`,
        imageUrl: brandAssets.heroSunset,
        details: [club.ffmeNum ?? 'Club local'],
        mapPoint: null,
        status: null,
      })),
    ],
    [discipline, filteredClubs, filteredFalaises, filteredSalles, voies]
  )

  const displayedResults = results.slice(0, visibleCount)
  const salleMapPoints = results.flatMap((result) => result.kind === 'salle' && result.mapPoint ? [result.mapPoint] : [])
  const falaiseMapPoints = results.flatMap((result) => result.kind === 'falaise' && result.mapPoint ? [result.mapPoint] : [])
  const mapPanels = ([
    { kind: 'falaises', title: 'Carte des falaises', ariaLabel: 'Carte des falaises correspondant à la recherche', points: falaiseMapPoints },
    { kind: 'salles', title: 'Carte des salles', ariaLabel: 'Carte des salles correspondant à la recherche', points: salleMapPoints },
  ] satisfies Array<{ ariaLabel: string; kind: MapKind; points: PlaceMapPoint[]; title: string }>).filter((panel) => {
    if (expandedMap) return panel.kind === expandedMap
    if (placeKind === 'clubs') return false
    if (placeKind === 'salles' || placeKind === 'falaises') return panel.kind === placeKind
    return panel.points.length > 0
  })
  const isMapExpanded = expandedMap !== null
  const hasActiveFilters = query.length > 0 || placeKind !== 'all' || discipline !== 'all' || status !== 'all'

  const resetFilters = () => {
    setQuery('')
    setPlaceKind('all')
    setDiscipline('all')
    setStatus('all')
    setVisibleCount(PAGE_SIZE)
    setSelectedPlaceId(null)
  }

  const changeQuery = (value: string) => {
    setQuery(value)
    setVisibleCount(PAGE_SIZE)
  }

  const changePlaceKind = (value: PlaceKind) => {
    setPlaceKind(value)
    setVisibleCount(PAGE_SIZE)
  }

  const changeDiscipline = (value: DisciplineFilter) => {
    setDiscipline(value)
    setVisibleCount(PAGE_SIZE)
  }

  const changeStatus = (value: StatusFilter) => {
    setStatus(value)
    setVisibleCount(PAGE_SIZE)
  }

  const selectMapPoint = (placeId: string) => {
    const placeIndex = results.findIndex((result) => result.id === placeId)

    if (placeIndex >= visibleCount) {
      setVisibleCount(Math.ceil((placeIndex + 1) / PAGE_SIZE) * PAGE_SIZE)
    }

    setSelectedPlaceId(placeId)
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Explorer</p>
          <h1 className="mt-1 text-balance text-3xl font-bold text-white sm:text-4xl">Lieux d’escalade</h1>
          <p className="mt-2 max-w-2xl text-pretty text-sm text-zinc-300">Trouve un spot, vérifie les conditions, puis ouvre la fiche quand tu veux les détails.</p>
        </div>
        {canSuggest && (
          <Link className="spity-btn spity-btn--primary shrink-0" href="/app/places/suggest">
            <Plus size={18} aria-hidden="true" />
            Ajouter un lieu
          </Link>
        )}
      </header>

      <FilterToolbar
        compactReset
        countLabel={`${results.length} lieu${results.length > 1 ? 'x' : ''} trouvé${results.length > 1 ? 's' : ''}`}
        filters={[
          { label: 'Type', options: filters, value: placeKind, onChange: (value) => changePlaceKind(value as PlaceKind) },
          { label: 'Pratique', options: disciplineFilters, value: discipline, onChange: (value) => changeDiscipline(value as DisciplineFilter) },
          { label: 'Conditions', options: statusFilters, value: status, onChange: (value) => changeStatus(value as StatusFilter) },
        ]}
        query={query}
        queryPlaceholder="Nom, ville ou voie…"
        onQueryChange={changeQuery}
        onReset={resetFilters}
        resetLabel="Réinitialiser les filtres"
        showCount={false}
        showReset={hasActiveFilters}
      />

      <div className={cn('grid items-start gap-6', isMapExpanded || mapPanels.length === 0 ? 'grid-cols-1' : 'xl:grid-cols-[minmax(0,1fr)_23rem]')}>
        {!isMapExpanded && <section aria-labelledby="places-results-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="places-results-heading" className="text-balance text-xl font-bold text-white">Résultats</h2>
            {results.length > 0 && <span className="text-sm tabular-nums text-zinc-300">{Math.min(displayedResults.length, results.length)} / {results.length}</span>}
          </div>

          {displayedResults.length > 0 ? (
            <ul className="space-y-3">
              {displayedResults.map((result) => {
                const Icon = result.kind === 'salle' ? Building2 : result.kind === 'falaise' ? Mountain : UsersRound
                const isSelected = result.id === selectedPlaceId

                return (
                  <li key={`${result.kind}-${result.id}`}>
                    <Link
                      href={result.href}
                      className={cn(
                        'group flex min-h-36 overflow-hidden rounded-lg border bg-card shadow-sm outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        isSelected ? 'border-primary' : 'border-border'
                      )}
                    >
                      <div className="relative w-32 shrink-0 sm:w-44">
                        <MediaHeader className="absolute inset-0 size-full" imageUrl={result.imageUrl} />
                        <Badge className="absolute left-3 top-3 gap-1.5 border border-white/70 bg-background/90 text-foreground shadow-sm">
                          <Icon size={14} aria-hidden="true" />
                          {placeKindLabels[result.kind]}
                        </Badge>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-balance text-lg font-bold leading-tight text-foreground">{result.name}</h3>
                            <p className="mt-2 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                              <MapPin className="shrink-0" size={16} aria-hidden="true" />
                              {result.location}
                            </p>
                          </div>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:border-primary group-hover:text-foreground" aria-hidden="true">
                            <ArrowUpRight size={17} aria-hidden="true" />
                          </span>
                        </div>
                        {(result.details.length > 0 || result.status) && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {result.details.slice(0, 3).map((detail, index) => <Badge className="gap-1.5" key={detail} variant="secondary">
                              {index === 0 && result.discipline && <span className={cn('size-2 rounded-full', mapDisciplineStyles[result.discipline].dotClassName)} aria-hidden="true" />}
                              {detail}
                            </Badge>)}
                            {result.status && <Badge variant={result.status === 'sec' ? 'success' : result.status === 'ferme' ? 'destructive' : result.status === 'attention' ? 'warning' : 'secondary'}>
                              {statusLabels[result.status]}
                            </Badge>}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <EmptyState
              icon={SearchX}
              title="Aucun lieu trouvé"
              description={hasActiveFilters ? 'Essaie avec moins de filtres ou réinitialise la recherche.' : 'Aucun lieu n’est encore publié.'}
            />
          )}

          {displayedResults.length < results.length && (
            <div className="mt-5 flex justify-center">
              <Button variant="secondary" onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}>
                Afficher {Math.min(PAGE_SIZE, results.length - displayedResults.length)} lieu{results.length - displayedResults.length > 1 ? 'x' : ''} de plus
              </Button>
            </div>
          )}
        </section>}

        {mapPanels.length > 0 && (
          <aside className={cn('space-y-6', isMapExpanded && 'col-span-full')} aria-label="Cartes des lieux">
            {mapPanels.map((panel) => {
              const panelIsExpanded = expandedMap === panel.kind
              const legendDisciplines = mapDisciplines.filter((item) => panel.points.some((point) => point.discipline === item))

              return (
                <Card hover={false} key={panel.kind}>
                  <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle>{panel.title}</CardTitle>
                      <CardDescription>{panel.points.length > 0 ? 'Clique un groupe pour zoomer.' : 'Aucune position pour ces résultats.'}</CardDescription>
                    </div>
                    <Button
                      aria-label={`${panelIsExpanded ? 'Réduire' : 'Agrandir'} la ${panel.title.toLowerCase()}`}
                      aria-pressed={panelIsExpanded}
                      onClick={() => setExpandedMap(panelIsExpanded ? null : panel.kind)}
                      size="sm"
                      type="button"
                      variant="secondary"
                    >
                      {panelIsExpanded ? <Minimize2 aria-hidden="true" size={16} /> : <Maximize2 aria-hidden="true" size={16} />}
                      {panelIsExpanded ? 'Réduire' : 'Agrandir'}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-hidden rounded-lg border border-border">
                      {panel.points.length > 0 ? (
                        <PlacesMap
                          ariaLabel={panel.ariaLabel}
                          className={panelIsExpanded ? 'h-[calc(100dvh-14rem)] min-h-96' : 'h-64'}
                          expanded={panelIsExpanded}
                          places={panel.points}
                          selectedPlaceId={selectedPlaceId}
                          onSelect={selectMapPoint}
                        />
                      ) : (
                        <div className={cn('flex items-center justify-center bg-secondary px-6 text-center text-pretty text-sm text-muted-foreground', panelIsExpanded ? 'h-[calc(100dvh-14rem)] min-h-96' : 'h-64')}>
                          Aucun lieu géolocalisé.
                        </div>
                      )}
                    </div>
                    {legendDisciplines.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        {legendDisciplines.map((item: MapDiscipline) => (
                          <span className="flex items-center gap-1.5" key={item}>
                            <span className={cn('size-2 rounded-full', mapDisciplineStyles[item].dotClassName)} aria-hidden="true" />
                            {mapDisciplineStyles[item].label}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </aside>
        )}
      </div>
    </div>
  )
}
