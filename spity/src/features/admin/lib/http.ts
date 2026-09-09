import { NextResponse } from 'next/server'
import { hasValidOrigin } from '@/features/auth/lib/csrf'
import { AdminError } from './access'

export function adminResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie', 'X-Robots-Tag': 'noindex, nofollow' } })
}

export async function readModerationBody(request: Request): Promise<unknown> {
  const origin = request.headers.get('origin')
  if (!origin || !/^https?:\/\//.test(origin) || !hasValidOrigin(request)) throw new AdminError('Origine de requête invalide.', 403)
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new AdminError('JSON requis.', 415)
  const reader = request.body?.getReader()
  if (!reader) throw new AdminError('Corps JSON invalide.', 400)
  let size = 0
  const chunks: Uint8Array[] = []
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 4096) {
        await reader.cancel()
        throw new AdminError('Requête trop volumineuse.', 413)
      }
      chunks.push(value)
    }
    try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown }
    catch { throw new AdminError('Corps JSON invalide.', 400) }
  } finally { reader.releaseLock() }
}
