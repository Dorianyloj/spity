import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  createClubProfile,
  findClubProfileByUserId,
  findGrimpeurProfileByUserId,
  findUserEquipmentByUserId,
  updateClubProfile,
} from '@/features/profile/lib/profile-repository'
import { profileErrorResponse, profileMeResponse, profileUnauthorizedResponse } from '@/features/profile/lib/responses'
import { createClubProfileBodySchema, updateClubProfileBodySchema } from '@/features/profile/schemas'

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

  if (user.role !== 'club') {
    return profileErrorResponse('Ce compte n\'est pas un profil club', 403)
  }

  const existingProfile = await findClubProfileByUserId(user.id)

  if (existingProfile) {
    return profileErrorResponse('Le profil club existe déjà', 409)
  }

  const body = await readJsonBody(request)
  const parsedBody = createClubProfileBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return profileErrorResponse(
      'Données de profil invalides',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const clubProfile = await createClubProfile(user.id, parsedBody.data)
  const grimpeurProfile = await findGrimpeurProfileByUserId(user.id)
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

  const existingProfile = await findClubProfileByUserId(user.id)

  if (!existingProfile) {
    return profileErrorResponse('Profil club introuvable', 404)
  }

  const body = await readJsonBody(request)
  const parsedBody = updateClubProfileBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return profileErrorResponse(
      'Données de profil invalides',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const clubProfile = await updateClubProfile(user.id, parsedBody.data)
  const grimpeurProfile = await findGrimpeurProfileByUserId(user.id)
  const equipment = await findUserEquipmentByUserId(user.id)

  return profileMeResponse(user, grimpeurProfile, clubProfile, equipment)
}
