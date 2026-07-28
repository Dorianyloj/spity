import { z } from 'zod'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import { FeedOperationError, createPostComment } from '@/features/feed/lib/feed-repository'
import { postCommentErrorResponse, postCommentResponse } from '@/features/feed/lib/responses'
import { createCommentBodySchema } from '@/features/feed/schemas'

type PostCommentsRouteContext = { params: Promise<{ postId: string }> }

const paramsSchema = z.object({ postId: z.string().uuid() })

const readJsonBody = async (request: Request) => {
  try {
    return await request.json() as unknown
  } catch {
    return null
  }
}

export async function POST(request: Request, context: PostCommentsRouteContext) {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const [user, params, body] = await Promise.all([
    getCurrentUser(),
    context.params,
    readJsonBody(request),
  ])
  const parsedParams = paramsSchema.safeParse(params)
  const parsedBody = createCommentBodySchema.safeParse(body)

  if (!user) {
    return postCommentErrorResponse('Authentification requise', 401)
  }

  if (!parsedParams.success) {
    return postCommentErrorResponse('Identifiant de publication invalide', 422)
  }

  if (!parsedBody.success) {
    return postCommentErrorResponse(parsedBody.error.issues[0]?.message ?? 'Commentaire invalide', 422)
  }

  try {
    const comment = await createPostComment(parsedParams.data.postId, user.id, parsedBody.data.content)

    return postCommentResponse(comment, 201)
  } catch (error) {
    if (error instanceof FeedOperationError) {
      return postCommentErrorResponse(error.message, error.status)
    }

    throw error
  }
}
