'use client'

import { ArrowUpRight, CalendarDays, Check, Clock3, Handshake, Inbox, MapPin, Search, Send, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import { AppHero, Avatar, Badge, Button, Card, EmptyState } from '@/components/ui'
import { disciplineLabels } from '@/features/profile/lib/presentation'
import { demoClimbingAssets } from '@/lib/brand-assets'
import { cn } from '@/lib/class-names'
import { partnershipResponseSchema, type PartnershipRequest } from '../schemas'

type PartnershipCenterProps = { initialRequests: PartnershipRequest[] }

const statusLabels = {
  pending: 'En attente',
  accepted: 'Acceptée',
  declined: 'Refusée',
} as const

const statusVariants = {
  pending: 'warning',
  accepted: 'success',
  declined: 'default',
} as const

const statusDescriptions = {
  pending: 'En attente de réponse',
  accepted: 'Vous pouvez maintenant organiser une sortie ensemble',
  declined: 'La demande n’a pas été retenue',
} as const

const parseError = async (response: Response) => {
  const payload: unknown = await response.json().catch(() => null)
  const result = z.object({ error: z.string() }).safeParse(payload)

  return result.success ? result.data.error : 'La demande n’a pas pu être mise à jour'
}

export default function PartnershipCenter({ initialRequests }: PartnershipCenterProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ requestId: string; message: string; error: boolean } | null>(null)

  const respond = async (requestId: string, status: 'accepted' | 'declined') => {
    setPendingId(requestId)
    setFeedback(null)
    const response = await fetch(`/api/partnerships/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      setFeedback({ requestId, message: await parseError(response), error: true })
      setPendingId(null)
      return
    }

    const payload: unknown = await response.json()
    const parsedPayload = partnershipResponseSchema.safeParse(payload)

    if (parsedPayload.success) {
      setRequests((current) => current.map((item) => item.id === requestId ? parsedPayload.data.request : item))
      setFeedback({ requestId, message: status === 'accepted' ? 'Demande acceptée.' : 'Demande refusée.', error: false })
    }

    setPendingId(null)
  }

  return (
    <div className="space-y-6">
      <AppHero
        backgroundImage={demoClimbingAssets.verdonClimbers}
        description="Consultez les demandes envoyées et répondez aux demandes reçues."
        eyebrow="Suivi du matching"
        stats={[
          { label: 'demandes', value: requests.length },
          { label: 'partenaires', value: requests.filter((request) => request.status === 'accepted').length },
        ]}
        title="Mes demandes"
      >
        <Link className="spity-btn spity-btn--secondary" href="/app/matching">
          <Search size={18} aria-hidden="true" />
          Rechercher un profil
        </Link>
      </AppHero>

      {requests.length === 0 ? (
        <div className="space-y-3">
          <EmptyState
            icon={Handshake}
            title="Aucune demande pour le moment"
            description="Parcourez les profils disponibles et proposez une prochaine session de grimpe."
          />
          <Link className="spity-btn spity-btn--secondary" href="/app/matching">Trouver un partenaire</Link>
        </div>
      ) : (
        <section aria-labelledby="partnership-requests-heading">
          <div className="mb-4">
            <h2 id="partnership-requests-heading" className="text-balance text-xl font-bold text-white sm:text-2xl">Toutes mes demandes</h2>
            <p className="text-sm text-white/75">Suivez les demandes envoyées et répondez à celles que vous recevez.</p>
          </div>
          <div className="grid items-stretch gap-4 lg:grid-cols-2">
            {requests.map((request) => {
              const canRespond = request.direction === 'received' && request.status === 'pending'
              const isPending = pendingId === request.id
              const primaryGrade = Object.values(request.otherParticipant.niveaux)[0]

              return (
                <Card key={request.id} hover={false} className="overflow-hidden">
                  <div className="flex h-full flex-col p-5 sm:p-6">
                    <div className="flex min-w-0 items-start gap-4">
                      <Avatar
                        alt=""
                        className="shrink-0 border border-border bg-secondary"
                        fallback={request.otherParticipant.displayName}
                        size="xl"
                        src={request.otherParticipant.avatarUrl ?? undefined}
                        unoptimized={request.otherParticipant.avatarUrl?.startsWith('http') ?? false}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-balance text-lg font-bold leading-tight text-foreground">
                              <Link className="rounded underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={`/app/profiles/${request.otherParticipant.userId}`}>
                                {request.otherParticipant.displayName}
                              </Link>
                            </h3>
                            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin size={15} aria-hidden="true" />
                              {request.otherParticipant.location ?? 'Localisation non renseignée'}
                            </p>
                          </div>
                          <Badge className="shrink-0" variant={statusVariants[request.status]}>{statusLabels[request.status]}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-lg bg-secondary/55 p-3.5">
                      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        {request.direction === 'received' ? <Inbox size={17} aria-hidden="true" /> : <Send size={17} aria-hidden="true" />}
                        {request.direction === 'received' ? 'Demande reçue' : 'Demande envoyée'}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.status === 'pending' && <Clock3 className="mr-1.5 inline" size={14} aria-hidden="true" />}
                        {statusDescriptions[request.status]}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {request.otherParticipant.disciplines.map((discipline) => (
                        <Badge key={discipline} variant="secondary">{disciplineLabels[discipline] ?? discipline}</Badge>
                      ))}
                      <Badge className="tabular-nums" variant="default">{primaryGrade ? `Niveau ${primaryGrade}` : 'Niveau libre'}</Badge>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays size={15} aria-hidden="true" />
                        Mise à jour le {new Date(request.updatedAt).toLocaleDateString('fr-FR')}
                      </p>
                      <Link className="inline-flex min-h-11 items-center gap-1 rounded px-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" href={`/app/profiles/${request.otherParticipant.userId}`}>
                        Voir le profil <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </div>

                    {canRespond && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button
                          aria-label={`Refuser la demande de ${request.otherParticipant.displayName}`}
                          disabled={isPending}
                          onClick={() => void respond(request.id, 'declined')}
                          size="sm"
                          variant="ghost"
                        >
                          <X size={17} aria-hidden="true" />
                          Refuser
                        </Button>
                        <Button
                          aria-label={`Accepter la demande de ${request.otherParticipant.displayName}`}
                          isLoading={isPending}
                          onClick={() => void respond(request.id, 'accepted')}
                          size="sm"
                        >
                          <Check size={17} aria-hidden="true" />
                          Accepter
                        </Button>
                      </div>
                    )}
                    {feedback?.requestId === request.id && (
                      <p className={cn('mt-3 text-sm font-medium', feedback.error ? 'text-destructive' : 'text-accent-foreground')} role={feedback.error ? 'alert' : 'status'}>
                        {feedback.message}
                      </p>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
