'use client'

import { Handshake, MapPin, RotateCcw, Search, Send, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { AppHero, Badge, Button, Card, CardContent, EmptyState, Input } from '@/components/ui'
import { demoClimbingAssets } from '@/lib/brand-assets'
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
  const [feedback, setFeedback] = useState<string | null>(null)
  const visibleClimbers = useMemo(() => filterClimbers(climbers, filters), [climbers, filters])

  const requestPartnership = async (recipientId: string) => {
    setPendingUserId(recipientId)
    setFeedback(null)

    const response = await fetch('/api/partnerships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId }),
    })

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      setPendingUserId(null)
      return
    }

    const payload: unknown = await response.json()
    const parsedPayload = partnershipResponseSchema.safeParse(payload)

    if (parsedPayload.success) {
      setStatuses((current) => ({ ...current, [recipientId]: parsedPayload.data.request.status }))
      setFeedback(`Demande envoyée à ${parsedPayload.data.request.otherParticipant.displayName}.`)
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

      <section className="rounded-lg border border-white/70 bg-[#fbfdf8]/92 p-4 backdrop-blur-xl" aria-label="Filtres de recherche">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Input
            icon={<Search size={18} aria-hidden="true" />}
            label="Nom ou localisation"
            onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
            placeholder="Lyon, Camille..."
            value={filters.query}
          />
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
        <div className="mt-3 flex justify-end">
          <Button onClick={() => setFilters({ query: '' })} size="sm" variant="ghost">
            <RotateCcw size={16} aria-hidden="true" />
            Réinitialiser les filtres
          </Button>
        </div>
      </section>

      <p className="min-h-6 text-sm font-semibold text-foreground" aria-live="polite">{feedback}</p>

      {visibleClimbers.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="Aucun profil ne correspond"
          description="Modifiez les filtres ou complétez votre propre profil public pour améliorer le matching."
        />
      ) : (
        <section className="grid gap-4 lg:grid-cols-2" aria-label="Profils disponibles">
          {visibleClimbers.map((climber) => {
            const status = statuses[climber.userId]
            const primaryGrade = Object.values(climber.niveaux)[0]

            return (
              <Card key={climber.userId} hover={false} className="overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Link
                      aria-label={`Voir le profil de ${climber.displayName}`}
                      className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                      href={`/app/profiles/${climber.userId}`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-black text-primary-foreground">
                        {climber.displayName.slice(0, 1).toLocaleUpperCase('fr')}
                      </div>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h2 className="text-lg font-bold text-foreground">
                            <Link
                              aria-label={`Voir le profil de ${climber.displayName}`}
                              className="rounded underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              href={`/app/profiles/${climber.userId}`}
                            >
                              {climber.displayName}
                            </Link>
                          </h2>
                          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin size={15} aria-hidden="true" />
                            {climber.location ?? 'Localisation non renseignée'}
                          </p>
                        </div>
                        <Badge variant="primary">{primaryGrade ?? 'Niveau libre'}</Badge>
                      </div>
                      {climber.bio && <p className="mt-3 text-sm text-muted-foreground">{climber.bio}</p>}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {climber.disciplines.map((discipline) => (
                          <Badge key={discipline} variant="secondary">{discipline}</Badge>
                        ))}
                        {climber.climbingEnvironment && <Badge variant="default">{climber.climbingEnvironment}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 border-t border-border pt-4">
                    <Button
                      disabled={status === 'pending' || status === 'accepted'}
                      isLoading={pendingUserId === climber.userId}
                      onClick={() => void requestPartnership(climber.userId)}
                      size="sm"
                      variant={status ? 'secondary' : 'primary'}
                    >
                      {status === 'accepted' ? <Handshake size={17} aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
                      {status ? statusLabels[status] : 'Envoyer une demande'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}
    </div>
  )
}
