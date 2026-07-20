import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { releaseMetadata } from '@/lib/release-metadata'
import { healthResponseSchema } from './schemas'

export const dynamic = 'force-dynamic'

const responseHeaders = {
  'Cache-Control': 'no-store',
}

export async function GET() {
  try {
    await db.select({ id: users.id }).from(users).limit(1)

    return NextResponse.json(healthResponseSchema.parse({
      status: 'ok',
      ...releaseMetadata,
    }), {
      headers: responseHeaders,
    })
  } catch {
    return NextResponse.json(healthResponseSchema.parse({
      status: 'unavailable',
      ...releaseMetadata,
    }), {
      status: 503,
      headers: responseHeaders,
    })
  }
}
