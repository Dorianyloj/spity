'use client'

import { useMemo, useState } from 'react'
import { Badge, Button, FilterToolbar } from '@/components/ui'
import { cn } from '@/lib/class-names'
import { cragRouteDisciplineLabels, type CragRouteDiscipline } from '@/lib/climbing-disciplines'
import { climbingGradeRank } from '../lib/grade-range'

type RouteStatus = 'ok' | 'humide' | 'spit_a_verifier' | 'fermee'
type RouteSort = 'hardest' | 'easiest' | 'name'

export type CragRoute = {
  cotation: string
  degaines: number | null
  discipline: CragRouteDiscipline
  hauteur: number | null
  id: string
  nom: string
  secteur: string | null
  status: RouteStatus | null
  style: string | null
  voteCount: number
}

type CragRouteListProps = {
  routes: CragRoute[]
}

const statusLabels: Record<RouteStatus | 'unknown', string> = {
  ok: 'OK',
  humide: 'Humide',
  spit_a_verifier: 'Spit à vérifier',
  fermee: 'Fermée',
  unknown: 'À confirmer',
}

const statusVariants: Record<RouteStatus | 'unknown', 'secondary' | 'success' | 'warning' | 'destructive'> = {
  ok: 'success',
  humide: 'warning',
  spit_a_verifier: 'warning',
  fermee: 'destructive',
  unknown: 'secondary',
}

const normalize = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('fr-FR')

export const gradeColorClass = (grade: string) => {
  const rank = climbingGradeRank(grade)

  if (rank >= 80) return 'bg-red-800 text-white'
  if (rank >= 70) return 'bg-orange-600 text-white'
  if (rank >= 65) return 'bg-orange-500 text-white'
  if (rank >= 60) return 'bg-amber-400 text-slate-950'
  if (rank >= 50) return 'bg-lime-400 text-slate-950'
  return 'bg-emerald-700 text-white'
}

export default function CragRouteList({ routes }: CragRouteListProps) {
  const [query, setQuery] = useState('')
  const [sector, setSector] = useState('all')
  const [status, setStatus] = useState<RouteStatus | 'unknown' | 'all'>('all')
  const [sort, setSort] = useState<RouteSort>('hardest')
  const sectors = useMemo(
    () => Array.from(new Set(routes.map((route) => route.secteur).filter((value): value is string => Boolean(value)))).sort((first, second) => first.localeCompare(second, 'fr')),
    [routes]
  )
  const normalizedQuery = normalize(query.trim())
  const filteredRoutes = useMemo(
    () => routes
      .filter((route) => {
        const routeStatus = route.status ?? 'unknown'
        const matchesQuery = !normalizedQuery || normalize([route.nom, route.cotation, route.secteur, route.style].filter(Boolean).join(' ')).includes(normalizedQuery)

        return matchesQuery && (sector === 'all' || route.secteur === sector) && (status === 'all' || routeStatus === status)
      })
      .sort((first, second) => {
        if (sort === 'name') return first.nom.localeCompare(second.nom, 'fr')

        const order = climbingGradeRank(first.cotation) - climbingGradeRank(second.cotation)
        return sort === 'hardest' ? -order : order
      }),
    [normalizedQuery, routes, sector, sort, status]
  )
  const hasFilters = query.length > 0 || sector !== 'all' || status !== 'all' || sort !== 'hardest'

  const reset = () => {
    setQuery('')
    setSector('all')
    setStatus('all')
    setSort('hardest')
  }

  return (
    <div className="space-y-3">
      <FilterToolbar
        compactReset
        countLabel={`${filteredRoutes.length} voie${filteredRoutes.length > 1 ? 's' : ''} affichée${filteredRoutes.length > 1 ? 's' : ''}`}
        filters={[
          { label: 'Secteur', value: sector, onChange: setSector, options: [{ value: 'all', label: 'Tous les secteurs' }, ...sectors.map((value) => ({ value, label: value }))] },
          { label: 'État', value: status, onChange: (value) => setStatus(value as RouteStatus | 'unknown' | 'all'), options: [{ value: 'all', label: 'Tous les états' }, ...Object.entries(statusLabels).map(([value, label]) => ({ value, label }))] },
          { label: 'Trier', value: sort, onChange: (value) => setSort(value as RouteSort), options: [{ value: 'hardest', label: 'Plus difficile' }, { value: 'easiest', label: 'Plus facile' }, { value: 'name', label: 'Nom A–Z' }] },
        ]}
        onQueryChange={setQuery}
        query={query}
        queryLabel="Rechercher une voie"
        queryPlaceholder="Nom, secteur ou cotation…"
        onReset={reset}
        resetLabel="Réinitialiser les filtres"
        showCount={false}
        showReset={hasFilters}
      />

      {filteredRoutes.length > 0 ? <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {filteredRoutes.map((route) => {
          const routeStatus = route.status ?? 'unknown'
          const details = [cragRouteDisciplineLabels[route.discipline], route.secteur ?? 'Secteur à préciser', route.style ?? 'style à préciser'].join(' · ')
          const measures = [route.hauteur ? `${route.hauteur} m` : null, route.degaines ? `${route.degaines} dégaines` : null].filter(Boolean).join(' · ')

          return (
            <li key={route.id}>
              <article className="grid gap-2 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-4">
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-foreground" title={route.nom}>{route.nom}</h3>
                  <p className="truncate text-sm text-muted-foreground" title={details}>{details}</p>
                </div>
                <p className="text-sm tabular-nums text-muted-foreground">{measures || 'Infos à compléter'}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariants[routeStatus]}>{statusLabels[routeStatus]}</Badge>
                  {route.voteCount > 0 && <span className="text-xs tabular-nums text-muted-foreground">{route.voteCount} avis</span>}
                </div>
                <Badge className={cn('justify-self-start tabular-nums sm:justify-self-end', gradeColorClass(route.cotation))} title={`Cotation ${route.cotation}`}>{route.cotation}</Badge>
              </article>
            </li>
          )
        })}
      </ul> : <div className="rounded-lg border border-dashed border-border p-5 text-center">
        <p className="text-pretty text-sm text-muted-foreground">Aucune voie ne correspond à cette recherche.</p>
        {hasFilters && <Button className="mt-3" onClick={reset} size="sm" variant="secondary">Effacer les filtres</Button>}
      </div>}
    </div>
  )
}
