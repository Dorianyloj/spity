import { z } from 'zod'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  findPartnershipById,
  respondToPartnership,
} from '@/features/matching/lib/matching-repository'
import { matchingErrorResponse, partnershipResponse } from '@/features/matching/lib/responses'
import { updatePartnershipBodySchema } from '@/features/matching/schemas'

type PartnershipRouteContext = {
  params: Promise<{ requestId: string }>
}

const paramsSchema = z.object({ requestId: z.string().uuid() })

const readJsonBody = async (request: Request) => {
  try {
    return await request.json() as unknown
  } catch {
    return null
  }
}

export async function PATCH(request: Request, context: PartnershipRouteContext) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const user = await getCurrentUser()

  if (!user) {
    return matchingErrorResponse('Authentification requise', 401)
  }

  if (user.role !== 'grimpeur') {
    return matchingErrorResponse('Les demandes de partenaire sont réservées aux grimpeurs', 403)
  }

  const parsedParams = paramsSchema.safeParse(await context.params)

  if (!parsedParams.success) {
    return matchingErrorResponse('Identifiant de demande invalide', 422)
  }

  const body = await readJsonBody(request)
  const parsedBody = updatePartnershipBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return matchingErrorResponse(
      'Réponse invalide',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const existing = await findPartnershipById(parsedParams.data.requestId)

  if (!existing) {
    return matchingErrorResponse('Demande introuvable', 404)
  }

  if (existing.recipientId !== user.id) {
    return matchingErrorResponse('Seul le destinataire peut répondre à cette demande', 403)
  }

  if (existing.status !== 'pending') {
    return matchingErrorResponse('Cette demande a déjà reçu une réponse', 409)
  }

  const partnership = await respondToPartnership(existing.id, user.id, parsedBody.data.status)

  if (!partnership) {
    return matchingErrorResponse('La demande n’a pas pu être mise à jour', 500)
  }

  return partnershipResponse(partnership)
}
