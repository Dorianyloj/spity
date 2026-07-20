import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  createOrRestartPartnership,
  findPartnershipByPair,
  findPublicClimberByUserId,
  listPartnershipsForUser,
} from '@/features/matching/lib/matching-repository'
import {
  matchingErrorResponse,
  partnershipListResponse,
  partnershipResponse,
} from '@/features/matching/lib/responses'
import { createPartnershipBodySchema } from '@/features/matching/schemas'
import { findGrimpeurProfileByUserId } from '@/features/profile/lib/profile-repository'

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
    return matchingErrorResponse('Authentification requise', 401)
  }

  if (user.role !== 'grimpeur') {
    return matchingErrorResponse('Les demandes de partenaire sont réservées aux grimpeurs', 403)
  }

  return partnershipListResponse(await listPartnershipsForUser(user.id))
}

export async function POST(request: Request) {
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

  const body = await readJsonBody(request)
  const parsedBody = createPartnershipBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return matchingErrorResponse(
      'Demande de partenaire invalide',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  if (parsedBody.data.recipientId === user.id) {
    return matchingErrorResponse('Vous ne pouvez pas vous envoyer une demande', 422)
  }

  const [senderProfile, recipient, existing] = await Promise.all([
    findGrimpeurProfileByUserId(user.id),
    findPublicClimberByUserId(parsedBody.data.recipientId),
    findPartnershipByPair(user.id, parsedBody.data.recipientId),
  ])

  if (!senderProfile) {
    return matchingErrorResponse('Complétez votre profil grimpeur avant de contacter un partenaire', 409)
  }

  if (!recipient) {
    return matchingErrorResponse('Ce grimpeur n’est pas disponible pour le matching', 404)
  }

  if (existing?.status === 'pending') {
    return matchingErrorResponse('Une demande est déjà en attente entre ces deux profils', 409)
  }

  if (existing?.status === 'accepted') {
    return matchingErrorResponse('Ces deux profils sont déjà partenaires', 409)
  }

  const partnership = await createOrRestartPartnership(user.id, recipient.userId)

  if (!partnership) {
    return matchingErrorResponse('La demande n’a pas pu être créée', 500)
  }

  return partnershipResponse(partnership, 201)
}
