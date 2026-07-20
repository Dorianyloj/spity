import { NextResponse } from 'next/server'
import {
  matchingErrorResponseSchema,
  partnershipListResponseSchema,
  partnershipResponseSchema,
  type PartnershipRequest,
} from '../schemas'

export const matchingErrorResponse = (error: string, status = 400, issues?: string[]) => {
  return NextResponse.json(matchingErrorResponseSchema.parse({ error, issues }), { status })
}

export const partnershipResponse = (request: PartnershipRequest, status = 200) => {
  return NextResponse.json(partnershipResponseSchema.parse({ request }), { status })
}

export const partnershipListResponse = (requests: PartnershipRequest[]) => {
  return NextResponse.json(partnershipListResponseSchema.parse({ requests }))
}
