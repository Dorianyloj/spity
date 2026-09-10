'use client'

import { useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Textarea } from '@/components/ui'
import { placeReviewSchema } from '@/features/places/schemas'

type Props = {
  decision: 'approve' | 'reject'
  id: string
  name: string
}

export default function PlaceReviewButton({ decision, id, name }: Props) {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState('')
  const approve = decision === 'approve'
  const action = approve ? 'Valider' : 'Refuser'

  const close = () => {
    dialog.current?.close()
    trigger.current?.focus()
  }

  const confirm = async (event: React.FormEvent) => {
    event.preventDefault()
    const input = placeReviewSchema.safeParse({ decision, reason })
    if (!input.success) {
      setError(input.error.issues[0]?.message ?? 'Vérifiez le motif.')
      return
    }

    setPending(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/place-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input.data),
      })
      const body = await response.json() as { error?: string }
      if (!response.ok) throw new Error(body.error ?? 'Action impossible. Réessayez.')
      close()
      setNotice(approve ? 'Lieu ajouté au répertoire.' : 'Demande refusée.')
      router.refresh()
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Connexion impossible. Réessayez.')
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Button
        ref={trigger}
        variant={approve ? 'primary' : 'destructive'}
        onClick={() => {
          setReason('')
          setError('')
          setNotice('')
          dialog.current?.showModal()
        }}
      >
        {action}
      </Button>
      <span className="sr-only" role="status">{notice}</span>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl backdrop:bg-black/60"
        onCancel={(event) => {
          event.preventDefault()
          if (!pending) close()
        }}
      >
        <form className="space-y-4" onSubmit={confirm}>
          <h2 className="text-xl font-bold text-balance" id={titleId}>{action} ce lieu ?</h2>
          <p className="text-sm text-pretty text-muted-foreground" id={descriptionId}>
            {approve ? `${name} sera ajouté au répertoire.` : `${name} ne sera pas publié.`}
          </p>
          <Textarea
            disabled={pending}
            error={error || undefined}
            label={approve ? 'Note interne (facultatif)' : 'Motif du refus'}
            maxLength={500}
            onChange={(event) => setReason(event.target.value)}
            required={!approve}
            value={reason}
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button autoFocus disabled={pending} variant="ghost" onClick={close}>Annuler</Button>
            <Button isLoading={pending} loadingText="Enregistrement…" type="submit" variant={approve ? 'primary' : 'destructive'}>
              Confirmer
            </Button>
          </div>
        </form>
      </dialog>
    </>
  )
}
