import { z } from 'zod'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  EventOperationError,
  toEventResponse,
  updateEvent,
} from '@/features/events/lib/event-repository'
import { eventErrorResponse, eventResponse } from '@/features/events/lib/responses'
import { updateEventBodySchema } from '@/features/events/schemas'
import { findClubProfileByUserId } from '@/features/profile/lib/profile-repository'

type EventRouteContext = { params: Promise<{ eventId: string }> }

const paramsSchema = z.object({ eventId: z.string().uuid() })

const readJsonBody = async (request: Request) => {
  try {
    return await request.json() as unknown
  } catch {
    return null
  }
}

export async function PATCH(request: Request, context: EventRouteContext) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const user = await getCurrentUser()

  if (!user) {
    return eventErrorResponse('Authentification requise', 401)
  }

  if (user.role !== 'club') {
    return eventErrorResponse('Seuls les clubs peuvent modifier un événement', 403)
  }

  const [parsedParams, clubProfile] = await Promise.all([
    context.params.then((params) => paramsSchema.safeParse(params)),
    findClubProfileByUserId(user.id),
  ])

  if (!parsedParams.success) {
    return eventErrorResponse('Identifiant d’événement invalide', 422)
  }

  if (!clubProfile) {
    return eventErrorResponse('Profil club introuvable', 404)
  }

  const body = await readJsonBody(request)
  const parsedBody = updateEventBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return eventErrorResponse(
      'Modification invalide',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  try {
    await updateEvent(parsedParams.data.eventId, clubProfile.id, parsedBody.data)
    const event = await toEventResponse(parsedParams.data.eventId, user.id, clubProfile.id)

    return eventResponse(event)
  } catch (error) {
    if (error instanceof EventOperationError) {
      return eventErrorResponse(error.message, error.status)
    }

    throw error
  }
}
