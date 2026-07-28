import { randomUUID } from 'crypto'
import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import {
  clubProfiles,
  comments,
  falaises,
  grimpeurProfiles,
  likes,
  medias,
  posts,
  salles,
  users,
} from '@/db/schema'
import {
  feedCommentSchema,
  feedPostSchema,
  type FeedComment,
  type FeedPost,
  type PostLike,
} from '../schemas'

export class FeedOperationError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
  }
}

const formatFeedDate = (date: Date) => {
  const elapsedMinutes = Math.floor((Date.now() - date.getTime()) / 60_000)

  if (elapsedMinutes < 1) return 'À l’instant'
  if (elapsedMinutes < 60) return `Il y a ${elapsedMinutes} min`

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `Il y a ${elapsedHours} h`
  if (elapsedHours < 48) return 'Hier'

  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date)
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
    return value
  }
}

type CommentRow = {
  comment: typeof comments.$inferSelect
  authorEmail: string
  avatarUrl: string | null
  climberName: string | null
  clubName: string | null
}

const toFeedComment = (row: CommentRow, viewerId: string): FeedComment => {
  const author = row.climberName ?? row.clubName ?? row.authorEmail.split('@')[0]

  return feedCommentSchema.parse({
    id: row.comment.id,
    postId: row.comment.postId,
    content: row.comment.contenu,
    author: { userId: row.comment.authorId, name: author, avatarUrl: toImageSource(row.avatarUrl) },
    meta: formatFeedDate(row.comment.createdAt),
    isAuthor: row.comment.authorId === viewerId,
    isEdited: row.comment.updatedAt.getTime() !== row.comment.createdAt.getTime(),
  })
}

const findCommentForViewer = async (commentId: string, viewerId: string) => {
  const [row] = await db
    .select({
      comment: comments,
      authorEmail: users.email,
      avatarUrl: users.avatarUrl,
      climberName: grimpeurProfiles.displayName,
      clubName: clubProfiles.nom,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.authorId))
    .leftJoin(grimpeurProfiles, eq(grimpeurProfiles.userId, comments.authorId))
    .leftJoin(clubProfiles, eq(clubProfiles.userId, comments.authorId))
    .where(eq(comments.id, commentId))
    .limit(1)

  return row ? toFeedComment(row, viewerId) : null
}

export const listFeedPosts = async (viewerId: string): Promise<FeedPost[]> => {
  const rows = await db
    .select({
      post: posts,
      authorEmail: users.email,
      avatarUrl: users.avatarUrl,
      climberName: grimpeurProfiles.displayName,
      clubName: clubProfiles.nom,
      salleName: salles.nom,
      falaiseName: falaises.nom,
    })
    .from(posts)
    .innerJoin(users, eq(users.id, posts.authorId))
    .leftJoin(grimpeurProfiles, eq(grimpeurProfiles.userId, posts.authorId))
    .leftJoin(clubProfiles, eq(clubProfiles.id, posts.clubId))
    .leftJoin(salles, eq(salles.id, posts.salleId))
    .leftJoin(falaises, eq(falaises.id, posts.falaiseId))
    .orderBy(desc(posts.createdAt))
    .limit(50)

  const postIds = rows.map((row) => row.post.id)

  if (postIds.length === 0) {
    return []
  }

  const [mediaRows, likeRows, commentRows] = await Promise.all([
    db.select({ postId: medias.postId, url: medias.url }).from(medias).where(inArray(medias.postId, postIds)),
    db.select({ postId: likes.postId, userId: likes.userId }).from(likes).where(inArray(likes.postId, postIds)),
    db
      .select({
        comment: comments,
        authorEmail: users.email,
        avatarUrl: users.avatarUrl,
        climberName: grimpeurProfiles.displayName,
        clubName: clubProfiles.nom,
      })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.authorId))
      .leftJoin(grimpeurProfiles, eq(grimpeurProfiles.userId, comments.authorId))
      .leftJoin(clubProfiles, eq(clubProfiles.userId, comments.authorId))
      .where(inArray(comments.postId, postIds))
      .orderBy(asc(comments.createdAt)),
  ])

  const mediaByPost = new Map<string, string>()
  const likeCounts = new Map<string, number>()
  const commentsByPost = new Map<string, FeedComment[]>()
  const likedPostIds = new Set<string>()

  for (const media of mediaRows) {
    const imageSource = toImageSource(media.url)

    if (imageSource && !mediaByPost.has(media.postId)) {
      mediaByPost.set(media.postId, imageSource)
    }
  }

  for (const like of likeRows) {
    likeCounts.set(like.postId, (likeCounts.get(like.postId) ?? 0) + 1)
    if (like.userId === viewerId) {
      likedPostIds.add(like.postId)
    }
  }

  for (const comment of commentRows) {
    const postComments = commentsByPost.get(comment.comment.postId) ?? []
    postComments.push(toFeedComment(comment, viewerId))
    commentsByPost.set(comment.comment.postId, postComments)
  }

  return rows.map((row) => {
    const location = row.salleName ?? row.falaiseName ?? row.clubName ?? 'Communauté Spity'
    const author = row.climberName ?? row.clubName ?? row.authorEmail.split('@')[0]
    const tag = row.post.clubId ? 'Événement' : row.post.isStory ? 'Topo' : 'Session'

    return feedPostSchema.parse({
      id: row.post.id,
      author: { userId: row.post.authorId, name: author, avatarUrl: toImageSource(row.avatarUrl) },
      context: [location, row.post.cotation].filter(Boolean).join(' · '),
      content: row.post.contenu ?? 'Publication sans texte',
      tag,
      meta: formatFeedDate(row.post.createdAt),
      imageUrl: mediaByPost.get(row.post.id) ?? null,
      likeCount: likeCounts.get(row.post.id) ?? 0,
      commentCount: commentsByPost.get(row.post.id)?.length ?? 0,
      comments: commentsByPost.get(row.post.id) ?? [],
      likedByViewer: likedPostIds.has(row.post.id),
    })
  })
}

export const setPostLike = async (postId: string, userId: string, liked: boolean): Promise<PostLike> => {
  return db.transaction(async (transaction) => {
    const [post] = await transaction
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1)

    if (!post) {
      throw new FeedOperationError('Publication introuvable', 404)
    }

    const condition = and(eq(likes.postId, postId), eq(likes.userId, userId))
    const [existingLike] = await transaction
      .select({ id: likes.id })
      .from(likes)
      .where(condition)
      .limit(1)

    if (liked && !existingLike) {
      await transaction.insert(likes).values({
        id: randomUUID(),
        postId,
        userId,
      })
    }

    if (!liked && existingLike) {
      await transaction.delete(likes).where(eq(likes.id, existingLike.id))
    }

    const postLikes = await transaction
      .select({ id: likes.id })
      .from(likes)
      .where(eq(likes.postId, postId))

    return { postId, liked, likeCount: postLikes.length }
  })
}

export const createPostComment = async (postId: string, userId: string, content: string) => {
  const [post] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1)

  if (!post) {
    throw new FeedOperationError('Publication introuvable', 404)
  }

  const commentId = randomUUID()
  await db.insert(comments).values({
    id: commentId,
    postId,
    authorId: userId,
    contenu: content,
  })

  const comment = await findCommentForViewer(commentId, userId)

  if (!comment) {
    throw new FeedOperationError('Commentaire introuvable', 404)
  }

  return comment
}

export const updatePostComment = async (
  postId: string,
  commentId: string,
  userId: string,
  content: string
) => {
  const [comment] = await db
    .select()
    .from(comments)
    .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
    .limit(1)

  if (!comment) {
    throw new FeedOperationError('Commentaire introuvable', 404)
  }

  if (comment.authorId !== userId) {
    throw new FeedOperationError('Vous ne pouvez modifier que vos commentaires', 403)
  }

  await db
    .update(comments)
    .set({ contenu: content })
    .where(eq(comments.id, commentId))

  const updatedComment = await findCommentForViewer(commentId, userId)

  if (!updatedComment) {
    throw new FeedOperationError('Commentaire introuvable', 404)
  }

  return updatedComment
}

export const deletePostComment = async (postId: string, commentId: string, userId: string) => {
  const [comment] = await db
    .select()
    .from(comments)
    .where(and(eq(comments.id, commentId), eq(comments.postId, postId)))
    .limit(1)

  if (!comment) {
    throw new FeedOperationError('Commentaire introuvable', 404)
  }

  if (comment.authorId !== userId) {
    throw new FeedOperationError('Vous ne pouvez supprimer que vos commentaires', 403)
  }

  await db.delete(comments).where(eq(comments.id, commentId))
}
