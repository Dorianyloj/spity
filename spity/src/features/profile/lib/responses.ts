import { NextResponse } from 'next/server'
import { authErrorResponse } from '@/features/auth/lib/responses'
import { type AuthUser } from '@/features/auth/schemas'
import {
  type ClubProfile,
  type GrimpeurProfile,
  profileErrorResponseSchema,
  profileMeResponseSchema,
} from '../schemas'

export const profileMeResponse = (
  user: AuthUser,
  grimpeurProfile: GrimpeurProfile | null,
  clubProfile: ClubProfile | null,
  status = 200
) => {
  return NextResponse.json(
    profileMeResponseSchema.parse({
      user,
      grimpeurProfile,
      clubProfile,
      onboardingComplete: Boolean(grimpeurProfile || clubProfile),
    }),
    { status }
  )
}

export const profileErrorResponse = (error: string, status = 400, issues?: string[]) => {
  return NextResponse.json(profileErrorResponseSchema.parse({ error, issues }), { status })
}

export const profileUnauthorizedResponse = () => {
  return authErrorResponse('Authentification requise', 401)
}
