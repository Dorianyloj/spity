import { randomUUID } from 'node:crypto'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { grimpeurProfiles, mediaUploads, medias, posts, users } from '@/db/schema'
import type { CreateProfilePost, ProfileSettings } from '../workspace-schemas'
import { ProfileOperationError } from './http'

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
async function lockClimber(tx: Transaction, userId: string) {
  const [user] = await tx.select({ id: users.id, suspended: users.isSuspended, role: users.role }).from(users).where(eq(users.id, userId)).limit(1).for('update')
  if (!user || user.suspended) throw new ProfileOperationError('Authentification requise.', 401)
  if (user.role !== 'grimpeur') throw new ProfileOperationError('Cette action est réservée aux grimpeurs.', 403)
  const [profile] = await tx.select({ id: grimpeurProfiles.id }).from(grimpeurProfiles).where(eq(grimpeurProfiles.userId, userId)).limit(1).for('update')
  if (!profile) throw new ProfileOperationError('Complète ton profil avant de continuer.', 409)
}
async function ownedUpload(tx: Transaction, userId: string, id: string) {
  const [media] = await tx.select({ id: mediaUploads.id }).from(mediaUploads)
    .where(and(eq(mediaUploads.id, id), eq(mediaUploads.ownerId, userId))).limit(1).for('update')
  if (!media) throw new ProfileOperationError('Cette image est introuvable ou ne t’appartient pas.', 404)
  return media.id
}

export async function saveProfileSettings(userId: string, values: ProfileSettings) {
  await db.transaction(async (tx) => {
    await lockClimber(tx, userId)
    if (values.section === 'identity') {
      if (values.avatarMediaId !== undefined) {
        const id = values.avatarMediaId === null ? null : await ownedUpload(tx, userId, values.avatarMediaId)
        await tx.update(users).set({ avatarUrl: id ? `/api/avatars/${id}` : null }).where(eq(users.id, userId))
      }
      await tx.update(grimpeurProfiles).set({ displayName: values.displayName, bio: values.bio, location: values.location }).where(eq(grimpeurProfiles.userId, userId))
    } else if (values.section === 'practice') {
      await tx.update(grimpeurProfiles).set({
        disciplines: [...new Set(values.disciplines)],
        niveaux: Object.fromEntries(values.disciplines.map((key) => [key, values.niveaux[key]!])),
        climbingEnvironment: values.climbingEnvironment, goals: [...new Set(values.goals)],
      }).where(eq(grimpeurProfiles.userId, userId))
    } else {
      await tx.update(grimpeurProfiles).set({ availability: [...new Set(values.availability)], partnerSearch: values.partnerSearch }).where(eq(grimpeurProfiles.userId, userId))
    }
  })
}

export async function createProfilePost(userId: string, values: CreateProfilePost) {
  const id = randomUUID()
  await db.transaction(async (tx) => {
    await lockClimber(tx, userId)
    const mediaId = values.mediaId ? await ownedUpload(tx, userId, values.mediaId) : null
    await tx.insert(posts).values({ id, authorId: userId, contenu: values.content, cotation: values.cotation, isHidden: false })
    if (mediaId) await tx.insert(medias).values({ id: randomUUID(), postId: id, url: `/api/post-media/${mediaId}` })
  })
  return id
}
