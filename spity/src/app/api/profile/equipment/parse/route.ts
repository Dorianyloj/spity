import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import { parseEquipmentText } from '@/features/profile/lib/equipment-parser'
import { profileErrorResponse, profileUnauthorizedResponse } from '@/features/profile/lib/responses'
import { parseEquipmentBodySchema, parseEquipmentResponseSchema } from '@/features/profile/schemas'

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
    return profileErrorResponse('Le matériel détaillé est réservé aux profils grimpeurs', 403)
  }

  const body = await readJsonBody(request)
  const parsedBody = parseEquipmentBodySchema.safeParse(body)

  if (!parsedBody.success) {
    return profileErrorResponse(
      'Texte de matériel invalide',
      422,
      parsedBody.error.issues.map((issue) => issue.message)
    )
  }

  const items = parseEquipmentText(parsedBody.data.text)

  return NextResponse.json(parseEquipmentResponseSchema.parse({ items }))
}
