import { z } from 'zod'

export const feedPostSchema = z.object({
  id: z.string().uuid(),
  author: z.object({
    name: z.string(),
    avatarUrl: z.string().url().nullable(),
  }),
  context: z.string(),
  content: z.string(),
  tag: z.string(),
  meta: z.string(),
  imageUrl: z.string().url().nullable(),
  likeCount: z.number().int().nonnegative(),
  commentCount: z.number().int().nonnegative(),
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

export type FeedPost = z.infer<typeof feedPostSchema>
export type PostLike = z.infer<typeof postLikeSchema>
