import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppDashboard from '@/features/app/components/app-dashboard'
import { listFeedPosts } from '@/features/feed/lib/feed-repository'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Tableau de bord - Spity',
  description: 'Tableau de bord connecté Spity.',
}

export default async function AppPage() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const posts = await listFeedPosts(currentProfile.user.id)

  return <AppDashboard posts={posts} user={currentProfile.user} />
}
