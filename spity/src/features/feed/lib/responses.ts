import { NextResponse } from 'next/server'
import {
  postCommentDeleteResponseSchema,
  postCommentErrorResponseSchema,
  postCommentResponseSchema,
  postLikeErrorResponseSchema,
  postLikeResponseSchema,
  type FeedComment,
  type PostLike,
} from '../schemas'

export const postLikeResponse = (like: PostLike) => {
  return NextResponse.json(postLikeResponseSchema.parse({ like }))
}

export const postLikeErrorResponse = (error: string, status = 400) => {
  return NextResponse.json(postLikeErrorResponseSchema.parse({ error }), { status })
}

export const postCommentResponse = (comment: FeedComment, status = 200) => {
  return NextResponse.json(postCommentResponseSchema.parse({ comment }), { status })
}

export const postCommentDeleteResponse = (deletedCommentId: string) => {
  return NextResponse.json(postCommentDeleteResponseSchema.parse({ deletedCommentId }))
}

export const postCommentErrorResponse = (error: string, status = 400) => {
  return NextResponse.json(postCommentErrorResponseSchema.parse({ error }), { status })
}
