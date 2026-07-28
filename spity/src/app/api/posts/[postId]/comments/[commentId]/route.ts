import { z } from 'zod'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import {
  FeedOperationError,
  deletePostComment,
  updatePostComment,
} from '@/features/feed/lib/feed-repository'
import {
  postCommentDeleteResponse,
  postCommentErrorResponse,
  postCommentResponse,
} from '@/features/feed/lib/responses'
import { createCommentBodySchema } from '@/features/feed/schemas'

type PostCommentRouteContext = { params: Promise<{ postId: string; commentId: string }> }

const paramsSchema = z.object({
  postId: z.string().uuid(),
  commentId: z.string().uuid(),
})

const readJsonBody = async (request: Request) => {
  try {
    return await request.json() as unknown
  } catch {
    return null
  }
}

const prepareMutation = async (request: Request, context: PostCommentRouteContext) => {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return { invalidOriginResponse }
  }

  const [user, params] = await Promise.all([
    getCurrentUser(),
    context.params,
  ])
  const parsedParams = paramsSchema.safeParse(params)

  if (!user) {
    return { errorResponse: postCommentErrorResponse('Authentification requise', 401) }
  }

  if (!parsedParams.success) {
    return { errorResponse: postCommentErrorResponse('Identifiant de commentaire invalide', 422) }
  }

  return { user, params: parsedParams.data }
}

export async function PATCH(request: Request, context: PostCommentRouteContext) {
  const prepared = await prepareMutation(request, context)

  if (prepared.invalidOriginResponse || prepared.errorResponse) {
    return prepared.invalidOriginResponse ?? prepared.errorResponse
  }

  const parsedBody = createCommentBodySchema.safeParse(await readJsonBody(request))

  if (!parsedBody.success) {
    return postCommentErrorResponse(parsedBody.error.issues[0]?.message ?? 'Commentaire invalide', 422)
  }

  try {
    const comment = await updatePostComment(
      prepared.params.postId,
      prepared.params.commentId,
      prepared.user.id,
      parsedBody.data.content
    )

    return postCommentResponse(comment)
  } catch (error) {
    if (error instanceof FeedOperationError) {
      return postCommentErrorResponse(error.message, error.status)
    }

    throw error
  }
}

export async function DELETE(request: Request, context: PostCommentRouteContext) {
  const prepared = await prepareMutation(request, context)

  if (prepared.invalidOriginResponse || prepared.errorResponse) {
    return prepared.invalidOriginResponse ?? prepared.errorResponse
  }

  try {
    await deletePostComment(prepared.params.postId, prepared.params.commentId, prepared.user.id)

    return postCommentDeleteResponse(prepared.params.commentId)
  } catch (error) {
    if (error instanceof FeedOperationError) {
      return postCommentErrorResponse(error.message, error.status)
    }

    throw error
  }
}
