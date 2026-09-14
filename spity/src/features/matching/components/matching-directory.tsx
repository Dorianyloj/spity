'use client'

import { ArrowUpRight, Clock3, Handshake, MapPin, RotateCcw, Search, Send, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { AppHero, Avatar, Badge, Button, Card, CardContent, EmptyState, Input } from '@/components/ui'
import { availabilityLabels, disciplineLabels, environmentLabels, partnerStyleLabels } from '@/features/profile/lib/presentation'
import { demoClimbingAssets } from '@/lib/brand-assets'
import { cn } from '@/lib/class-names'
import { filterClimbers } from '../lib/matching-rules'
import {
  partnershipResponseSchema,
  type MatchingFilters,
  type PartnershipRequest,
  type PublicClimber,
} from '../schemas'

type MatchingDirectoryProps = {
  climbers: PublicClimber[]
  initialStatuses: Record<string, PartnershipRequest['status']>
}

const disciplineOptions = [
  { value: '', label: 'Toutes les pratiques' },
  { value: 'bloc', label: 'Bloc' },
  { value: 'voie', label: 'Voie' },
  { value: 'trad', label: 'Trad' },
  { value: 'grandes-voies', label: 'Grandes voies' },
] as const

const availabilityOptions = [
  { value: '', label: 'Toutes les disponibilités' },
  { value: 'weekday_morning', label: 'Semaine matin' },
  { value: 'weekday_lunch', label: 'Semaine midi' },
  { value: 'weekday_evening', label: 'Semaine soir' },
  { value: 'weekend_morning', label: 'Week-end matin' },
  { value: 'weekend_afternoon', label: 'Week-end après-midi' },
  { value: 'weekend_evening', label: 'Week-end soir' },
] as const

const environmentOptions = [
  { value: '', label: 'Tous les environnements' },
  { value: 'indoor', label: 'Salle' },
  { value: 'outdoor', label: 'Falaise' },
  { value: 'mixed', label: 'Salle et falaise' },
] as const

const gradeOptions = [
  '', '4a', '4b', '4c', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+',
  '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+',
] as const

const statusLabels: Record<PartnershipRequest['status'], string> = {
  pending: 'Demande en attente',
  accepted: 'Partenaire confirmé',
  declined: 'Relancer la demande',
}

const parseApiError = async (response: Response) => {
  const payload: unknown = await response.json().catch(() => null)
  const result = z.object({ error: z.string() }).safeParse(payload)

  return result.success ? result.data.error : 'La demande n’a pas pu être envoyée'
}

export default function MatchingDirectory({ climbers, initialStatuses }: MatchingDirectoryProps) {
  const [filters, setFilters] = useState<MatchingFilters>({ query: '' })
  const [statuses, setStatuses] = useState(initialStatuses)
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ userId: string; message: string; error: boolean } | null>(null)
  const visibleClimbers = useMemo(() => filterClimbers(climbers, filters), [climbers, filters])
  const hasActiveFilters = Object.values(filters).some(Boolean)

  const requestPartnership = async (recipientId: string) => {
    setPendingUserId(recipientId)
    setFeedback(null)

    const response = await fetch('/api/partnerships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId }),
    })

    if (!response.ok) {
      setFeedback({ userId: recipientId, message: await parseApiError(response), error: true })
      setPendingUserId(null)
      return
    }

    const payload: unknown = await response.json()
    const parsedPayload = partnershipResponseSchema.safeParse(payload)

    if (parsedPayload.success) {
      setStatuses((current) => ({ ...current, [recipientId]: parsedPayload.data.request.status }))
      setFeedback({ userId: recipientId, message: `Demande envoyée à ${parsedPayload.data.request.otherParticipant.displayName}.`, error: false })
    }

    setPendingUserId(null)
  }

  return (
    <div className="space-y-6">
      <AppHero
        backgroundImage={demoClimbingAssets.fontainebleau}
        description="Filtrez les profils disponibles puis envoyez une demande de partenariat suivie dans Spity."
        eyebrow="Matching grimpeurs"
        stats={[
          { label: 'profils disponibles', value: climbers.length },
          { label: 'résultats', value: visibleClimbers.length },
        ]}
        title="Trouver un partenaire"
      >
        <Link className="spity-btn spity-btn--secondary" href="/app/partnerships">
          <Handshake size={18} aria-hidden="true" />
          Suivre mes demandes
        </Link>
      </AppHero>

      <section className="rounded-lg border border-white/70 bg-card p-4 shadow-sm sm:p-5" aria-label="Filtres de recherche">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="sm:col-span-2 xl:col-span-1">
            <Input
              icon={<Search size={18} aria-hidden="true" />}
              label="Nom ou localisation"
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              placeholder="Lyon, Camille..."
              type="search"
              value={filters.query}
            />
          </div>
          <label className="text-sm font-medium text-foreground">
            Discipline
            <select
              className="spity-input mt-1.5 min-h-11 w-full"
              onChange={(event) => setFilters((current) => ({
                ...current,
                discipline: event.target.value === '' ? undefined : event.target.value as MatchingFilters['discipline'],
              }))}
              value={filters.discipline ?? ''}
            >
              {disciplineOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Niveau
            <select
              className="spity-input mt-1.5 min-h-11 w-full"
              onChange={(event) => setFilters((current) => ({
                ...current,
                grade: event.target.value === '' ? undefined : event.target.value as MatchingFilters['grade'],
              }))}
              value={filters.grade ?? ''}
            >
              {gradeOptions.map((grade) => <option key={grade || 'all'} value={grade}>{grade || 'Tous les niveaux'}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Disponibilité
            <select
              className="spity-input mt-1.5 min-h-11 w-full"
              onChange={(event) => setFilters((current) => ({
                ...current,
                availability: event.target.value === '' ? undefined : event.target.value as MatchingFilters['availability'],
              }))}
              value={filters.availability ?? ''}
            >
              {availabilityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-foreground">
            Environnement
            <select
              className="spity-input mt-1.5 min-h-11 w-full"
              onChange={(event) => setFilters((current) => ({
                ...current,
                environment: event.target.value === '' ? undefined : event.target.value as MatchingFilters['environment'],
              }))}
              value={filters.environment ?? ''}
            >
              {environmentOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
          <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
            <span className="font-semibold tabular-nums text-foreground">{visibleClimbers.length}</span> {visibleClimbers.length === 1 ? 'profil trouvé' : 'profils trouvés'}
          </p>
          <Button onClick={() => setFilters({ query: '' })} size="sm" variant="ghost">
            <RotateCcw size={16} aria-hidden="true" />
            Réinitialiser les filtres
          </Button>
        </div>
      </section>

      {visibleClimbers.length === 0 ? (
        <div className="space-y-3">
          <EmptyState
            icon={UsersRound}
            title={climbers.length === 0 ? 'Aucun grimpeur disponible pour le moment' : 'Aucun profil ne correspond'}
            description={climbers.length === 0 ? 'Revenez bientôt pour découvrir de nouveaux partenaires.' : 'Essayez une autre pratique, un autre niveau ou une autre localisation.'}
          />
          {hasActiveFilters && <Button onClick={() => setFilters({ query: '' })} size="sm" variant="secondary">Effacer les filtres</Button>}
          {climbers.length === 0 && <Link className="spity-btn spity-btn--secondary" href="/profile/me">Vérifier mon profil public</Link>}
        </div>
      ) : (
        <section aria-labelledby="matching-results-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 id="matching-results-heading" className="text-balance text-xl font-bold text-white sm:text-2xl">Grimpeurs à rencontrer</h2>
              <p className="text-sm text-white/75">Découvrez leur pratique avant de proposer une sortie.</p>
            </div>
          </div>
          <div className="grid items-stretch gap-4 lg:grid-cols-2">
            {visibleClimbers.map((climber) => {
              const status = statuses[climber.userId]
              const primaryGrade = Object.values(climber.niveaux)[0]
              const availability = climber.availability.slice(0, 2)

              return (
              <Card key={climber.userId} hover={false} className="overflow-hidden">
                <CardContent className="flex h-full flex-col p-5 sm:p-6">
                  <div className="flex min-w-0 items-start gap-4">
                    <Avatar src={climber.avatarUrl ?? undefined} alt="" fallback={climber.displayName} size="xl" className="shrink-0 border border-border bg-secondary" unoptimized={climber.avatarUrl?.startsWith('http') ?? false} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-balance text-lg font-bold leading-tight text-foreground">
                            <Link className="rounded underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={`/app/profiles/${climber.userId}`}>{climber.displayName}</Link>
                          </h3>
                          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin size={15} aria-hidden="true" />
                            {climber.location ?? 'Localisation non renseignée'}
                          </p>
                        </div>
                        <Badge variant="primary" className="shrink-0 tabular-nums">{primaryGrade ? `Niveau ${primaryGrade}` : 'Niveau libre'}</Badge>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-2 min-h-10 text-pretty text-sm text-muted-foreground">
                    {climber.bio || climber.partnerSearch.notes || 'Ce grimpeur cherche de nouvelles personnes avec qui partager ses séances.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {climber.disciplines.map((discipline) => (
                      <Badge key={discipline} variant="secondary">{disciplineLabels[discipline] ?? discipline}</Badge>
                    ))}
                    {climber.climbingEnvironment && <Badge variant="default">{environmentLabels[climber.climbingEnvironment]}</Badge>}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-sm text-foreground">
                    <p className="flex items-start gap-2">
                      <Clock3 className="mt-0.5 shrink-0 text-accent-foreground" size={16} aria-hidden="true" />
                      <span>{availability.length ? availability.map((slot) => availabilityLabels[slot]).join(' · ') + (climber.availability.length > 2 ? ` · +${climber.availability.length - 2}` : '') : 'Disponibilités à préciser'}</span>
                    </p>
                    <p className="text-muted-foreground">Ambiance · {partnerStyleLabels[climber.partnerSearch.style]}</p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <Button
                      disabled={status === 'pending' || status === 'accepted'}
                      isLoading={pendingUserId === climber.userId}
                      onClick={() => void requestPartnership(climber.userId)}
                      size="sm"
                      variant={status ? 'secondary' : 'primary'}
                    >
                      {status === 'accepted' ? <Handshake size={17} aria-hidden="true" /> : status === 'pending' ? <Clock3 size={17} aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
                      {status ? statusLabels[status] : 'Envoyer une demande'}
                    </Button>
                    <Link className="inline-flex min-h-11 items-center gap-1 rounded px-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={`/app/profiles/${climber.userId}`}>
                      Voir le profil <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                  {feedback?.userId === climber.userId && <p className={cn('mt-3 text-sm font-medium', feedback.error ? 'text-destructive' : 'text-accent-foreground')} role={feedback.error ? 'alert' : 'status'}>{feedback.message}</p>}
                </CardContent>
              </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
