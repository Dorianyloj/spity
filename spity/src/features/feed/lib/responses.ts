import { NextResponse } from 'next/server'
import { postLikeErrorResponseSchema, postLikeResponseSchema, type PostLike } from '../schemas'

export const postLikeResponse = (like: PostLike) => {
  return NextResponse.json(postLikeResponseSchema.parse({ like }))
}

export const postLikeErrorResponse = (error: string, status = 400) => {
  return NextResponse.json(postLikeErrorResponseSchema.parse({ error }), { status })
}
