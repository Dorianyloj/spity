import { randomUUID } from 'crypto'
import { db } from '@/db'
import { placeCreationRequests } from '@/db/schema'
import type { PlaceCreationInput } from '../schemas'

const nullable = <Value extends string>(value: Value): Value | null => value || null

export const createPlaceRequest = async (authorId: string, input: PlaceCreationInput) => {
  const id = randomUUID()
  const values: typeof placeCreationRequests.$inferInsert = {
    id,
    authorId,
    kind: input.kind,
    name: input.name,
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
    restrictions: input.kind === 'falaise' ? nullable(input.restrictions) : null,
    sourceUrl: nullable(input.sourceUrl),
    notes: nullable(input.notes),
  }

  await db.insert(placeCreationRequests).values(values)

  return { id, status: 'pending' as const }
}
