import { randomUUID } from 'crypto'
import { and, count, countDistinct, desc, eq, inArray, isNull, or, sql } from 'drizzle-orm'
import type { AnyMySqlColumn, MySqlTable } from 'drizzle-orm/mysql-core'
import { db } from '@/db'
import { adminAuditLogs, comments, falaises, likes, placeChangeRequestPhotos, placeChangeRequests, placeCreationRequests, placePhotos, posts, salles, users } from '@/db/schema'
import { getSessionFromCookies } from '@/features/auth/lib/session'
import { placeChangeInputSchema, placeReviewSchema } from '@/features/places/schemas'
import type { AdminQuery, ModerationTarget } from '../schemas'
import { moderationSchema } from '../schemas'
import { AdminError, requireAdmin } from './access'
import { buildActivity, DAY_SECONDS, periodBounds } from './statistics'

export const PAGE_SIZE = 20

export async function getAdminDashboard(days: number) {
  await requireAdmin()
  const now = new Date()
  const { start, previousStart, end } = periodBounds(days, now)
  const range = (column: AnyMySqlColumn, from: number, to: number) => sql`unix_timestamp(${column}) >= ${from * DAY_SECONDS} and unix_timestamp(${column}) < ${to * DAY_SECONDS}`
  const daily = (table: MySqlTable, column: AnyMySqlColumn) => {
    const day = sql<number>`floor(unix_timestamp(${column}) / ${DAY_SECONDS})`.mapWith(Number)
    return db.select({ day, value: count() }).from(table).where(range(column, previousStart, end)).groupBy(day)
  }
  const [accounts, publications, commentCounts, likeCounts, roles, hidden, undated, contributors, previousContributors, recentAccounts, recentActions] = await Promise.all([
    daily(users, users.createdAt), daily(posts, posts.createdAt), daily(comments, comments.createdAt), daily(likes, likes.createdAt),
    db.select({ role: users.role, total: count(), suspended: sql<number>`sum(${users.isSuspended})`.mapWith(Number), admins: sql<number>`sum(${users.isAdmin})`.mapWith(Number) }).from(users).groupBy(users.role),
    db.select({ total: count(), hidden: sql<number>`coalesce(sum(${posts.isHidden}), 0)`.mapWith(Number) }).from(posts),
    db.select({ value: count() }).from(likes).where(isNull(likes.createdAt)),
    db.select({ value: countDistinct(posts.authorId) }).from(posts).where(range(posts.createdAt, start, end)),
    db.select({ value: countDistinct(posts.authorId) }).from(posts).where(range(posts.createdAt, previousStart, start)),
    db.select({ id: users.id, email: users.email, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt), desc(users.id)).limit(5),
    db.select({ id: adminAuditLogs.id, action: adminAuditLogs.action, createdAt: adminAuditLogs.createdAt }).from(adminAuditLogs).orderBy(desc(adminAuditLogs.createdAt), desc(adminAuditLogs.id)).limit(5),
  ])
  return {
    ...buildActivity(days, { accounts, posts: publications, comments: commentCounts, likes: likeCounts }, now),
    generatedAt: now, roles, totalPosts: hidden[0].total, hiddenPosts: hidden[0].hidden,
    suspended: roles.reduce((sum, row) => sum + row.suspended, 0),
    admins: roles.reduce((sum, row) => sum + row.admins, 0),
    undatedLikes: undated[0].value, contributors: contributors[0].value, previousContributors: previousContributors[0].value,
    recentAccounts, recentActions,
  }
}

// Only safe DTO columns leave this module: never passwords, reset tokens or session versions.
export async function listAdminAccounts(query: AdminQuery) {
  await requireAdmin()
  const statusFilter = query.status === 'restricted' || query.status === 'active'
    ? eq(users.isSuspended, query.status === 'restricted')
    : undefined
  // Explicit ESCAPE makes user-entered % and _ literal, independent of the SQL mode.
  const filter = and(query.q ? sql`${users.email} like ${`%${query.q.replace(/[!%_]/g, '!$&')}%`} escape '!'` : undefined,
    statusFilter)
  const [rows, total] = await Promise.all([
    db.select({ id: users.id, email: users.email, role: users.role, isAdmin: users.isAdmin, isSuspended: users.isSuspended, createdAt: users.createdAt }).from(users).where(filter).orderBy(desc(users.createdAt), desc(users.id)).limit(PAGE_SIZE).offset((query.page - 1) * PAGE_SIZE),
    db.select({ value: count() }).from(users).where(filter),
  ])
  return { rows, total: total[0].value }
}

export async function listAdminPosts(query: AdminQuery) {
  await requireAdmin()
  const statusFilter = query.status === 'restricted' || query.status === 'active'
    ? eq(posts.isHidden, query.status === 'restricted')
    : undefined
  const filter = and(query.q ? sql`${posts.contenu} like ${`%${query.q.replace(/[!%_]/g, '!$&')}%`} escape '!'` : undefined,
    statusFilter)
  const [rows, total] = await Promise.all([
    db.select({ id: posts.id, content: posts.contenu, email: users.email, isHidden: posts.isHidden, createdAt: posts.createdAt }).from(posts).innerJoin(users, eq(posts.authorId, users.id)).where(filter).orderBy(desc(posts.createdAt), desc(posts.id)).limit(PAGE_SIZE).offset((query.page - 1) * PAGE_SIZE),
    db.select({ value: count() }).from(posts).where(filter),
  ])
  return { rows, total: total[0].value }
}

export async function listAdminPlaceRequests(query: AdminQuery) {
  await requireAdmin()
  const escapedQuery = query.q.replace(/[!%_]/g, '!$&')
  const search = query.q ? or(
    sql`${placeCreationRequests.name} like ${`%${escapedQuery}%`} escape '!'`,
    sql`${placeCreationRequests.city} like ${`%${escapedQuery}%`} escape '!'`,
    sql`${users.email} like ${`%${escapedQuery}%`} escape '!'`,
  ) : undefined
  const requestStatus = ['pending', 'approved', 'rejected'].includes(query.status)
    ? query.status as 'pending' | 'approved' | 'rejected'
    : undefined
  const filter = and(search, requestStatus ? eq(placeCreationRequests.status, requestStatus) : undefined)
  const [rows, total] = await Promise.all([
    db.select({ request: placeCreationRequests, authorEmail: users.email })
      .from(placeCreationRequests)
      .innerJoin(users, eq(placeCreationRequests.authorId, users.id))
      .where(filter)
      .orderBy(desc(placeCreationRequests.createdAt), desc(placeCreationRequests.id))
      .limit(PAGE_SIZE)
      .offset((query.page - 1) * PAGE_SIZE),
    db.select({ value: count() })
      .from(placeCreationRequests)
      .innerJoin(users, eq(placeCreationRequests.authorId, users.id))
      .where(filter),
  ])
  return { rows, total: total[0].value }
}

export async function listAdminPlaceChangeRequests(query: AdminQuery) {
  await requireAdmin()
  const requestStatus = ['pending', 'approved', 'rejected'].includes(query.status)
    ? query.status as 'pending' | 'approved' | 'rejected'
    : undefined
  const emailFilter = query.q
    ? sql`${users.email} like ${`%${query.q.replace(/[!%_]/g, '!$&')}%`} escape '!'`
    : undefined
  const filter = and(emailFilter, requestStatus ? eq(placeChangeRequests.status, requestStatus) : undefined)
  const [rows, total] = await Promise.all([
    db.select({ request: placeChangeRequests, authorEmail: users.email })
      .from(placeChangeRequests)
      .innerJoin(users, eq(placeChangeRequests.authorId, users.id))
      .where(filter)
      .orderBy(desc(placeChangeRequests.createdAt), desc(placeChangeRequests.id))
      .limit(PAGE_SIZE)
      .offset((query.page - 1) * PAGE_SIZE),
    db.select({ value: count() })
      .from(placeChangeRequests)
      .innerJoin(users, eq(placeChangeRequests.authorId, users.id))
      .where(filter),
  ])
  const ids = rows.map(({ request }) => request.id)
  const photos = ids.length
    ? await db.select({ requestId: placeChangeRequestPhotos.requestId, mediaId: placeChangeRequestPhotos.mediaId })
      .from(placeChangeRequestPhotos).where(inArray(placeChangeRequestPhotos.requestId, ids))
    : []
  const photosByRequest = new Map<string, string[]>()
  for (const photo of photos) photosByRequest.set(photo.requestId, [...(photosByRequest.get(photo.requestId) ?? []), photo.mediaId])
  return { rows: rows.map((row) => ({ ...row, photoMediaIds: photosByRequest.get(row.request.id) ?? [] })), total: total[0].value }
}

const parseStringArray = (value: unknown) => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')
  if (typeof value !== 'string') return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

const parseStoredObject = (value: unknown) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>
  if (typeof value !== 'string') return {}
  try {
    const parsed: unknown = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {}
  } catch {
    return {}
  }
}

const nullableValue = (value: string) => value || null
const levelList = (value: string) => value.split(/[;,\n]/).map((level) => level.trim()).filter(Boolean).slice(0, 30)

export async function reviewPlaceRequest(requestId: string, input: unknown) {
  await requireAdmin()
  const session = await getSessionFromCookies()
  if (!session) throw new AdminError('Connexion requise.', 401)
  const review = placeReviewSchema.parse(input)

  await db.transaction(async (tx) => {
    const [actor] = await tx.select({ id: users.id, isAdmin: users.isAdmin, isSuspended: users.isSuspended, version: users.sessionVersion })
      .from(users).where(eq(users.id, session.sub)).limit(1).for('update')
    if (!actor?.isAdmin || actor.isSuspended || actor.version !== session.ver) throw new AdminError('Accès administrateur requis.', 403)

    const [placeRequest] = await tx.select().from(placeCreationRequests)
      .where(eq(placeCreationRequests.id, requestId)).limit(1).for('update')
    if (!placeRequest) throw new AdminError('Demande de lieu introuvable.', 404)
    if (placeRequest.status !== 'pending') throw new AdminError('Cette demande a déjà été traitée.', 409)

    if (review.decision === 'approve') {
      if (placeRequest.kind === 'salle') {
        if (!placeRequest.address) throw new AdminError('L’adresse de la salle est manquante.', 409)
        const placeId = randomUUID()
        await tx.insert(salles).values({
          id: placeId,
          nom: placeRequest.name,
          location: placeRequest.city,
          department: placeRequest.department,
          region: placeRequest.region,
          adresse: placeRequest.address,
          disciplines: parseStringArray(placeRequest.disciplines),
          photoUrl: placeRequest.photoMediaId ? `/api/place-media/${placeRequest.photoMediaId}` : null,
          services: parseStringArray(placeRequest.services),
          siteWeb: placeRequest.website,
          latitude: placeRequest.latitude,
          longitude: placeRequest.longitude,
          restrictions: placeRequest.restrictions,
          sourceUrl: placeRequest.sourceUrl,
          notes: placeRequest.notes,
        })
        if (placeRequest.photoMediaId) await tx.insert(placePhotos).values({ salleId: placeId, mediaId: placeRequest.photoMediaId })
      } else {
        const orientations = parseStringArray(placeRequest.orientations)
        const orientation = orientations.length === 1 && ['nord', 'sud', 'est', 'ouest'].includes(orientations[0])
          ? orientations[0] as 'nord' | 'sud' | 'est' | 'ouest'
          : 'multi' as const
        const placeId = randomUUID()
        await tx.insert(falaises).values({
          id: placeId,
          nom: placeRequest.name,
          location: placeRequest.city,
          department: placeRequest.department,
          region: placeRequest.region,
          acces: placeRequest.access,
          disciplines: parseStringArray(placeRequest.disciplines),
          rockType: placeRequest.rockType,
          rainExposure: placeRequest.rainExposure,
          sunlight: placeRequest.sunlight,
          photoUrl: placeRequest.photoMediaId ? `/api/place-media/${placeRequest.photoMediaId}` : null,
          latitude: placeRequest.latitude,
          longitude: placeRequest.longitude,
          orientation,
          orientations,
          approche: placeRequest.approach,
          parking: placeRequest.parking,
          parkingLatitude: placeRequest.parkingLatitude,
          parkingLongitude: placeRequest.parkingLongitude,
          saison: parseStringArray(placeRequest.seasons),
          restrictions: placeRequest.restrictions,
          sourceUrl: placeRequest.sourceUrl,
          notes: placeRequest.notes,
        })
        if (placeRequest.photoMediaId) await tx.insert(placePhotos).values({ falaiseId: placeId, mediaId: placeRequest.photoMediaId })
      }
    }

    await tx.update(placeCreationRequests).set({
      status: review.decision === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date(),
      reviewedBy: actor.id,
      reviewReason: review.reason || null,
    }).where(eq(placeCreationRequests.id, requestId))
    await tx.insert(adminAuditLogs).values({
      actorId: actor.id,
      action: review.decision === 'approve' ? 'place_approved' : 'place_rejected',
      targetId: requestId,
      reason: review.reason || `Lieu validé : ${placeRequest.name}`,
    })
  })
}

export async function reviewPlaceChangeRequest(requestId: string, input: unknown) {
  await requireAdmin()
  const session = await getSessionFromCookies()
  if (!session) throw new AdminError('Connexion requise.', 401)
  const review = placeReviewSchema.parse(input)

  await db.transaction(async (tx) => {
    const [actor] = await tx.select({ id: users.id, isAdmin: users.isAdmin, isSuspended: users.isSuspended, version: users.sessionVersion })
      .from(users).where(eq(users.id, session.sub)).limit(1).for('update')
    if (!actor?.isAdmin || actor.isSuspended || actor.version !== session.ver) throw new AdminError('Accès administrateur requis.', 403)

    const [request] = await tx.select().from(placeChangeRequests).where(eq(placeChangeRequests.id, requestId)).limit(1).for('update')
    if (!request) throw new AdminError('Demande de modification introuvable.', 404)
    if (request.status !== 'pending') throw new AdminError('Cette demande a déjà été traitée.', 409)
    const placeId = request.kind === 'salle' ? request.salleId : request.falaiseId
    if (!placeId) throw new AdminError('Le lieu concerné est introuvable.', 404)
    const photos = await tx.select({ mediaId: placeChangeRequestPhotos.mediaId }).from(placeChangeRequestPhotos)
      .where(eq(placeChangeRequestPhotos.requestId, request.id))
    const parsed = placeChangeInputSchema.safeParse({
      ...parseStoredObject(request.values),
      kind: request.kind,
      placeId,
      message: request.message ?? '',
      photoMediaIds: photos.map((photo) => photo.mediaId),
    })
    if (!parsed.success) throw new AdminError('Les données de cette demande sont invalides.', 409)

    if (review.decision === 'approve') {
      if (parsed.data.kind === 'salle') {
        const [place] = await tx.select({ id: salles.id }).from(salles).where(eq(salles.id, placeId)).limit(1).for('update')
        if (!place) throw new AdminError('Cette salle n’existe plus.', 404)
        await tx.update(salles).set({
          nom: parsed.data.name,
          location: parsed.data.city,
          department: nullableValue(parsed.data.department),
          region: nullableValue(parsed.data.region),
          adresse: parsed.data.address,
          disciplines: parsed.data.disciplines,
          latitude: parsed.data.latitude,
          longitude: parsed.data.longitude,
          services: parsed.data.services,
          siteWeb: nullableValue(parsed.data.website),
          horaires: { semaine: parsed.data.weekdayHours, weekEnd: parsed.data.weekendHours },
          tarifs: { entree: parsed.data.entryPrice, abonnement: parsed.data.subscriptionPrice },
          niveauMin: nullableValue(parsed.data.minimumLevel),
          niveauMax: nullableValue(parsed.data.maximumLevel),
          frequentation: parsed.data.attendance || null,
          restrictions: nullableValue(parsed.data.restrictions),
          sourceUrl: nullableValue(parsed.data.sourceUrl),
          notes: nullableValue(parsed.data.notes),
        }).where(eq(salles.id, placeId))
        if (photos.length) await tx.insert(placePhotos).values(photos.map(({ mediaId }) => ({ salleId: placeId, mediaId })))
      } else {
        const [place] = await tx.select({ id: falaises.id }).from(falaises).where(eq(falaises.id, placeId)).limit(1).for('update')
        if (!place) throw new AdminError('Cette falaise n’existe plus.', 404)
        await tx.update(falaises).set({
          nom: parsed.data.name,
          location: parsed.data.city,
          department: nullableValue(parsed.data.department),
          region: nullableValue(parsed.data.region),
          acces: nullableValue(parsed.data.access),
          disciplines: parsed.data.disciplines,
          rockType: parsed.data.rockType || null,
          rainExposure: parsed.data.rainExposure || null,
          sunlight: parsed.data.sunlight || null,
          niveaux: levelList(parsed.data.levels),
          latitude: parsed.data.latitude,
          longitude: parsed.data.longitude,
          orientation: parsed.data.orientation || null,
          orientations: parsed.data.orientations,
          approche: nullableValue(parsed.data.approach),
          parking: nullableValue(parsed.data.parking),
          parkingLatitude: parsed.data.parkingLatitude,
          parkingLongitude: parsed.data.parkingLongitude,
          saison: parsed.data.seasons,
          status: parsed.data.status || null,
          restrictions: nullableValue(parsed.data.restrictions),
          sourceUrl: nullableValue(parsed.data.sourceUrl),
          notes: nullableValue(parsed.data.notes),
        }).where(eq(falaises.id, placeId))
        if (photos.length) await tx.insert(placePhotos).values(photos.map(({ mediaId }) => ({ falaiseId: placeId, mediaId })))
      }
    }

    await tx.update(placeChangeRequests).set({
      status: review.decision === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date(),
      reviewedBy: actor.id,
      reviewReason: review.reason || null,
    }).where(eq(placeChangeRequests.id, requestId))
    await tx.insert(adminAuditLogs).values({
      actorId: actor.id,
      action: review.decision === 'approve' ? 'place_change_approved' : 'place_change_rejected',
      targetId: requestId,
      reason: review.reason || `Contribution validée : ${parsed.data.name}`,
    })
  })
}

export async function listAdminHistory(page: number) {
  await requireAdmin()
  const [rows, total] = await Promise.all([
    db.select({ id: adminAuditLogs.id, actor: users.email, action: adminAuditLogs.action, targetId: adminAuditLogs.targetId, reason: adminAuditLogs.reason, createdAt: adminAuditLogs.createdAt }).from(adminAuditLogs).leftJoin(users, eq(users.id, adminAuditLogs.actorId)).orderBy(desc(adminAuditLogs.createdAt), desc(adminAuditLogs.id)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
    db.select({ value: count() }).from(adminAuditLogs),
  ])
  return { rows, total: total[0].value }
}

export async function moderate(target: ModerationTarget, input: unknown) {
  await requireAdmin()
  const session = await getSessionFromCookies()
  if (!session) throw new AdminError('Connexion requise.', 401)
  const { state, reason } = moderationSchema.parse(input)
  await db.transaction(async (tx) => {
    const [actor] = await tx.select({ id: users.id, isAdmin: users.isAdmin, isSuspended: users.isSuspended, version: users.sessionVersion }).from(users).where(eq(users.id, session.sub)).limit(1).for('update')
    if (!actor?.isAdmin || actor.isSuspended || actor.version !== session.ver) throw new AdminError('Accès administrateur requis.', 403)
    let action: typeof adminAuditLogs.$inferInsert.action
    if (target.kind === 'users') {
      const [account] = await tx.select({ id: users.id, isAdmin: users.isAdmin, isSuspended: users.isSuspended }).from(users).where(eq(users.id, target.id)).limit(1).for('update')
      if (!account) throw new AdminError('Compte introuvable.', 404)
      if (account.id === actor.id || account.isAdmin) throw new AdminError('Les comptes administrateurs sont protégés.', 409)
      if (account.isSuspended === state) return
      await tx.update(users).set({ isSuspended: state, sessionVersion: sql`${users.sessionVersion} + 1` }).where(eq(users.id, account.id))
      action = state ? 'user_suspended' : 'user_restored'
    } else {
      const [post] = await tx.select({ id: posts.id, isHidden: posts.isHidden }).from(posts).where(eq(posts.id, target.id)).limit(1).for('update')
      if (!post) throw new AdminError('Publication introuvable.', 404)
      if (post.isHidden === state) return
      await tx.update(posts).set({ isHidden: state }).where(eq(posts.id, post.id))
      action = state ? 'post_hidden' : 'post_restored'
    }
    await tx.insert(adminAuditLogs).values({ actorId: actor.id, action, targetId: target.id, reason })
  })
}
