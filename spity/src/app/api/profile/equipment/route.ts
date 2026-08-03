import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  createUserEquipment,
  findUserEquipmentByUserId,
} from '@/features/profile/lib/profile-repository'
import { profileErrorResponse, profileUnauthorizedResponse } from '@/features/profile/lib/responses'
import {
  createUserEquipmentBodySchema,
  equipmentItemResponseSchema,
  equipmentListResponseSchema,
} from '@/features/profile/schemas'

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
    return profileUnauthorizedResponse()
  }

  if (user.role !== 'grimpeur') {
    return profileErrorResponse('Le matériel détaillé est réservé aux profils grimpeurs', 403)
  }

  const equipment = await findUserEquipmentByUserId(user.id)

  return NextResponse.json(equipmentListResponseSchema.parse({ equipment }))
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
    return profileErrorResponse('Le matériel détaillé est réservé aux profils grimpeurs', 403)
  }

  const body = await readJsonBody(request)
  const parsedBody = createUserEquipmentBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return profileErrorResponse(
      'Matériel invalide',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const equipment = await createUserEquipment(user.id, parsedBody.data)

  if (!equipment) {
    return profileErrorResponse('Impossible de créer le matériel', 500)
  }

  return NextResponse.json(equipmentItemResponseSchema.parse({ equipment }), { status: 201 })
}
