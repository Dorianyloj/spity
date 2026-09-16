'use client'

import { CalendarDays, CalendarPlus, Check, MapPin, Pencil, RefreshCw, TicketCheck, UsersRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AppHero, Badge, Button, Card, EmptyState } from '@/components/ui'
import { useLiveResource } from '@/hooks/use-live-resource'
import { ApiRequestError, requestJson } from '@/lib/api-client'
import { demoClimbingAssets } from '@/lib/brand-assets'
import { eventListResponseSchema, eventResponseSchema, type SpityEvent } from '../schemas'
import EventForm from './event-form'

type EventsBoardProps = {
  initialEvents: SpityEvent[]
  role: 'grimpeur' | 'club'
}

const typeLabels = {
  outing: 'Sortie',
  contest: 'Contest',
  coaching: 'Coaching',
  initiation: 'Initiation',
} as const

const formatEventDate = (value: string) => new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
  timeStyle: 'short',
}).format(new Date(value))

export default function EventsBoard({ initialEvents, role }: EventsBoardProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const { data, update, refresh, isRefreshing, error: refreshError } = useLiveResource({
    initialData: { events: initialEvents },
    url: '/api/events',
    schema: eventListResponseSchema,
    paused: pendingId !== null || showCreateForm || editingId !== null,
  })
  const events = data.events
  const editingEvent = events.find((event) => event.id === editingId)
  const orderedEvents = useMemo(() => [...events].sort((first, second) => (
    new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime()
  )), [events])

  const mergeEvent = (freshEvent: SpityEvent) => {
    update((currentData) => {
      const current = currentData.events
      const exists = current.some((event) => event.id === freshEvent.id)

      return { events: exists
        ? current.map((event) => event.id === freshEvent.id ? freshEvent : event)
        : [...current, freshEvent] }
    })
    setEditingId(null)
    setShowCreateForm(false)
    setFeedback('Événement enregistré.')
  }

  const mutateEvent = async (event: SpityEvent, action: 'register' | 'cancel-registration' | 'cancel-event') => {
    if (pendingId !== null) return
    setPendingId(event.id)
    setFeedback(null)
    const endpoint = action === 'cancel-event'
      ? `/api/events/${event.id}`
      : `/api/events/${event.id}/registrations`
    try {
      const result = await requestJson(endpoint, eventResponseSchema, {
        method: action === 'register' ? 'POST' : action === 'cancel-registration' ? 'DELETE' : 'PATCH',
        headers: action === 'cancel-event' ? { 'Content-Type': 'application/json' } : undefined,
        body: action === 'cancel-event' ? JSON.stringify({ status: 'cancelled' }) : undefined,
      })
      update((current) => ({ events: current.events.map((item) => item.id === event.id ? result.event : item) }))
      setFeedback(action === 'register'
        ? 'Inscription confirmée.'
        : action === 'cancel-registration' ? 'Inscription annulée.' : 'Événement annulé.')
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'L’opération n’a pas pu être réalisée.')
      if (error instanceof ApiRequestError && error.status === 409) await refresh()
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <AppHero
        backgroundImage={demoClimbingAssets.indoorGym}
        description={role === 'club'
          ? 'Publiez vos rendez-vous, ajustez la capacité et consultez les participants.'
          : 'Découvrez les sorties et initiations puis gérez votre inscription.'}
        eyebrow="Agenda communautaire"
        stats={[
          { label: 'événements visibles', value: events.filter((event) => event.status === 'scheduled').length },
          { label: role === 'club' ? 'événements du club' : 'inscriptions', value: events.filter((event) => role === 'club' ? event.isOwner : event.isRegistered).length },
        ]}
        title="Événements Spity"
      >
        <Button onClick={() => void refresh()} isLoading={isRefreshing} disabled={pendingId !== null || showCreateForm || editingId !== null} variant="secondary">
          <RefreshCw size={18} aria-hidden="true" />
          Actualiser les événements
        </Button>
        {role === 'club' && (
          <Button onClick={() => { setEditingId(null); setShowCreateForm((current) => !current) }} variant="primary">
            <CalendarPlus size={18} aria-hidden="true" />
            Nouvel événement
          </Button>
        )}
      </AppHero>

      {role === 'club' && showCreateForm && (
        <EventForm onCancel={() => setShowCreateForm(false)} onSaved={mergeEvent} />
      )}
      {role === 'club' && editingEvent && (
        <EventForm event={editingEvent} onCancel={() => setEditingId(null)} onSaved={mergeEvent} />
      )}

      <p className="min-h-6 text-sm font-semibold text-foreground" aria-live="polite">{feedback}</p>
      {refreshError && <p role="alert" className="text-sm text-destructive">{refreshError}</p>}

      {orderedEvents.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Aucun événement disponible"
          description={role === 'club' ? 'Publiez le premier événement du club.' : 'Revenez prochainement pour découvrir de nouvelles sorties.'}
        />
      ) : (
        <section className="grid items-stretch gap-5 xl:grid-cols-2" aria-label="Liste des événements">
          {orderedEvents.map((event) => (
            <Card key={event.id} hover={false} className={`overflow-hidden ${event.status === 'cancelled' ? 'opacity-75' : ''}`}>
              <div className="flex h-full flex-col p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary">{typeLabels[event.type]}</Badge>
                      {event.status === 'scheduled' && event.remainingCapacity === 0 && <Badge variant="warning">Complet</Badge>}
                      {event.status === 'cancelled' && <Badge variant="destructive">Annulé</Badge>}
                      {event.isRegistered && <Badge variant="success">Inscrit</Badge>}
                    </div>
                    <h2 className="mt-4 text-balance text-xl font-black leading-tight text-foreground sm:text-2xl">{event.title}</h2>
                    <p className="mt-1.5 text-sm font-semibold text-muted-foreground">{event.clubName}</p>
                  </div>
                  <div className="min-w-28 rounded-lg bg-secondary/65 px-3 py-2.5 text-right">
                    <p className="text-2xl font-black leading-none tabular-nums text-foreground">{event.remainingCapacity}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      {event.remainingCapacity === 1 ? 'place disponible' : 'places disponibles'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 rounded-lg bg-secondary/55 p-4 text-sm sm:grid-cols-2">
                  <p className="flex items-start gap-2.5 text-muted-foreground">
                    <CalendarDays className="mt-0.5 shrink-0 text-accent-foreground" size={16} aria-hidden="true" />
                    <span>{formatEventDate(event.startsAt)}</span>
                  </p>
                  <p className="flex items-start gap-2.5 text-muted-foreground">
                    <MapPin className="mt-0.5 shrink-0 text-accent-foreground" size={16} aria-hidden="true" />
                    <span>{event.location ?? 'Lieu à confirmer'}</span>
                  </p>
                  <p className="flex items-start gap-2.5 text-muted-foreground sm:col-span-2">
                    <UsersRound className="mt-0.5 shrink-0 text-accent-foreground" size={16} aria-hidden="true" />
                    <span><strong className="font-semibold text-foreground tabular-nums">{event.registeredCount} / {event.capacity}</strong> participant(s)</span>
                  </p>
                </div>
                {event.description && <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground">{event.description}</p>}

                {event.isOwner && (
                  <div className="mt-5 rounded-lg border border-border bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-foreground">Participants</p>
                      <span className="text-xs font-semibold tabular-nums text-muted-foreground">{event.participants.length} inscrit{event.participants.length > 1 ? 's' : ''}</span>
                    </div>
                    {event.participants.length === 0 && <p className="mt-3 text-sm text-muted-foreground">Aucun participant pour le moment.</p>}
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {event.participants.map((participant) => (
                        <li key={participant.userId} className="rounded-md bg-secondary/60 px-3 py-2 text-sm font-medium text-foreground">
                          {participant.displayName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-5">
                  {role === 'grimpeur' && event.status === 'scheduled' && (
                    <Button
                      disabled={pendingId !== null || (!event.isRegistered && event.remainingCapacity === 0)}
                      isLoading={pendingId === event.id}
                      onClick={() => void mutateEvent(event, event.isRegistered ? 'cancel-registration' : 'register')}
                      size="sm"
                      variant={event.isRegistered ? 'ghost' : 'primary'}
                    >
                      {event.isRegistered ? <X size={17} aria-hidden="true" /> : <TicketCheck size={17} aria-hidden="true" />}
                      {event.isRegistered ? 'Annuler mon inscription' : 'S’inscrire'}
                    </Button>
                  )}
                  {event.isOwner && event.status === 'scheduled' && (
                    <>
                      <Button disabled={pendingId !== null} onClick={() => { setShowCreateForm(false); setEditingId(event.id) }} size="sm" variant="secondary">
                        <Pencil size={17} aria-hidden="true" />
                        Modifier
                      </Button>
                      <Button
                        disabled={pendingId !== null}
                        isLoading={pendingId === event.id}
                        onClick={() => void mutateEvent(event, 'cancel-event')}
                        size="sm"
                        variant="destructive"
                      >
                        <X size={17} aria-hidden="true" />
                        Annuler l’événement
                      </Button>
                    </>
                  )}
                  {event.isOwner && event.status === 'cancelled' && (
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"><Check size={16} aria-hidden="true" />Annulation enregistrée</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </section>
      )}
    </div>
  )
}
