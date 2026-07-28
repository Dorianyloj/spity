import { z } from 'zod'
import { imageSourceSchema } from '@/lib/image-source'

export const feedCommentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  content: z.string().min(1).max(500),
  author: z.object({
    name: z.string(),
    avatarUrl: imageSourceSchema.nullable(),
  }),
  meta: z.string(),
  isAuthor: z.boolean(),
  isEdited: z.boolean(),
})

export const feedPostSchema = z.object({
  id: z.string().uuid(),
  author: z.object({
    name: z.string(),
    avatarUrl: imageSourceSchema.nullable(),
  }),
  context: z.string(),
  content: z.string(),
  tag: z.string(),
  meta: z.string(),
  imageUrl: imageSourceSchema.nullable(),
  likeCount: z.number().int().nonnegative(),
  commentCount: z.number().int().nonnegative(),
  comments: z.array(feedCommentSchema),
  likedByViewer: z.boolean(),
})

export const postLikeSchema = z.object({
  postId: z.string().uuid(),
  liked: z.boolean(),
  likeCount: z.number().int().nonnegative(),
})

export const postLikeResponseSchema = z.object({
  like: postLikeSchema,
})

export const postLikeErrorResponseSchema = z.object({
  error: z.string(),
})

export const createCommentBodySchema = z.object({
  content: z.string().trim().min(1, 'Le commentaire ne peut pas être vide').max(500),
})

export const postCommentResponseSchema = z.object({
  comment: feedCommentSchema,
})

export const postCommentDeleteResponseSchema = z.object({
  deletedCommentId: z.string().uuid(),
})

export const postCommentErrorResponseSchema = z.object({
  error: z.string(),
})

export type FeedPost = z.infer<typeof feedPostSchema>
export type FeedComment = z.infer<typeof feedCommentSchema>
export type PostLike = z.infer<typeof postLikeSchema>
