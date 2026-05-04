import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppDashboard from '@/features/app/components/app-dashboard'
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

  return (
    <AppDashboard
      user={currentProfile.user}
      grimpeurProfile={currentProfile.grimpeurProfile}
      clubProfile={currentProfile.clubProfile}
    />
  )
}
