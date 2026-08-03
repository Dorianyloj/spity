import { randomUUID } from 'crypto'
import { and, asc, desc, eq, inArray, ne, or } from 'drizzle-orm'
import { db } from '@/db'
import { grimpeurProfiles, partnershipRequests, users } from '@/db/schema'
import {
  partnershipParticipantSchema,
  partnershipRequestSchema,
  publicClimberSchema,
  type PartnershipRequest,
  type PublicClimber,
} from '../schemas'
import {
  buildPartnershipPairKey,
  parsePartnerSearch,
  parseStringArray,
  parseStringRecord,
} from './matching-rules'

type DirectoryRow = {
  userId: string
  avatarUrl: string | null
  displayName: string | null
  bio: string | null
  location: string | null
  climbingEnvironment: 'indoor' | 'outdoor' | 'mixed' | null
  availability: unknown
  partnerSearch: unknown
  goals: unknown
  disciplines: unknown
  niveaux: unknown
  materiel: unknown
  karma: number | null
}

const isDuplicateEntryError = (error: unknown) => {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 'ER_DUP_ENTRY'
}

const toPublicClimber = (row: DirectoryRow, requireMatchingEnabled = true): PublicClimber | null => {
  const partnerSearch = parsePartnerSearch(row.partnerSearch)

  if (!partnerSearch || (requireMatchingEnabled && !partnerSearch.enabled)) {
    return null
  }

  const result = publicClimberSchema.safeParse({
    userId: row.userId,
    displayName: row.displayName ?? 'Grimpeur Spity',
    avatarUrl: row.avatarUrl,
    bio: row.bio,
    location: row.location,
    climbingEnvironment: row.climbingEnvironment,
    availability: parseStringArray(row.availability),
    partnerSearch,
    goals: parseStringArray(row.goals),
    disciplines: parseStringArray(row.disciplines),
    niveaux: parseStringRecord(row.niveaux),
    materiel: parseStringArray(row.materiel),
    karma: row.karma ?? 0,
  })

  return result.success ? result.data : null
}

const selectDirectoryRows = async (excludedUserId?: string) => {
  return db
    .select({
      userId: users.id,
      avatarUrl: users.avatarUrl,
      displayName: grimpeurProfiles.displayName,
      bio: grimpeurProfiles.bio,
      location: grimpeurProfiles.location,
      climbingEnvironment: grimpeurProfiles.climbingEnvironment,
      availability: grimpeurProfiles.availability,
      partnerSearch: grimpeurProfiles.partnerSearch,
      goals: grimpeurProfiles.goals,
      disciplines: grimpeurProfiles.disciplines,
      niveaux: grimpeurProfiles.niveaux,
      materiel: grimpeurProfiles.materiel,
      karma: grimpeurProfiles.karma,
    })
    .from(grimpeurProfiles)
    .innerJoin(users, eq(users.id, grimpeurProfiles.userId))
    .where(excludedUserId ? ne(users.id, excludedUserId) : undefined)
    .orderBy(asc(grimpeurProfiles.displayName), asc(users.id))
    .limit(100)
}

export const findMatchingClimbers = async (currentUserId: string) => {
  const rows = await selectDirectoryRows(currentUserId)

  return rows
    .map((row) => toPublicClimber(row))
    .filter((climber): climber is PublicClimber => climber !== null)
}

export const findPublicClimberByUserId = async (userId: string) => {
  const rows = await db
    .select({
      userId: users.id,
      avatarUrl: users.avatarUrl,
      displayName: grimpeurProfiles.displayName,
      bio: grimpeurProfiles.bio,
      location: grimpeurProfiles.location,
      climbingEnvironment: grimpeurProfiles.climbingEnvironment,
      availability: grimpeurProfiles.availability,
      partnerSearch: grimpeurProfiles.partnerSearch,
      goals: grimpeurProfiles.goals,
      disciplines: grimpeurProfiles.disciplines,
      niveaux: grimpeurProfiles.niveaux,
      materiel: grimpeurProfiles.materiel,
      karma: grimpeurProfiles.karma,
    })
    .from(grimpeurProfiles)
    .innerJoin(users, eq(users.id, grimpeurProfiles.userId))
    .where(eq(users.id, userId))
    .limit(1)

  return rows[0] ? toPublicClimber(rows[0], false) : null
}

export const findMatchingClimberByUserId = async (userId: string) => {
  const climber = await findPublicClimberByUserId(userId)

  return climber?.partnerSearch.enabled ? climber : null
}

const serializeRequest = async (
  row: typeof partnershipRequests.$inferSelect,
  viewerId: string
): Promise<PartnershipRequest | null> => {
  const otherUserId = row.senderId === viewerId ? row.recipientId : row.senderId
  const otherParticipant = await findPublicClimberByUserId(otherUserId)

  if (!otherParticipant) {
    return null
  }

  return partnershipRequestSchema.parse({
    id: row.id,
    senderId: row.senderId,
    recipientId: row.recipientId,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    respondedAt: row.respondedAt?.toISOString() ?? null,
    otherParticipant: partnershipParticipantSchema.parse(otherParticipant),
    direction: row.senderId === viewerId ? 'sent' : 'received',
  })
}

export const findPartnershipByPair = async (firstUserId: string, secondUserId: string) => {
  const [request] = await db
    .select()
    .from(partnershipRequests)
    .where(eq(partnershipRequests.pairKey, buildPartnershipPairKey(firstUserId, secondUserId)))
    .limit(1)

  return request ?? null
}

export const findPartnershipById = async (requestId: string) => {
  const [request] = await db
    .select()
    .from(partnershipRequests)
    .where(eq(partnershipRequests.id, requestId))
    .limit(1)

  return request ?? null
}

export const listPartnershipsForUser = async (userId: string) => {
  const rows = await db
    .select()
    .from(partnershipRequests)
    .where(or(eq(partnershipRequests.senderId, userId), eq(partnershipRequests.recipientId, userId)))
    .orderBy(desc(partnershipRequests.updatedAt))
    .limit(100)

  const serialized = await Promise.all(rows.map((row) => serializeRequest(row, userId)))

  return serialized.filter((request): request is PartnershipRequest => request !== null)
}

export const createOrRestartPartnership = async (senderId: string, recipientId: string) => {
  const existing = await findPartnershipByPair(senderId, recipientId)

  if (existing) {
    await db
      .update(partnershipRequests)
      .set({ senderId, recipientId, status: 'pending', respondedAt: null })
      .where(and(eq(partnershipRequests.id, existing.id), eq(partnershipRequests.status, 'declined')))
  } else {
    try {
      await db.insert(partnershipRequests).values({
        id: randomUUID(),
        pairKey: buildPartnershipPairKey(senderId, recipientId),
        senderId,
        recipientId,
      })
    } catch (error) {
      if (!isDuplicateEntryError(error)) {
        throw error
      }
    }
  }

  const freshRequest = await findPartnershipByPair(senderId, recipientId)

  return freshRequest ? serializeRequest(freshRequest, senderId) : null
}

export const respondToPartnership = async (
  requestId: string,
  recipientId: string,
  status: 'accepted' | 'declined'
) => {
  await db
    .update(partnershipRequests)
    .set({ status, respondedAt: new Date() })
    .where(and(
      eq(partnershipRequests.id, requestId),
      eq(partnershipRequests.recipientId, recipientId),
      eq(partnershipRequests.status, 'pending')
    ))

  const request = await findPartnershipById(requestId)

  return request ? serializeRequest(request, recipientId) : null
}

export const findPartnershipStatuses = async (userId: string, otherUserIds: string[]) => {
  if (otherUserIds.length === 0) {
    return new Map<string, PartnershipRequest['status']>()
  }

  const rows = await db
    .select()
    .from(partnershipRequests)
    .where(and(
      or(eq(partnershipRequests.senderId, userId), eq(partnershipRequests.recipientId, userId)),
      or(inArray(partnershipRequests.senderId, otherUserIds), inArray(partnershipRequests.recipientId, otherUserIds))
    ))

  return new Map(rows.map((row) => [row.senderId === userId ? row.recipientId : row.senderId, row.status]))
}
