import { NextResponse } from 'next/server'
import {
  eventErrorResponseSchema,
  eventListResponseSchema,
  eventResponseSchema,
  type SpityEvent,
} from '../schemas'

export const eventErrorResponse = (error: string, status = 400, issues?: string[]) => {
  return NextResponse.json(eventErrorResponseSchema.parse({ error, issues }), { status })
}

export const eventResponse = (event: SpityEvent, status = 200) => {
  return NextResponse.json(eventResponseSchema.parse({ event }), { status })
}

export const eventListResponse = (events: SpityEvent[]) => {
  return NextResponse.json(eventListResponseSchema.parse({ events }))
}
