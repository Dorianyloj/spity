import { and, count, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { clubProfiles, grimpeurProfiles, medias, posts, userEquipment, users } from '@/db/schema'
import { availabilitySlotSchema, partnerSearchSchema, type GrimpeurProfile, type UserEquipment } from '../schemas'

export type SharedEquipment = Omit<UserEquipment, 'userId' | 'notes' | 'availableForPartner'>
export const PROFILE_POST_PAGE_SIZE = 12

export type PublicProfilePost = {
  id: string
  content: string
  cotation: string | null
  imageUrl: string | null
  createdAt: string
}

export type PublicProfile = {
  userId: string
  role: 'grimpeur' | 'club'
  displayName: string
  avatarUrl: string | null
  bio: string | null
  location: string | null
  createdAt: Date
  disciplines: string[]
  niveaux: Record<string, string>
  climbingEnvironment: 'indoor' | 'outdoor' | 'mixed' | null
  goals: string[]
  karma: number
  ffmeNum: string | null
  posts: PublicProfilePost[]
  postCount: number
  page: number
  pageCount: number
  availability: GrimpeurProfile['availability']
  partnerSearch: GrimpeurProfile['partnerSearch'] | null
  sharedEquipment: SharedEquipment[]
}

const toImageSource = (value: string | null) => {
  if (!value) {
    return null
  }

  try {
    const url = new URL(value)

    return url.pathname.startsWith('/images/')
      ? `${url.pathname}${url.search}`
      : value
  } catch {
    return value.startsWith('/') ? value : null
  }
}

const storedJson = (value: unknown): unknown => {
  if (typeof value !== 'string') return value
  try { return JSON.parse(value) as unknown } catch { return null }
}
const parseStringArray = (input: unknown) => {
  const value = storedJson(input)
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

const parseStringRecord = (input: unknown) => {
  const value = storedJson(input)
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  )
}

export const findPublicProfileByUserId = async (userId: string, requestedPage = 1): Promise<PublicProfile | null> => {
  const [row] = await db
    .select({
      userId: users.id,
      role: users.role,
      avatarUrl: users.avatarUrl,
      createdAt: users.createdAt,
      climberId: grimpeurProfiles.id,
      climberName: grimpeurProfiles.displayName,
      climberBio: grimpeurProfiles.bio,
      climberLocation: grimpeurProfiles.location,
      climbingEnvironment: grimpeurProfiles.climbingEnvironment,
      disciplines: grimpeurProfiles.disciplines,
      niveaux: grimpeurProfiles.niveaux,
      goals: grimpeurProfiles.goals,
      availability: grimpeurProfiles.availability,
      partnerSearch: grimpeurProfiles.partnerSearch,
      karma: grimpeurProfiles.karma,
      clubId: clubProfiles.id,
      clubName: clubProfiles.nom,
      clubBio: clubProfiles.bio,
      clubLocation: clubProfiles.location,
      ffmeNum: clubProfiles.ffmeNum,
    })
    .from(users)
    .leftJoin(grimpeurProfiles, eq(grimpeurProfiles.userId, users.id))
    .leftJoin(clubProfiles, eq(clubProfiles.userId, users.id))
    .where(and(eq(users.id, userId), eq(users.isSuspended, false)))
    .limit(1)

  if (!row || (!row.climberId && !row.clubId)) {
    return null
  }

  const [totals] = await db.select({ total: count() }).from(posts).where(and(eq(posts.authorId, userId), eq(posts.isHidden, false)))
  const postCount = Number(totals.total)
  const pageCount = Math.max(1, Math.ceil(postCount / PROFILE_POST_PAGE_SIZE))
  const page = Math.min(pageCount, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1))
  const postRows = await db
    .select({
      id: posts.id,
      content: posts.contenu,
      cotation: posts.cotation,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(and(eq(posts.authorId, userId), eq(posts.isHidden, false)))
    .orderBy(desc(posts.createdAt), desc(posts.id))
    .limit(PROFILE_POST_PAGE_SIZE)
    .offset((page - 1) * PROFILE_POST_PAGE_SIZE)

  const postIds = postRows.map((post) => post.id)
  const mediaRows = postIds.length > 0
    ? await db
      .select({ postId: medias.postId, url: medias.url })
      .from(medias)
      .where(inArray(medias.postId, postIds))
    : []
  const mediaByPost = new Map<string, string>()

  for (const media of mediaRows) {
    const source = toImageSource(media.url)

    if (source && !mediaByPost.has(media.postId)) {
      mediaByPost.set(media.postId, source)
    }
  }

  const isClimber = row.role === 'grimpeur' && row.climberId !== null
  const partner = partnerSearchSchema.safeParse(storedJson(row.partnerSearch))
  const partnerSearch = isClimber && partner.success ? partner.data : null
  // Do not even select personal notes or private equipment for the member DTO.
  const sharedEquipment = isClimber && partnerSearch?.shareEquipment === true ? await db.select({
    id: userEquipment.id, category: userEquipment.category, quantity: userEquipment.quantity,
    brand: userEquipment.brand, model: userEquipment.model, color: userEquipment.color, size: userEquipment.size,
    lengthMeters: userEquipment.lengthMeters, diameterMm: userEquipment.diameterMm, condition: userEquipment.condition,
  }).from(userEquipment).where(and(eq(userEquipment.userId, userId), eq(userEquipment.availableForPartner, true))) : []

  return {
    userId: row.userId,
    role: isClimber ? 'grimpeur' : 'club',
    displayName: isClimber
      ? row.climberName ?? 'Grimpeur Spity'
      : row.clubName ?? 'Club Spity',
    avatarUrl: toImageSource(row.avatarUrl),
    bio: isClimber ? row.climberBio : row.clubBio,
    location: isClimber ? row.climberLocation : row.clubLocation,
    createdAt: row.createdAt,
    disciplines: isClimber ? parseStringArray(row.disciplines) : [],
    niveaux: isClimber ? parseStringRecord(row.niveaux) : {},
    climbingEnvironment: isClimber ? row.climbingEnvironment : null,
    goals: isClimber ? parseStringArray(row.goals) : [],
    karma: isClimber ? row.karma ?? 0 : 0,
    ffmeNum: isClimber ? null : row.ffmeNum,
    postCount, page, pageCount, sharedEquipment, partnerSearch,
    availability: isClimber ? parseStringArray(row.availability).flatMap((value) => { const slot = availabilitySlotSchema.safeParse(value); return slot.success ? [slot.data] : [] }) : [],
    posts: postRows.map((post) => ({
      id: post.id,
      content: post.content ?? 'Publication sans texte',
      cotation: post.cotation,
      imageUrl: mediaByPost.get(post.id) ?? null,
      createdAt: post.createdAt.toISOString(),
    })),
  }
}
