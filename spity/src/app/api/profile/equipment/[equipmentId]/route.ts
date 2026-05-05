import { z } from 'zod'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  deleteUserEquipment,
  findUserEquipmentItem,
  updateUserEquipment,
} from '@/features/profile/lib/profile-repository'
import { profileErrorResponse, profileUnauthorizedResponse } from '@/features/profile/lib/responses'
import { equipmentItemResponseSchema, updateUserEquipmentBodySchema } from '@/features/profile/schemas'

type EquipmentRouteContext = {
  params: Promise<{
    equipmentId: string
  }>
}

const paramsSchema = z.object({
  equipmentId: z.string().uuid(),
})

const readJsonBody = async (request: Request) => {
  try {
    return await request.json() as unknown
  } catch {
    return null
  }
}

const readEquipmentId = async (context: EquipmentRouteContext) => {
  const parsedParams = paramsSchema.safeParse(await context.params)

  return parsedParams.success ? parsedParams.data.equipmentId : null
}

export async function PATCH(request: Request, context: EquipmentRouteContext) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const user = await getCurrentUser()

  if (!user) {
    return profileUnauthorizedResponse()
  }

  if (user.role !== 'grimpeur') {
    return profileErrorResponse('Le matériel détaillé est réservé aux profils grimpeurs', 403)
  }

  const equipmentId = await readEquipmentId(context)

  if (!equipmentId) {
    return profileErrorResponse('Identifiant matériel invalide', 422)
  }

  const existingEquipment = await findUserEquipmentItem(user.id, equipmentId)

  if (!existingEquipment) {
    return profileErrorResponse('Matériel introuvable', 404)
  }

  const body = await readJsonBody(request)
  const parsedBody = updateUserEquipmentBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return profileErrorResponse(
      'Matériel invalide',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const equipment = await updateUserEquipment(user.id, equipmentId, parsedBody.data)

  if (!equipment) {
    return profileErrorResponse('Matériel introuvable', 404)
  }

  return NextResponse.json(equipmentItemResponseSchema.parse({ equipment }))
}

export async function DELETE(request: Request, context: EquipmentRouteContext) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const user = await getCurrentUser()

  if (!user) {
    return profileUnauthorizedResponse()
  }

  if (user.role !== 'grimpeur') {
    return profileErrorResponse('Le matériel détaillé est réservé aux profils grimpeurs', 403)
  }

  const equipmentId = await readEquipmentId(context)

  if (!equipmentId) {
    return profileErrorResponse('Identifiant matériel invalide', 422)
  }

  const existingEquipment = await findUserEquipmentItem(user.id, equipmentId)

  if (!existingEquipment) {
    return profileErrorResponse('Matériel introuvable', 404)
  }

  await deleteUserEquipment(user.id, equipmentId)

  return NextResponse.json({ message: 'Matériel supprimé' })
}
