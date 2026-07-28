'use client'

import Image from 'next/image'
import {
  Bookmark,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send,
} from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { Avatar, Badge, Card, EmptyState } from '@/components/ui'
import type { FeedPost } from '../schemas'
import { postLikeResponseSchema } from '../schemas'
import PostComments from './post-comments'

type FeedTimelineProps = {
  initialPosts: FeedPost[]
}

const parseError = async (response: Response) => {
  const payload: unknown = await response.json().catch(() => null)
  const parsedPayload = z.object({ error: z.string() }).safeParse(payload)

  return parsedPayload.success ? parsedPayload.data.error : 'Le like n’a pas pu être enregistré'
}

export default function FeedTimeline({ initialPosts }: FeedTimelineProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [openCommentComposerId, setOpenCommentComposerId] = useState<string | null>(null)

  const toggleLike = async (post: FeedPost) => {
    setPendingId(post.id)
    setErrors((current) => ({ ...current, [post.id]: undefined }))

    try {
      const response = await fetch(`/api/posts/${post.id}/likes`, {
        method: post.likedByViewer ? 'DELETE' : 'POST',
      })

      if (!response.ok) {
        const errorMessage = await parseError(response)
        setErrors((current) => ({ ...current, [post.id]: errorMessage }))
        return
      }

      const payload: unknown = await response.json()
      const parsedPayload = postLikeResponseSchema.safeParse(payload)

      if (!parsedPayload.success) {
        setErrors((current) => ({ ...current, [post.id]: 'Réponse du serveur invalide' }))
        return
      }

      setPosts((current) => current.map((item) => item.id === post.id
        ? {
            ...item,
            likedByViewer: parsedPayload.data.like.liked,
            likeCount: parsedPayload.data.like.likeCount,
          }
        : item
      ))
    } catch {
      setErrors((current) => ({ ...current, [post.id]: 'Le like n’a pas pu être enregistré' }))
    } finally {
      setPendingId(null)
    }
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Le feed est encore calme"
        description="Les premières publications de la communauté apparaîtront ici."
      />
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const isPending = pendingId === post.id
        const isCommentComposerOpen = openCommentComposerId === post.id
        const likeLabel = post.likedByViewer
          ? `Retirer le like de la publication de ${post.author.name}`
          : `Aimer la publication de ${post.author.name}`

        return (
          <article key={post.id} aria-labelledby={`${post.id}-author`}>
            <Card hover={false} className="overflow-hidden rounded-xl border-border/80 bg-card">
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar
                  alt={`Avatar de ${post.author.name}`}
                  className="bg-secondary text-secondary-foreground"
                  fallback={post.author.name}
                  size="md"
                  src={post.author.avatarUrl ?? undefined}
                />
                <div className="min-w-0 flex-1">
                  <p id={`${post.id}-author`} className="truncate text-sm font-semibold text-foreground">
                    {post.author.name}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" aria-hidden="true" />
                    {post.context}
                  </p>
                </div>
                <button
                  aria-label={`Plus d’options pour la publication de ${post.author.name}`}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  type="button"
                >
                  <MoreHorizontal className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="px-4 pb-4">
                <p className="text-pretty text-sm text-foreground sm:text-base">{post.content}</p>
                <Badge className="mt-3" variant="secondary">{post.tag}</Badge>
              </div>

              {post.imageUrl && (
                <div className="relative aspect-square bg-muted">
                  <Image
                    alt={`Publication de ${post.author.name}`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
                    src={post.imageUrl}
                  />
                </div>
              )}

              <div className="flex items-center justify-between px-3 pt-3">
                <div className="flex items-center">
                  <button
                    aria-label={likeLabel}
                    aria-pressed={post.likedByViewer}
                    className={`rounded-full p-2 transition-colors hover:bg-muted ${post.likedByViewer ? 'text-destructive' : 'text-foreground'}`}
                    disabled={isPending}
                    onClick={() => void toggleLike(post)}
                    type="button"
                  >
                    <Heart className="size-5" fill={post.likedByViewer ? 'currentColor' : 'none'} aria-hidden="true" />
                  </button>
                  <button
                    aria-label={`Commenter la publication de ${post.author.name}`}
                    aria-controls={`comment-composer-${post.id}`}
                    aria-expanded={isCommentComposerOpen}
                    className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
                    onClick={() => setOpenCommentComposerId(isCommentComposerOpen ? null : post.id)}
                    type="button"
                  >
                    <MessageCircle className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    aria-label={`Partager la publication de ${post.author.name}`}
                    className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
                    type="button"
                  >
                    <Send className="size-5" aria-hidden="true" />
                  </button>
                </div>
                <button
                  aria-label={`Enregistrer la publication de ${post.author.name}`}
                  className="rounded-full p-2 text-foreground transition-colors hover:bg-muted"
                  type="button"
                >
                  <Bookmark className="size-5" aria-hidden="true" />
                </button>
              </div>

              <div className="px-4 pb-4 pt-1">
                <p className="text-sm font-semibold text-foreground tabular-nums">{post.likeCount} J’aime</p>
                <p className="mt-2 text-xs text-muted-foreground">{post.meta}</p>
                {errors[post.id] && <p className="mt-2 text-sm text-destructive" role="alert">{errors[post.id]}</p>}
              </div>

              <PostComments
                composerOpen={isCommentComposerOpen}
                initialComments={post.comments}
                onComposerClose={() => setOpenCommentComposerId(null)}
                postId={post.id}
              />
            </Card>
          </article>
        )
      })}
    </div>
  )
}
