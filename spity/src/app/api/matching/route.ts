import { getCurrentUser } from '@/features/auth/lib/current-user'
import { findMatchingClimbers, findPartnershipStatuses } from '@/features/matching/lib/matching-repository'
import { matchingErrorResponse } from '@/features/matching/lib/responses'
import { matchingResponseSchema } from '@/features/matching/schemas'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return matchingErrorResponse('Authentification requise', 401)
  }

  if (user.role !== 'grimpeur') {
    return matchingErrorResponse('Le matching est réservé aux grimpeurs', 403)
  }

  const climbers = await findMatchingClimbers(user.id)
  const statuses = await findPartnershipStatuses(user.id, climbers.map((climber) => climber.userId))

  return NextResponse.json(matchingResponseSchema.parse({ climbers, statuses: Object.fromEntries(statuses) }), {
    headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' },
  })
}
