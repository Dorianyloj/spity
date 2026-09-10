import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { falaises, medias, mediaUploads, posts, salles, users } from '@/db/schema'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { mediaIdSchema, readImage } from './storage'
import { handleMediaError, mediaErrorResponse } from './responses'

export async function findMemberMedia(id: string, kind: 'avatar' | 'post' | 'place') {
  if (kind === 'avatar') {
    const [row] = await db.select({ id: mediaUploads.id }).from(mediaUploads)
      .innerJoin(users, and(eq(users.id, mediaUploads.ownerId), eq(users.avatarUrl, `/api/avatars/${id}`), eq(users.isSuspended, false)))
      .where(eq(mediaUploads.id, id)).limit(1)
    return row ?? null
  }
  if (kind === 'post') {
    const [row] = await db.select({ id: mediaUploads.id }).from(mediaUploads)
      .innerJoin(medias, eq(medias.url, `/api/post-media/${id}`))
      .innerJoin(posts, and(eq(posts.id, medias.postId), eq(posts.authorId, mediaUploads.ownerId), eq(posts.isHidden, false)))
      .where(eq(mediaUploads.id, id)).limit(1)
    return row ?? null
  }
  const [salleRows, falaiseRows] = await Promise.all([
    db.select({ id: mediaUploads.id }).from(mediaUploads)
      .innerJoin(salles, eq(salles.photoUrl, `/api/place-media/${id}`))
      .where(eq(mediaUploads.id, id)).limit(1),
    db.select({ id: mediaUploads.id }).from(mediaUploads)
      .innerJoin(falaises, eq(falaises.photoUrl, `/api/place-media/${id}`))
      .where(eq(mediaUploads.id, id)).limit(1),
  ])
  return salleRows[0] ?? falaiseRows[0] ?? null
}

export async function serveMemberMedia(id: string, kind: 'avatar' | 'post' | 'place') {
  try {
    const viewer = await getCurrentProfile()
    if (!viewer) return mediaErrorResponse('Authentification requise', 401)
    if (!viewer.grimpeurProfile && !viewer.clubProfile) return mediaErrorResponse('Profil requis', 403)
    const parsed = mediaIdSchema.safeParse(id)
    if (!parsed.success) return mediaErrorResponse('Image introuvable', 404)
    const row = await findMemberMedia(parsed.data.toLowerCase(), kind)
    if (!row) return mediaErrorResponse('Image introuvable', 404)
    let data: Buffer
    try { data = await readImage(row.id) }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return mediaErrorResponse('Image introuvable', 404); throw error }
    return new Response(new Uint8Array(data), { headers: {
      'Content-Type': 'image/webp', 'Content-Length': String(data.length),
      'Content-Disposition': `inline; filename="${row.id}.webp"`,
      'X-Content-Type-Options': 'nosniff', 'Cross-Origin-Resource-Policy': 'same-origin',
      'Cache-Control': 'private, no-store', Vary: 'Cookie', 'Content-Security-Policy': "default-src 'none'; sandbox",
    } })
  } catch (error) { return handleMediaError(error) }
}
