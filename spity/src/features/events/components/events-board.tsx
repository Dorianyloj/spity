'use client'

import { CalendarDays, CalendarPlus, Check, MapPin, Pencil, TicketCheck, UsersRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import { AppHero, Badge, Button, Card, CardContent, EmptyState } from '@/components/ui'
import { demoClimbingAssets } from '@/lib/brand-assets'
import { eventResponseSchema, type SpityEvent } from '../schemas'
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

const parseError = async (response: Response) => {
  const payload: unknown = await response.json().catch(() => null)
  const result = z.object({ error: z.string() }).safeParse(payload)

  return result.success ? result.data.error : 'L’opération n’a pas pu être réalisée'
}

const formatEventDate = (value: string) => new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
  timeStyle: 'short',
}).format(new Date(value))

export default function EventsBoard({ initialEvents, role }: EventsBoardProps) {
  const [events, setEvents] = useState(initialEvents)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const editingEvent = events.find((event) => event.id === editingId)
  const orderedEvents = useMemo(() => [...events].sort((first, second) => (
    new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime()
  )), [events])

  const mergeEvent = (freshEvent: SpityEvent) => {
    setEvents((current) => {
      const exists = current.some((event) => event.id === freshEvent.id)

      return exists
        ? current.map((event) => event.id === freshEvent.id ? freshEvent : event)
        : [...current, freshEvent]
    })
    setEditingId(null)
    setShowCreateForm(false)
    setFeedback('Événement enregistré.')
  }

  const mutateEvent = async (event: SpityEvent, action: 'register' | 'cancel-registration' | 'cancel-event') => {
    setPendingId(event.id)
    setFeedback(null)
    const endpoint = action === 'cancel-event'
      ? `/api/events/${event.id}`
      : `/api/events/${event.id}/registrations`
    const response = await fetch(endpoint, {
      method: action === 'register' ? 'POST' : action === 'cancel-registration' ? 'DELETE' : 'PATCH',
      headers: action === 'cancel-event' ? { 'Content-Type': 'application/json' } : undefined,
      body: action === 'cancel-event' ? JSON.stringify({ status: 'cancelled' }) : undefined,
    })

    if (!response.ok) {
      setFeedback(await parseError(response))
      setPendingId(null)
      return
    }

    const payload: unknown = await response.json()
    const parsedPayload = eventResponseSchema.safeParse(payload)

    if (parsedPayload.success) {
      setEvents((current) => current.map((item) => item.id === event.id ? parsedPayload.data.event : item))
      setFeedback(action === 'register'
        ? 'Inscription confirmée.'
        : action === 'cancel-registration' ? 'Inscription annulée.' : 'Événement annulé.')
    }

    setPendingId(null)
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
        {role === 'club' && (
          <Button onClick={() => { setEditingId(null); setShowCreateForm((current) => !current) }} variant="secondary">
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

      {orderedEvents.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Aucun événement disponible"
          description={role === 'club' ? 'Publiez le premier événement du club.' : 'Revenez prochainement pour découvrir de nouvelles sorties.'}
        />
      ) : (
        <section className="grid gap-4 xl:grid-cols-2" aria-label="Liste des événements">
          {orderedEvents.map((event) => (
            <Card key={event.id} hover={false} className={event.status === 'cancelled' ? 'opacity-75' : ''}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary">{typeLabels[event.type]}</Badge>
                      {event.status === 'cancelled' && <Badge variant="destructive">Annulé</Badge>}
                      {event.isRegistered && <Badge variant="success">Inscrit</Badge>}
                    </div>
                    <h2 className="mt-3 text-xl font-black text-foreground">{event.title}</h2>
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">{event.clubName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-foreground">{event.remainingCapacity}</p>
                    <p className="text-xs text-muted-foreground">place(s) disponible(s)</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2"><CalendarDays className="mt-0.5 shrink-0" size={16} aria-hidden="true" />{formatEventDate(event.startsAt)}</p>
                  <p className="flex items-start gap-2"><MapPin className="mt-0.5 shrink-0" size={16} aria-hidden="true" />{event.location ?? 'Lieu à confirmer'}</p>
                  <p className="flex items-start gap-2"><UsersRound className="mt-0.5 shrink-0" size={16} aria-hidden="true" />{event.registeredCount} / {event.capacity} participant(s)</p>
                </div>
                {event.description && <p className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">{event.description}</p>}

                {event.isOwner && event.participants.length > 0 && (
                  <div className="mt-4 rounded-lg border border-border bg-white/[0.04] p-3">
                    <p className="text-sm font-bold text-foreground">Participants</p>
                    <ul className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                      {event.participants.map((participant) => <li key={participant.userId}>{participant.displayName}</li>)}
                    </ul>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                  {role === 'grimpeur' && event.status === 'scheduled' && (
                    <Button
                      disabled={!event.isRegistered && event.remainingCapacity === 0}
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
                      <Button onClick={() => { setShowCreateForm(false); setEditingId(event.id) }} size="sm" variant="secondary">
                        <Pencil size={17} aria-hidden="true" />
                        Modifier
                      </Button>
                      <Button
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
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  )
}
