'use client'

import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { Button } from '@/components/ui'

export default function ProfileDialog({ title, description, children, onClose, busy = false, destructive = false }: {
  title: string; description: string; children: ReactNode; onClose: () => void; busy?: boolean; destructive?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const id = useId()
  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = ref.current!
    dialog.showModal()
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      const target = trigger?.isConnected ? trigger : document.getElementById('profile-section-active')
      target?.focus({ preventScroll: true })
    }
  }, [])
  return <dialog ref={ref} role={destructive ? 'alertdialog' : undefined} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}
    className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl rounded-xl border border-border bg-card p-0 text-foreground shadow-xl backdrop:bg-black/60"
    onCancel={(event) => { event.preventDefault(); if (!busy) onClose() }}>
    <div className="flex items-start justify-between gap-4 p-5 pb-0 sm:p-6 sm:pb-0"><div><h2 id={`${id}-title`} className="text-balance text-xl font-bold">{title}</h2><p id={`${id}-description`} className="mt-2 text-pretty text-sm text-muted-foreground">{description}</p></div>
      <Button ref={closeRef} variant="ghost" disabled={busy} onClick={onClose} aria-label={destructive ? 'Annuler le retrait' : 'Fermer la fenêtre'} className="shrink-0 px-3"><X size={18} aria-hidden="true" /></Button>
    </div>{children}
  </dialog>
}
