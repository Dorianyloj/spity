import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  findClubProfileByUserId,
  findGrimpeurProfileByUserId,
  findUserEquipmentByUserId,
  updatePublicGrimpeurProfile,
} from '@/features/profile/lib/profile-repository'
import { profileErrorResponse, profileMeResponse, profileUnauthorizedResponse } from '@/features/profile/lib/responses'
import { updatePublicProfileBodySchema } from '@/features/profile/schemas'

const readJsonBody = async (request: Request) => {
  try {
    return await request.json() as unknown
  } catch {
    return null
  }
}

export async function PATCH(request: Request) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const user = await getCurrentUser()

  if (!user) {
    return profileUnauthorizedResponse()
  }

  if (user.role !== 'grimpeur') {
    return profileErrorResponse('La fiche publique enrichie est réservée aux profils grimpeurs', 403)
  }

  const existingProfile = await findGrimpeurProfileByUserId(user.id)

  if (!existingProfile) {
    return profileErrorResponse('Profil grimpeur introuvable', 404)
  }

  const body = await readJsonBody(request)
  const parsedBody = updatePublicProfileBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return profileErrorResponse(
      'Données de profil public invalides',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const grimpeurProfile = await updatePublicGrimpeurProfile(user.id, parsedBody.data)
  const [freshUser, clubProfile, equipment] = await Promise.all([
    getCurrentUser(),
    findClubProfileByUserId(user.id),
    findUserEquipmentByUserId(user.id),
  ])

  if (!freshUser) {
    return profileUnauthorizedResponse()
  }

  return profileMeResponse(freshUser, grimpeurProfile, clubProfile, equipment)
}
