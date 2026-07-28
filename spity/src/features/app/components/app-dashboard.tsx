import type { AuthUser } from '@/features/auth/schemas'
import type { FeedPost } from '@/features/feed/schemas'
import AppShell from './app-shell'
import FeedTimeline from '@/features/feed/components/feed-timeline'

type AppDashboardProps = {
  user: AuthUser
  posts: FeedPost[]
}

export default function AppDashboard({ user, posts }: AppDashboardProps) {
  return (
    <AppShell activeItem="feed" user={user}>
      <section aria-labelledby="feed-heading" className="mx-auto max-w-2xl space-y-4">
        <header className="px-1 pb-2 pt-1">
          <p className="text-sm font-semibold text-primary">Pour vous</p>
          <h1 id="feed-heading" className="mt-1 text-3xl font-bold text-white sm:text-4xl">
            Fil d’actualité
          </h1>
          <p className="mt-2 max-w-xl text-pretty text-sm text-white/75">
            Les sorties, idées et infos utiles partagées par la communauté escalade.
          </p>
        </header>

        <FeedTimeline initialPosts={posts} />
      </section>
    </AppShell>
  )
}
