import { NextResponse } from 'next/server'
import {
  authErrorResponseSchema,
  authMessageResponseSchema,
  authStatusResponseSchema,
  authSuccessResponseSchema,
  type AuthUser,
} from '../schemas'

export const authUserResponse = (user: AuthUser, status = 200) => {
  return NextResponse.json(authSuccessResponseSchema.parse({ user }), { status })
}

export const authStatusResponse = (authenticated: boolean, user: AuthUser | null, status = 200) => {
  return NextResponse.json(authStatusResponseSchema.parse({ authenticated, user }), { status })
}

export const authMessageResponse = (message: string, status = 200) => {
  return NextResponse.json(authMessageResponseSchema.parse({ message }), { status })
}

export const authErrorResponse = (error: string, status = 400, issues?: string[]) => {
  return NextResponse.json(authErrorResponseSchema.parse({ error, issues }), { status })
}
