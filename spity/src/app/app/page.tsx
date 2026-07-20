import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppDashboard from '@/features/app/components/app-dashboard'
import { listEventsForViewer } from '@/features/events/lib/event-repository'
import { findMatchingClimbers } from '@/features/matching/lib/matching-repository'
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

  const [events, matchingClimbers] = await Promise.all([
    listEventsForViewer(currentProfile.user.id, currentProfile.clubProfile?.id ?? null),
    currentProfile.user.role === 'grimpeur'
      ? findMatchingClimbers(currentProfile.user.id)
      : Promise.resolve([]),
  ])

  return (
    <AppDashboard
      user={currentProfile.user}
      grimpeurProfile={currentProfile.grimpeurProfile}
      clubProfile={currentProfile.clubProfile}
      equipment={currentProfile.equipment}
      events={events}
      matchingClimbers={matchingClimbers}
    />
  )
}
