import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  createEvent,
  EventOperationError,
  listEventsForViewer,
  toEventResponse,
} from '@/features/events/lib/event-repository'
import { eventErrorResponse, eventListResponse, eventResponse } from '@/features/events/lib/responses'
import { createEventBodySchema } from '@/features/events/schemas'
import { findClubProfileByUserId } from '@/features/profile/lib/profile-repository'

const readJsonBody = async (request: Request) => {
  try {
    return await request.json() as unknown
  } catch {
    return null
  }
}

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return eventErrorResponse('Authentification requise', 401)
  }

  const clubProfile = user.role === 'club' ? await findClubProfileByUserId(user.id) : null
  const events = await listEventsForViewer(user.id, clubProfile?.id ?? null)

  return eventListResponse(events)
}

export async function POST(request: Request) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const user = await getCurrentUser()

  if (!user) {
    return eventErrorResponse('Authentification requise', 401)
  }

  if (user.role !== 'club') {
    return eventErrorResponse('Seuls les clubs peuvent créer un événement', 403)
  }

  const clubProfile = await findClubProfileByUserId(user.id)

  if (!clubProfile) {
    return eventErrorResponse('Complétez le profil du club avant de publier un événement', 409)
  }

  const body = await readJsonBody(request)
  const parsedBody = createEventBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return eventErrorResponse(
      'Événement invalide',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  try {
    const eventId = await createEvent(clubProfile.id, parsedBody.data)
    const event = await toEventResponse(eventId, user.id, clubProfile.id)

    return eventResponse(event, 201)
  } catch (error) {
    if (error instanceof EventOperationError) {
      return eventErrorResponse(error.message, error.status)
    }

    throw error
  }
}
