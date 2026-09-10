import { randomUUID } from 'node:crypto'
import { and, count, eq, sum } from 'drizzle-orm'
import { db } from '@/db'
import { falaises, medias, mediaUploads, placeChangeRequestPhotos, placeCreationRequests, placePhotos, salles, users } from '@/db/schema'
import { logger } from '@/lib/logger'
import { MediaOperationError } from './errors'
import type { NormalizedImage } from './image-upload'
import { removeImage, writeImage } from './storage'

export const MAX_STORED_IMAGES = 100
export const MAX_STORED_BYTES = 100 * 1024 * 1024

export const createMediaUpload = async (ownerId: string, image: NormalizedImage) => {
  const id = randomUUID()
  await writeImage(id, image.data)
  try {
    await db.transaction(async (tx) => {
      // Serialize each owner's quota checks, including concurrent uploads on separate instances.
      const [owner] = await tx.select({ id: users.id }).from(users)
        .where(eq(users.id, ownerId)).limit(1).for('update')
      if (!owner) throw new MediaOperationError('Authentification requise', 401)
      const [usage] = await tx.select({ total: count(), bytes: sum(mediaUploads.byteSize) })
        .from(mediaUploads).where(eq(mediaUploads.ownerId, ownerId))
      if (usage.total >= MAX_STORED_IMAGES || Number(usage.bytes ?? 0) + image.data.length > MAX_STORED_BYTES) {
        throw new MediaOperationError('Quota atteint : supprimez des images avant d’en importer de nouvelles', 409)
      }
      await tx.insert(mediaUploads).values({
        id, ownerId, byteSize: image.data.length, width: image.width, height: image.height,
      })
    })
  } catch (error) {
    await removeImage(id).catch(() => logger.error('media.orphan_cleanup_failed', { mediaId: id }))
    throw error
  }
  return { id, url: `/api/media/${id}`, mimeType: 'image/webp' as const,
    byteSize: image.data.length, width: image.width, height: image.height, visibility: 'private' as const }
}

export const findOwnedMedia = async (id: string, ownerId: string): Promise<typeof mediaUploads.$inferSelect | null> => {
  const [media] = await db.select().from(mediaUploads)
    .where(and(eq(mediaUploads.id, id), eq(mediaUploads.ownerId, ownerId))).limit(1)
  return media ?? null
}

export const deleteOwnedMedia = async (id: string, ownerId: string) => {
  await db.transaction(async (tx) => {
    // Same lock order as attachment/publication: an upload cannot disappear mid-save.
    const [owner] = await tx.select({ id: users.id, avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, ownerId)).limit(1).for('update')
    const [media] = await tx.select().from(mediaUploads).where(and(eq(mediaUploads.id, id), eq(mediaUploads.ownerId, ownerId))).limit(1).for('update')
    if (!owner || !media) throw new MediaOperationError('Image introuvable', 404)
    const [publication] = await tx.select({ id: medias.id }).from(medias).where(eq(medias.url, `/api/post-media/${media.id}`)).limit(1)
    const [placeRequest] = await tx.select({ id: placeCreationRequests.id }).from(placeCreationRequests).where(eq(placeCreationRequests.photoMediaId, media.id)).limit(1)
    const [placeChangePhoto] = await tx.select({ id: placeChangeRequestPhotos.id }).from(placeChangeRequestPhotos).where(eq(placeChangeRequestPhotos.mediaId, media.id)).limit(1)
    const [placePhoto] = await tx.select({ id: placePhotos.id }).from(placePhotos).where(eq(placePhotos.mediaId, media.id)).limit(1)
    const [salle] = await tx.select({ id: salles.id }).from(salles).where(eq(salles.photoUrl, `/api/place-media/${media.id}`)).limit(1)
    const [falaise] = await tx.select({ id: falaises.id }).from(falaises).where(eq(falaises.photoUrl, `/api/place-media/${media.id}`)).limit(1)
    if (owner.avatarUrl === `/api/avatars/${media.id}` || publication || placeRequest || placeChangePhoto || placePhoto || salle || falaise) {
      throw new MediaOperationError('Cette image est déjà utilisée.', 409)
    }
    // Retain metadata for retry if removal fails. Never delete an attached object.
    await removeImage(media.id)
    await tx.delete(mediaUploads).where(and(eq(mediaUploads.id, media.id), eq(mediaUploads.ownerId, ownerId)))
  })
}
