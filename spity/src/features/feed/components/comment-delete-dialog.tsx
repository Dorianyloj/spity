'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui'

type CommentDeleteDialogProps = {
  authorName: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
  open: boolean
}

export default function CommentDeleteDialog({
  authorName,
  isDeleting,
  onClose,
  onConfirm,
  open,
}: CommentDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      dialog.showModal()
    }

    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const closeDialog = () => {
    dialogRef.current?.close()
    onClose()
    returnFocusRef.current?.focus()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-describedby="delete-comment-description"
      aria-labelledby="delete-comment-title"
      className="w-full max-w-md rounded-xl border border-border bg-card p-0 text-card-foreground shadow-xl backdrop:bg-black/60"
      onCancel={(event) => {
        event.preventDefault()
        if (!isDeleting) {
          closeDialog()
        }
      }}
      onClose={() => {
        if (open) {
          onClose()
        }
      }}
      role="alertdialog"
    >
      <div className="space-y-3 p-6">
        <h2 id="delete-comment-title" className="text-lg font-bold text-foreground">Supprimer ce commentaire ?</h2>
        <p id="delete-comment-description" className="text-pretty text-sm text-muted-foreground">
          Le commentaire de {authorName} sera supprimé définitivement.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button autoFocus disabled={isDeleting} onClick={closeDialog} variant="ghost">
            Annuler
          </Button>
          <Button isLoading={isDeleting} loadingText="Suppression…" onClick={onConfirm} variant="destructive">
            Supprimer le commentaire
          </Button>
        </div>
      </div>
    </dialog>
  )
}
