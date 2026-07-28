import { z } from 'zod'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { rejectInvalidOrigin } from '@/features/auth/lib/csrf'
import { FeedOperationError, setPostLike } from '@/features/feed/lib/feed-repository'
import { postLikeErrorResponse, postLikeResponse } from '@/features/feed/lib/responses'

type PostLikeRouteContext = { params: Promise<{ postId: string }> }

const paramsSchema = z.object({ postId: z.string().uuid() })

const mutatePostLike = async (
  request: Request,
  context: PostLikeRouteContext,
  liked: boolean
) => {
  const invalidOriginResponse = rejectInvalidOrigin(request)

  if (invalidOriginResponse) {
    return invalidOriginResponse
  }

  const [user, params] = await Promise.all([
    getCurrentUser(),
    context.params,
  ])
  const parsedParams = paramsSchema.safeParse(params)

  if (!user) {
    return postLikeErrorResponse('Authentification requise', 401)
  }

  if (!parsedParams.success) {
    return postLikeErrorResponse('Identifiant de publication invalide', 422)
  }

  try {
    const like = await setPostLike(parsedParams.data.postId, user.id, liked)

    return postLikeResponse(like)
  } catch (error) {
    if (error instanceof FeedOperationError) {
      return postLikeErrorResponse(error.message, error.status)
    }

    throw error
  }
}

export async function POST(request: Request, context: PostLikeRouteContext) {
  return mutatePostLike(request, context, true)
}

export async function DELETE(request: Request, context: PostLikeRouteContext) {
  return mutatePostLike(request, context, false)
}
