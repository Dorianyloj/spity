'use client'

import { Check, Clock3, Handshake, Search, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import { AppHero, Badge, Button, Card, CardContent, EmptyState } from '@/components/ui'
import { demoClimbingAssets } from '@/lib/brand-assets'
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

const parseError = async (response: Response) => {
  const payload: unknown = await response.json().catch(() => null)
  const result = z.object({ error: z.string() }).safeParse(payload)

  return result.success ? result.data.error : 'La demande n’a pas pu être mise à jour'
}

export default function PartnershipCenter({ initialRequests }: PartnershipCenterProps) {
  const [requests, setRequests] = useState(initialRequests)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const respond = async (requestId: string, status: 'accepted' | 'declined') => {
    setPendingId(requestId)
    setFeedback(null)
    const response = await fetch(`/api/partnerships/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      setFeedback(await parseError(response))
      setPendingId(null)
      return
    }

    const payload: unknown = await response.json()
    const parsedPayload = partnershipResponseSchema.safeParse(payload)

    if (parsedPayload.success) {
      setRequests((current) => current.map((item) => item.id === requestId ? parsedPayload.data.request : item))
      setFeedback(status === 'accepted' ? 'Demande acceptée.' : 'Demande refusée.')
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

      <p className="min-h-6 text-sm font-semibold text-foreground" aria-live="polite">{feedback}</p>

      {requests.length === 0 ? (
        <EmptyState
          icon={Handshake}
          title="Aucune demande pour le moment"
          description="L’annuaire de partenaires permet de contacter les grimpeurs disponibles."
        />
      ) : (
        <section className="space-y-3" aria-label="Demandes de partenaire">
          {requests.map((request) => {
            const canRespond = request.direction === 'received' && request.status === 'pending'

            return (
              <Card key={request.id} hover={false}>
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary font-black text-secondary-foreground">
                      {request.otherParticipant.displayName.slice(0, 1).toLocaleUpperCase('fr')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-foreground">{request.otherParticipant.displayName}</h2>
                        <Badge variant={statusVariants[request.status]}>{statusLabels[request.status]}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {request.direction === 'received' ? 'Demande reçue' : 'Demande envoyée'} · {request.otherParticipant.location ?? 'Localisation non renseignée'}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {request.status === 'pending' && <Clock3 className="mr-1 inline" size={13} aria-hidden="true" />}
                        Mise à jour le {new Date(request.updatedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  {canRespond && (
                    <div className="flex shrink-0 gap-2">
                      <Button
                        aria-label={`Refuser la demande de ${request.otherParticipant.displayName}`}
                        disabled={pendingId === request.id}
                        onClick={() => void respond(request.id, 'declined')}
                        size="sm"
                        variant="ghost"
                      >
                        <X size={17} aria-hidden="true" />
                        Refuser
                      </Button>
                      <Button
                        aria-label={`Accepter la demande de ${request.otherParticipant.displayName}`}
                        isLoading={pendingId === request.id}
                        onClick={() => void respond(request.id, 'accepted')}
                        size="sm"
                      >
                        <Check size={17} aria-hidden="true" />
                        Accepter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}
    </div>
  )
}
