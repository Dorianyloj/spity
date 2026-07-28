'use client'

import { type FormEvent, useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import { Avatar, Button, Textarea } from '@/components/ui'
import type { FeedComment } from '../schemas'
import {
  postCommentDeleteResponseSchema,
  postCommentResponseSchema,
} from '../schemas'
import CommentDeleteDialog from './comment-delete-dialog'

type PostCommentsProps = {
  composerOpen: boolean
  initialComments: FeedComment[]
  onComposerClose: () => void
  postId: string
}

const parseError = async (response: Response) => {
  const payload: unknown = await response.json().catch(() => null)
  const parsedPayload = z.object({ error: z.string() }).safeParse(payload)

  return parsedPayload.success ? parsedPayload.data.error : 'Le commentaire n’a pas pu être enregistré'
}

export default function PostComments({
  composerOpen,
  initialComments,
  onComposerClose,
  postId,
}: PostCommentsProps) {
  const [comments, setComments] = useState(initialComments)
  const [draft, setDraft] = useState('')
  const [draftError, setDraftError] = useState<string | undefined>()
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editingDraft, setEditingDraft] = useState('')
  const [editingError, setEditingError] = useState<string | undefined>()
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [commentToDelete, setCommentToDelete] = useState<FeedComment | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null)
  const commentFieldId = `comment-${postId}`

  useEffect(() => {
    if (composerOpen) {
      commentTextareaRef.current?.focus()
    }
  }, [composerOpen])

  const createComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDraftError(undefined)

    const content = draft.trim()
    if (!content) {
      setDraftError('Écrivez un commentaire avant de publier.')
      return
    }

    setPendingAction('create')

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        setDraftError(await parseError(response))
        return
      }

      const payload: unknown = await response.json()
      const parsedPayload = postCommentResponseSchema.safeParse(payload)

      if (!parsedPayload.success) {
        setDraftError('Réponse du serveur invalide')
        return
      }

      setComments((current) => [...current, parsedPayload.data.comment])
      setDraft('')
      onComposerClose()
    } catch {
      setDraftError('Le commentaire n’a pas pu être enregistré')
    } finally {
      setPendingAction(null)
    }
  }

  const saveComment = async (event: FormEvent<HTMLFormElement>, commentId: string) => {
    event.preventDefault()
    setEditingError(undefined)

    const content = editingDraft.trim()
    if (!content) {
      setEditingError('Le commentaire ne peut pas être vide.')
      return
    }

    setPendingAction(`edit-${commentId}`)

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        setEditingError(await parseError(response))
        return
      }

      const payload: unknown = await response.json()
      const parsedPayload = postCommentResponseSchema.safeParse(payload)

      if (!parsedPayload.success) {
        setEditingError('Réponse du serveur invalide')
        return
      }

      setComments((current) => current.map((comment) => comment.id === commentId
        ? parsedPayload.data.comment
        : comment
      ))
      setEditingCommentId(null)
      setEditingDraft('')
    } catch {
      setEditingError('Le commentaire n’a pas pu être modifié')
    } finally {
      setPendingAction(null)
    }
  }

  const deleteComment = async () => {
    if (!commentToDelete) {
      return
    }

    setDeleteError(null)
    setPendingAction(`delete-${commentToDelete.id}`)

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        setDeleteError(await parseError(response))
        return
      }

      const payload: unknown = await response.json()
      const parsedPayload = postCommentDeleteResponseSchema.safeParse(payload)

      if (!parsedPayload.success) {
        setDeleteError('Réponse du serveur invalide')
        return
      }

      setComments((current) => current.filter((comment) => comment.id !== parsedPayload.data.deletedCommentId))
      setCommentToDelete(null)
    } catch {
      setDeleteError('Le commentaire n’a pas pu être supprimé')
    } finally {
      setPendingAction(null)
    }
  }

  const closeComposer = () => {
    setDraft('')
    setDraftError(undefined)
    onComposerClose()
  }

  return (
    <section className="border-t border-border px-4 py-4" aria-labelledby={`${postId}-comments-heading`}>
      <h2 id={`${postId}-comments-heading`} className="text-sm font-semibold text-foreground tabular-nums">
        {comments.length} commentaires
      </h2>

      <ul className="mt-3 space-y-4" aria-label="Commentaires de la publication">
        {comments.map((comment) => {
          const isEditing = editingCommentId === comment.id

          return (
            <li key={comment.id} className="flex gap-3">
              <Avatar
                alt={`Avatar de ${comment.author.name}`}
                className="bg-secondary text-secondary-foreground"
                fallback={comment.author.name}
                size="sm"
                src={comment.author.avatarUrl ?? undefined}
              />
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <form onSubmit={(event) => void saveComment(event, comment.id)}>
                    <Textarea
                      error={editingError}
                      id={`edit-comment-${comment.id}`}
                      label={`Modifier le commentaire de ${comment.author.name}`}
                      maxLength={500}
                      onChange={(event) => setEditingDraft(event.target.value)}
                      required
                      value={editingDraft}
                    />
                    <div className="mt-2 flex gap-2">
                      <Button isLoading={pendingAction === `edit-${comment.id}`} size="sm" type="submit">
                        Enregistrer
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingCommentId(null)
                          setEditingDraft('')
                          setEditingError(undefined)
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="rounded-lg bg-muted px-3 py-2">
                      <p className="text-sm font-semibold text-foreground">{comment.author.name}</p>
                      <p className="mt-1 text-pretty text-sm text-foreground">{comment.content}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{comment.meta}{comment.isEdited ? ' · Modifié' : ''}</span>
                      {comment.isAuthor && (
                        <>
                          <button
                            className="font-medium text-foreground underline-offset-4 hover:underline"
                            onClick={() => {
                              setEditingCommentId(comment.id)
                              setEditingDraft(comment.content)
                              setEditingError(undefined)
                            }}
                            type="button"
                          >
                            Modifier
                          </button>
                          <button
                            className="font-medium text-destructive underline-offset-4 hover:underline"
                            onClick={() => setCommentToDelete(comment)}
                            type="button"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {deleteError && <p className="mt-3 text-sm text-destructive" role="alert">{deleteError}</p>}

      {composerOpen ? (
        <form
          className="mt-4 border-t border-border pt-4"
          id={`comment-composer-${postId}`}
          onSubmit={(event) => void createComment(event)}
        >
        <Textarea
          error={draftError}
          id={commentFieldId}
          label="Ajouter un commentaire"
          maxLength={500}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Partagez votre avis…"
          ref={commentTextareaRef}
          required
          value={draft}
        />
        <div className="mt-3 flex justify-end gap-2">
          <Button
            disabled={pendingAction === 'create'}
            onClick={closeComposer}
            type="button"
            variant="ghost"
          >
            Annuler
          </Button>
          <Button isLoading={pendingAction === 'create'} loadingText="Publication…" type="submit">
            Publier le commentaire
          </Button>
        </div>
        </form>
      ) : null}

      <CommentDeleteDialog
        authorName={commentToDelete?.author.name ?? ''}
        isDeleting={pendingAction === `delete-${commentToDelete?.id}`}
        onClose={() => setCommentToDelete(null)}
        onConfirm={() => void deleteComment()}
        open={commentToDelete !== null}
      />
    </section>
  )
}
