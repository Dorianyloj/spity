import { randomUUID } from 'node:crypto'
import { and, count, eq, sum } from 'drizzle-orm'
import { db } from '@/db'
import { mediaUploads, users } from '@/db/schema'
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
  const media = await findOwnedMedia(id, ownerId)
  if (!media) throw new MediaOperationError('Image introuvable', 404)
  // Remove the bytes first. If SQL fails, a retry safely removes the remaining metadata.
  await removeImage(media.id)
  await db.delete(mediaUploads).where(and(eq(mediaUploads.id, media.id), eq(mediaUploads.ownerId, ownerId)))
}
