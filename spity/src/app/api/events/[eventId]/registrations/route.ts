import { z } from 'zod'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  cancelEventRegistration,
  EventOperationError,
  registerForEvent,
  toEventResponse,
} from '@/features/events/lib/event-repository'
import { eventErrorResponse, eventResponse } from '@/features/events/lib/responses'
import { findGrimpeurProfileByUserId } from '@/features/profile/lib/profile-repository'

type RegistrationRouteContext = { params: Promise<{ eventId: string }> }

const paramsSchema = z.object({ eventId: z.string().uuid() })

const prepareRegistration = async (context: RegistrationRouteContext) => {
  const user = await getCurrentUser()
  const parsedParams = paramsSchema.safeParse(await context.params)

  return { user, parsedParams }
}

const mutateRegistration = async (
  request: Request,
  context: RegistrationRouteContext,
  action: 'register' | 'cancel'
) => {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const { user, parsedParams } = await prepareRegistration(context)

  if (!user) {
    return eventErrorResponse('Authentification requise', 401)
  }

  if (user.role !== 'grimpeur') {
    return eventErrorResponse('Les inscriptions sont réservées aux grimpeurs', 403)
  }

  if (!parsedParams.success) {
    return eventErrorResponse('Identifiant d’événement invalide', 422)
  }

  if (!await findGrimpeurProfileByUserId(user.id)) {
    return eventErrorResponse('Complétez votre profil grimpeur avant de vous inscrire', 409)
  }

  try {
    if (action === 'register') {
      await registerForEvent(parsedParams.data.eventId, user.id)
    } else {
      await cancelEventRegistration(parsedParams.data.eventId, user.id)
    }

    const event = await toEventResponse(parsedParams.data.eventId, user.id, null)

    return eventResponse(event)
  } catch (error) {
    if (error instanceof EventOperationError) {
      return eventErrorResponse(error.message, error.status)
    }

    throw error
  }
}

export async function POST(request: Request, context: RegistrationRouteContext) {
  return mutateRegistration(request, context, 'register')
}

export async function DELETE(request: Request, context: RegistrationRouteContext) {
  return mutateRegistration(request, context, 'cancel')
}
