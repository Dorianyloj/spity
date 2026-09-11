'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Building2, MapPin, Maximize2, Minimize2, Mountain, Plus, SearchX, UsersRound } from 'lucide-react'
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
type DisciplineFilter = 'all' | 'bloc' | 'voie' | 'grande_voie' | 'trad' | 'artif' | 'deep_water_solo' | 'via_ferrata' | 'speed'
type StatusFilter = 'all' | 'sec' | 'attention'

type DirectoryResult = {
  details: string[]
  href: string
  id: string
  imageUrl: string
  kind: 'salle' | 'falaise' | 'club'
  location: string
  mapPoint: PlaceMapPoint | null
  name: string
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
  const [isMapExpanded, setIsMapExpanded] = useState(false)
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
        name: salle.nom,
        location: salle.location,
        href: `/app/places/salles/${salle.id}`,
        imageUrl: salle.photoUrl ?? brandAssets.indoor,
        details: [
          salle.disciplines.slice(0, 2).map((value) => disciplineLabels[value] ?? value).join(' · '),
          salle.niveauMin && salle.niveauMax ? `${salle.niveauMin} – ${salle.niveauMax}` : '',
        ].filter(Boolean),
        mapPoint:
          salle.latitude !== null && salle.longitude !== null
            ? { id: salle.id, kind: 'salle' as const, name: salle.nom, location: salle.location, href: `/app/places/salles/${salle.id}`, latitude: salle.latitude, longitude: salle.longitude }
            : null,
      })),
      ...filteredFalaises.map((falaise) => {
        const routes = getRoutesForCrag(voies, falaise.id)

        return {
          id: falaise.id,
          kind: 'falaise' as const,
          name: falaise.nom,
          location: falaise.location,
          href: `/app/places/falaises/${falaise.id}`,
          imageUrl: falaise.photoUrl ?? brandAssets.crag,
          details: [
            falaise.disciplines.slice(0, 2).map((value) => disciplineLabels[value] ?? value).join(' · '),
            routes.length > 0 ? `${routes.length} voie${routes.length > 1 ? 's' : ''}` : '',
            falaise.status ? statusLabels[falaise.status] : '',
          ].filter(Boolean),
          mapPoint:
            falaise.latitude !== null && falaise.longitude !== null
              ? { id: falaise.id, kind: 'falaise' as const, name: falaise.nom, location: falaise.location, href: `/app/places/falaises/${falaise.id}`, latitude: falaise.latitude, longitude: falaise.longitude }
              : null,
        }
      }),
      ...filteredClubs.map((club) => ({
        id: club.id,
        kind: 'club' as const,
        name: club.nom,
        location: club.location ?? 'Localisation à compléter',
        href: `/app/places/clubs/${club.id}`,
        imageUrl: brandAssets.heroSunset,
        details: [club.ffmeNum ?? 'Club local'],
        mapPoint: null,
      })),
    ],
    [filteredClubs, filteredFalaises, filteredSalles, voies]
  )

  const displayedResults = results.slice(0, visibleCount)
  const mapPoints = results.flatMap((result) => (result.mapPoint ? [result.mapPoint] : []))
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
        showReset={hasActiveFilters}
      />

      <div className={cn('grid items-start gap-6', isMapExpanded ? 'grid-cols-1' : 'xl:grid-cols-[minmax(0,1fr)_23rem]')}>
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
                        'group flex overflow-hidden rounded-lg border bg-card shadow-sm outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                        isSelected ? 'border-primary' : 'border-border'
                      )}
                    >
                      <MediaHeader className="size-24 shrink-0 sm:size-28" imageUrl={result.imageUrl} />
                      <div className="min-w-0 flex-1 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-bold text-foreground">{result.name}</h3>
                            <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground"><MapPin size={15} aria-hidden="true" />{result.location}</p>
                          </div>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground" aria-hidden="true">
                            <Icon size={18} aria-hidden="true" />
                          </span>
                        </div>
                        {result.details.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {result.details.slice(0, 3).map((detail) => <Badge key={detail} variant="secondary">{detail}</Badge>)}
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

        <aside className={cn(isMapExpanded && 'col-span-full')} aria-labelledby="places-map-heading">
          <Card hover={false}>
            <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle id="places-map-heading">Carte des lieux</CardTitle>
                <CardDescription>{mapPoints.length > 0 ? 'Dézoome pour regrouper les lieux, puis clique un groupe pour l’ouvrir.' : 'Aucun des résultats ne possède encore de position.'}</CardDescription>
              </div>
              <Button aria-pressed={isMapExpanded} onClick={() => setIsMapExpanded((expanded) => !expanded)} size="sm" type="button" variant="secondary">
                {isMapExpanded ? <Minimize2 aria-hidden="true" size={16} /> : <Maximize2 aria-hidden="true" size={16} />}
                {isMapExpanded ? 'Réduire la carte' : 'Agrandir la carte'}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-border">
                {mapPoints.length > 0 ? <PlacesMap className={isMapExpanded ? 'h-[calc(100dvh-14rem)] min-h-96' : 'h-80'} expanded={isMapExpanded} places={mapPoints} selectedPlaceId={selectedPlaceId} onSelect={selectMapPoint} /> : <div className={cn('flex items-center justify-center bg-secondary px-6 text-center text-pretty text-sm text-muted-foreground', isMapExpanded ? 'h-[calc(100dvh-14rem)] min-h-96' : 'h-80')}>Ajoute une position sur la fiche d’un lieu pour l’afficher ici.</div>}
              </div>
              {mapPoints.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#173236]" aria-hidden="true" />Salle</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" aria-hidden="true" />Falaise</span>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
