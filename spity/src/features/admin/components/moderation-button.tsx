'use client'

import { useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Textarea } from '@/components/ui'
import { moderationSchema, type ModerationTarget } from '../schemas'

type Props = ModerationTarget & { restricted: boolean; label: string }

export default function ModerationButton({ kind, id, restricted, label }: Props) {
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState('')
  const action = kind === 'users' ? restricted ? 'Réactiver' : 'Suspendre' : restricted ? 'Restaurer' : 'Masquer'

  function close() {
    dialog.current?.close()
    trigger.current?.focus()
  }

  async function confirm(event: React.FormEvent) {
    event.preventDefault()
    const input = moderationSchema.safeParse({ state: !restricted, reason })
    if (!input.success) { setError('Précisez le motif (8 à 500 caractères).'); return }
    setPending(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/${kind}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input.data) })
      const body = await response.json() as { error?: string }
      if (!response.ok) throw new Error(body.error ?? 'Action impossible. Réessayez.')
      close()
      setNotice('Action enregistrée dans l’historique.')
      router.refresh()
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Connexion impossible. Réessayez.')
    } finally { setPending(false) }
  }

  return <>
    <Button ref={trigger} variant="secondary" aria-label={`${action} : ${label}`} onClick={() => { setReason(''); setError(''); setNotice(''); dialog.current?.showModal() }}>{action}</Button>
    <span className="sr-only" role="status">{notice}</span>
    <dialog ref={dialog} aria-labelledby={titleId} aria-describedby={descriptionId} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl backdrop:bg-black/60" onCancel={(event) => { event.preventDefault(); if (!pending) close() }}>
      <form onSubmit={confirm} className="space-y-4">
        <h2 id={titleId} className="text-balance text-xl font-bold">{action} {kind === 'users' ? 'ce compte' : 'cette publication'} ?</h2>
        <p id={descriptionId} className="break-words text-pretty text-sm text-muted-foreground">{label}. {kind === 'users' ? 'La suspension bloque la connexion et révoque les sessions. Les données sont conservées.' : 'Une publication masquée disparaît du fil et du profil public. Elle peut être restaurée.'} Cette action sera journalisée.</p>
        <Textarea label="Motif de modération" value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} error={error || undefined} disabled={pending} required />
        <p className="text-xs text-muted-foreground">8 à 500 caractères. N’inscrivez pas de données sensibles dans le motif.</p>
        <div className="flex flex-wrap justify-end gap-2">
          <Button autoFocus variant="ghost" disabled={pending} onClick={close}>Annuler</Button>
          <Button type="submit" variant={restricted ? 'primary' : 'destructive'} isLoading={pending} loadingText="Enregistrement…">Confirmer</Button>
        </div>
      </form>
    </dialog>
  </>
}
