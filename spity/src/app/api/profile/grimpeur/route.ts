import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  createGrimpeurProfile,
  findClubProfileByUserId,
  findGrimpeurProfileByUserId,
  findUserEquipmentByUserId,
  updateGrimpeurProfile,
} from '@/features/profile/lib/profile-repository'
import { profileErrorResponse, profileMeResponse, profileUnauthorizedResponse } from '@/features/profile/lib/responses'
import { createGrimpeurProfileBodySchema, updateGrimpeurProfileBodySchema } from '@/features/profile/schemas'

const readJsonBody = async (request: Request) => {
  try {
    return await request.json() as unknown
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const user = await getCurrentUser()

  if (!user) {
    return profileUnauthorizedResponse()
  }

  if (user.role !== 'grimpeur') {
    return profileErrorResponse('Ce compte n\'est pas un profil grimpeur', 403)
  }

  const existingProfile = await findGrimpeurProfileByUserId(user.id)

  if (existingProfile) {
    return profileErrorResponse('Le profil grimpeur existe déjà', 409)
  }

  const body = await readJsonBody(request)
  const parsedBody = createGrimpeurProfileBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return profileErrorResponse(
      'Données de profil invalides',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const grimpeurProfile = await createGrimpeurProfile(user.id, parsedBody.data)
  const clubProfile = await findClubProfileByUserId(user.id)
  const equipment = await findUserEquipmentByUserId(user.id)

  return profileMeResponse(user, grimpeurProfile, clubProfile, equipment, 201)
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

  const existingProfile = await findGrimpeurProfileByUserId(user.id)

  if (!existingProfile) {
    return profileErrorResponse('Profil grimpeur introuvable', 404)
  }

  const body = await readJsonBody(request)
  const parsedBody = updateGrimpeurProfileBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return profileErrorResponse(
      'Données de profil invalides',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const grimpeurProfile = await updateGrimpeurProfile(user.id, parsedBody.data)
  const clubProfile = await findClubProfileByUserId(user.id)
  const equipment = await findUserEquipmentByUserId(user.id)

  return profileMeResponse(user, grimpeurProfile, clubProfile, equipment)
}
