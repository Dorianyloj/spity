import { desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { clubProfiles, grimpeurProfiles, medias, posts, users } from '@/db/schema'

export type PublicProfilePost = {
  id: string
  content: string
  cotation: string | null
  imageUrl: string | null
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

const parseStringArray = (value: unknown) => {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : []
}

const parseStringRecord = (value: unknown) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
  )
}

export const findPublicProfileByUserId = async (userId: string): Promise<PublicProfile | null> => {
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
    .where(eq(users.id, userId))
    .limit(1)

  if (!row || (!row.climberId && !row.clubId)) {
    return null
  }

  const postRows = await db
    .select({
      id: posts.id,
      content: posts.contenu,
      cotation: posts.cotation,
    })
    .from(posts)
    .where(eq(posts.authorId, userId))
    .orderBy(desc(posts.createdAt))
    .limit(30)

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
    posts: postRows.map((post) => ({
      id: post.id,
      content: post.content ?? 'Publication sans texte',
      cotation: post.cotation,
      imageUrl: mediaByPost.get(post.id) ?? null,
    })),
  }
}
