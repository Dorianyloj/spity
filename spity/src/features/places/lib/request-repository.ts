import { randomUUID } from 'crypto'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { falaises, mediaUploads, placeChangeRequestPhotos, placeChangeRequests, placeCreationRequests, placeReports, salles, voies } from '@/db/schema'
import { ProfileOperationError } from '@/features/profile/lib/http'
import { formatConditionReport } from './crag-reports'
import type { CragReportInput, CragRouteInput, PlaceChangeInput, PlaceCreationInput } from '../schemas'

const nullable = <Value extends string>(value: Value): Value | null => value || null

export const createPlaceRequest = async (authorId: string, input: PlaceCreationInput) => {
  const id = randomUUID()
  const values: typeof placeCreationRequests.$inferInsert = {
    id,
    authorId,
    kind: input.kind,
    name: input.name,
    photoMediaId: input.photoMediaId,
    disciplines: input.disciplines,
    latitude: input.latitude,
    longitude: input.longitude,
    city: input.city,
    department: input.department,
    region: input.region,
    address: nullable(input.address),
    rockType: input.kind === 'falaise' ? input.rockType || null : null,
    rainExposure: input.kind === 'falaise' ? input.rainExposure || null : null,
    sunlight: input.kind === 'falaise' ? input.sunlight || null : null,
    seasons: input.kind === 'falaise' ? input.seasons : [],
    orientations: input.kind === 'falaise' ? input.orientations : [],
    services: input.kind === 'salle' ? input.services : [],
    website: input.kind === 'salle' ? nullable(input.website) : null,
    access: input.kind === 'falaise' ? nullable(input.access) : null,
    approach: input.kind === 'falaise' ? nullable(input.approach) : null,
    parking: input.kind === 'falaise' ? nullable(input.parking) : null,
    parkingLatitude: input.kind === 'falaise' ? input.parkingLatitude : null,
    parkingLongitude: input.kind === 'falaise' ? input.parkingLongitude : null,
    restrictions: input.kind === 'falaise' ? nullable(input.restrictions) : null,
    sourceUrl: nullable(input.sourceUrl),
    notes: nullable(input.notes),
  }

  await db.transaction(async (tx) => {
    if (input.photoMediaId) {
      const [photo] = await tx.select({ id: mediaUploads.id }).from(mediaUploads)
        .where(and(eq(mediaUploads.id, input.photoMediaId), eq(mediaUploads.ownerId, authorId)))
        .limit(1)
        .for('update')
      if (!photo) throw new ProfileOperationError('Cette photo est introuvable ou ne t’appartient pas.', 404)
    }
    await tx.insert(placeCreationRequests).values(values)
  })

  return { id, status: 'pending' as const }
}

export const createPlaceChangeRequest = async (authorId: string, input: PlaceChangeInput) => {
  const id = randomUUID()
  const { kind, message, photoMediaIds, placeId, ...values } = input

  await db.transaction(async (tx) => {
    const target = kind === 'salle'
      ? await tx.select({ id: salles.id }).from(salles).where(eq(salles.id, placeId)).limit(1).for('update')
      : await tx.select({ id: falaises.id }).from(falaises).where(eq(falaises.id, placeId)).limit(1).for('update')
    if (!target[0]) throw new ProfileOperationError('Ce lieu n’existe plus.', 404)

    if (photoMediaIds.length) {
      const photos = await tx.select({ id: mediaUploads.id }).from(mediaUploads)
        .where(and(eq(mediaUploads.ownerId, authorId), inArray(mediaUploads.id, photoMediaIds)))
        .for('update')
      if (photos.length !== photoMediaIds.length) {
        throw new ProfileOperationError('Une ou plusieurs photos sont introuvables ou ne t’appartiennent pas.', 404)
      }
    }

    await tx.insert(placeChangeRequests).values({
      id,
      authorId,
      kind,
      salleId: kind === 'salle' ? placeId : null,
      falaiseId: kind === 'falaise' ? placeId : null,
      values: values as Record<string, unknown>,
      message: nullable(message),
    })
    if (photoMediaIds.length) {
      await tx.insert(placeChangeRequestPhotos).values(photoMediaIds.map((mediaId) => ({ requestId: id, mediaId })))
    }
  })

  return { id, status: 'pending' as const }
}

export const createCragRoute = async (authorId: string, input: CragRouteInput) => {
  const id = randomUUID()

  await db.transaction(async (tx) => {
    const [crag] = await tx.select({ id: falaises.id }).from(falaises)
      .where(eq(falaises.id, input.falaiseId)).limit(1).for('update')
    if (!crag) throw new ProfileOperationError('Cette falaise n’existe plus.', 404)

    const [existingRoute] = await tx.select({ id: voies.id }).from(voies)
      .where(and(eq(voies.falaiseId, input.falaiseId), eq(voies.nom, input.nom))).limit(1).for('update')
    if (existingRoute) throw new ProfileOperationError('Une voie porte déjà ce nom sur cette falaise.', 409)

    await tx.insert(voies).values({
      id,
      falaiseId: input.falaiseId,
      nom: input.nom,
      cotation: input.cotation,
      secteur: nullable(input.secteur),
      hauteur: input.hauteur,
      degaines: input.degaines,
      style: input.style || null,
      status: input.status,
      etatVotes: {},
    })
  })

  return { id }
}

export const createCragReport = async (authorId: string, input: CragReportInput) => {
  const id = randomUUID()

  await db.transaction(async (tx) => {
    const [crag] = await tx.select({ id: falaises.id }).from(falaises)
      .where(eq(falaises.id, input.falaiseId)).limit(1).for('update')
    if (!crag) throw new ProfileOperationError('Cette falaise n’existe plus.', 404)

    await tx.insert(placeReports).values({
      id,
      falaiseId: input.falaiseId,
      authorId,
      type: input.type,
      status: 'open',
      message: input.type === 'condition' ? formatConditionReport(input) : input.message,
    })
  })

  return { id }
}
