import { serveMemberMedia } from '@/features/media/lib/member-media'
export const runtime = 'nodejs'
export async function GET(_request: Request, context: { params: Promise<{ mediaId: string }> }) {
  return serveMemberMedia((await context.params).mediaId, 'avatar')
}
