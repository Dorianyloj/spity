import { randomUUID } from 'crypto'
import { and, asc, eq, gte, inArray, or } from 'drizzle-orm'
import { db } from '@/db'
import { clubProfiles, eventRegistrations, events, grimpeurProfiles, users } from '@/db/schema'
import { eventSchema, type CreateEventBody, type SpityEvent, type UpdateEventBody } from '../schemas'
import { canRegisterForEvent, validateEventCapacity, validateEventTiming } from './event-rules'

type EventRow = typeof events.$inferSelect

export class EventOperationError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = 'EventOperationError'
  }
}

const findEventRow = async (eventId: string) => {
  const [row] = await db
    .select({ event: events, clubName: clubProfiles.nom })
    .from(events)
    .innerJoin(clubProfiles, eq(clubProfiles.id, events.clubId))
    .where(eq(events.id, eventId))
    .limit(1)

  return row ?? null
}

const serializeEventRows = async (
  rows: Array<{ event: EventRow; clubName: string }>,
  viewerId: string,
  viewerClubId: string | null
) => {
  const eventIds = rows.map((row) => row.event.id)

  if (eventIds.length === 0) {
    return []
  }

  const registrationRows = await db
    .select({
      eventId: eventRegistrations.eventId,
      userId: eventRegistrations.userId,
      displayName: grimpeurProfiles.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(eventRegistrations)
    .innerJoin(users, eq(users.id, eventRegistrations.userId))
    .innerJoin(grimpeurProfiles, eq(grimpeurProfiles.userId, eventRegistrations.userId))
    .where(and(
      inArray(eventRegistrations.eventId, eventIds),
      eq(eventRegistrations.status, 'active')
    ))

  return rows.map(({ event, clubName }) => {
    const registrations = registrationRows.filter((registration) => registration.eventId === event.id)
    const isOwner = event.clubId === viewerClubId

    return eventSchema.parse({
      id: event.id,
      clubId: event.clubId,
      clubName,
      title: event.titre,
      type: event.type,
      description: event.description,
      location: event.location,
      startsAt: event.debut.toISOString(),
      endsAt: event.fin?.toISOString() ?? null,
      capacity: event.capacite,
      status: event.status,
      registeredCount: registrations.length,
      remainingCapacity: Math.max(0, event.capacite - registrations.length),
      isRegistered: registrations.some((registration) => registration.userId === viewerId),
      isOwner,
      participants: isOwner
        ? registrations.map((registration) => ({
            userId: registration.userId,
            displayName: registration.displayName ?? 'Grimpeur Spity',
            avatarUrl: registration.avatarUrl,
          }))
        : [],
    })
  })
}

export const listEventsForViewer = async (viewerId: string, viewerClubId: string | null) => {
  const now = new Date()
  const publicCondition = and(eq(events.status, 'scheduled'), gte(events.debut, now))
  const condition = viewerClubId
    ? or(publicCondition, eq(events.clubId, viewerClubId))
    : publicCondition
  const rows = await db
    .select({ event: events, clubName: clubProfiles.nom })
    .from(events)
    .innerJoin(clubProfiles, eq(clubProfiles.id, events.clubId))
    .where(condition)
    .orderBy(asc(events.debut))
    .limit(100)

  return serializeEventRows(rows, viewerId, viewerClubId)
}

export const findEventForViewer = async (eventId: string, viewerId: string, viewerClubId: string | null) => {
  const row = await findEventRow(eventId)

  if (!row) {
    return null
  }

  const [event] = await serializeEventRows([row], viewerId, viewerClubId)

  return event ?? null
}

export const createEvent = async (clubId: string, values: CreateEventBody) => {
  const timingError = validateEventTiming({
    startsAt: new Date(values.startsAt),
    endsAt: values.endsAt ? new Date(values.endsAt) : null,
  })

  if (timingError) {
    throw new EventOperationError(timingError, 422)
  }

  const eventId = randomUUID()

  await db.insert(events).values({
    id: eventId,
    clubId,
    titre: values.title,
    type: values.type,
    description: values.description,
    location: values.location,
    debut: new Date(values.startsAt),
    fin: values.endsAt ? new Date(values.endsAt) : null,
    capacite: values.capacity,
  })

  return eventId
}

export const updateEvent = async (eventId: string, clubId: string, values: UpdateEventBody) => {
  await db.transaction(async (transaction) => {
    const [existing] = await transaction
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .for('update')
      .limit(1)

    if (!existing) {
      throw new EventOperationError('Événement introuvable', 404)
    }

    if (existing.clubId !== clubId) {
      throw new EventOperationError('Vous ne pouvez modifier que les événements de votre club', 403)
    }

    const registrations = await transaction
      .select({ id: eventRegistrations.id })
      .from(eventRegistrations)
      .where(and(
        eq(eventRegistrations.eventId, eventId),
        eq(eventRegistrations.status, 'active')
      ))
    const capacity = values.capacity ?? existing.capacite
    const capacityError = validateEventCapacity(capacity, registrations.length)

    if (capacityError) {
      throw new EventOperationError(capacityError, 409)
    }

    const startsAt = values.startsAt ? new Date(values.startsAt) : existing.debut
    const endsAt = values.endsAt === undefined
      ? existing.fin
      : values.endsAt ? new Date(values.endsAt) : null

    if (values.status !== 'cancelled') {
      const timingError = validateEventTiming({ startsAt, endsAt })

      if (timingError) {
        throw new EventOperationError(timingError, 422)
      }
    }

    await transaction
      .update(events)
      .set({
        titre: values.title,
        type: values.type,
        description: values.description,
        location: values.location,
        debut: values.startsAt ? startsAt : undefined,
        fin: values.endsAt !== undefined ? endsAt : undefined,
        capacite: values.capacity,
        status: values.status,
      })
      .where(eq(events.id, eventId))
  })
}

export const registerForEvent = async (eventId: string, userId: string) => {
  await db.transaction(async (transaction) => {
    const [event] = await transaction
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .for('update')
      .limit(1)

    if (!event) {
      throw new EventOperationError('Événement introuvable', 404)
    }

    const registrations = await transaction
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.eventId, eventId))
    const activeRegistrations = registrations.filter((registration) => registration.status === 'active')
    const existingRegistration = registrations.find((registration) => registration.userId === userId)

    if (existingRegistration?.status === 'active') {
      throw new EventOperationError('Vous êtes déjà inscrit à cet événement', 409)
    }

    const registrationError = canRegisterForEvent({
      status: event.status,
      startsAt: event.debut,
      capacity: event.capacite,
      registeredCount: activeRegistrations.length,
    })

    if (registrationError) {
      throw new EventOperationError(registrationError, 409)
    }

    if (existingRegistration) {
      await transaction
        .update(eventRegistrations)
        .set({ status: 'active' })
        .where(eq(eventRegistrations.id, existingRegistration.id))
    } else {
      await transaction.insert(eventRegistrations).values({
        id: randomUUID(),
        eventId,
        userId,
      })
    }
  })
}

export const cancelEventRegistration = async (eventId: string, userId: string) => {
  const [registration] = await db
    .select()
    .from(eventRegistrations)
    .where(and(
      eq(eventRegistrations.eventId, eventId),
      eq(eventRegistrations.userId, userId),
      eq(eventRegistrations.status, 'active')
    ))
    .limit(1)

  if (!registration) {
    throw new EventOperationError('Inscription active introuvable', 404)
  }

  await db
    .update(eventRegistrations)
    .set({ status: 'cancelled' })
    .where(eq(eventRegistrations.id, registration.id))
}

export const assertEventOwner = async (eventId: string, clubId: string) => {
  const row = await findEventRow(eventId)

  if (!row) {
    throw new EventOperationError('Événement introuvable', 404)
  }

  if (row.event.clubId !== clubId) {
    throw new EventOperationError('Vous ne pouvez modifier que les événements de votre club', 403)
  }

  return row
}

export const toEventResponse = async (
  eventId: string,
  viewerId: string,
  viewerClubId: string | null
): Promise<SpityEvent> => {
  const event = await findEventForViewer(eventId, viewerId, viewerClubId)

  if (!event) {
    throw new EventOperationError('Événement introuvable', 404)
  }

  return event
}
