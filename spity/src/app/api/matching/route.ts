import { getCurrentUser } from '@/features/auth/lib/current-user'
import { findMatchingClimbers } from '@/features/matching/lib/matching-repository'
import { matchingErrorResponse } from '@/features/matching/lib/responses'
import { publicClimberSchema } from '@/features/matching/schemas'
import { z } from 'zod'
import { NextResponse } from 'next/server'

const matchingResponseSchema = z.object({ climbers: z.array(publicClimberSchema) })

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return matchingErrorResponse('Authentification requise', 401)
  }

  if (user.role !== 'grimpeur') {
    return matchingErrorResponse('Le matching est réservé aux grimpeurs', 403)
  }

  const climbers = await findMatchingClimbers(user.id)

  return NextResponse.json(matchingResponseSchema.parse({ climbers }))
}
