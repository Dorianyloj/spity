import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppShell from '@/features/app/components/app-shell'
import EventsBoard from '@/features/events/components/events-board'
import { listEventsForViewer } from '@/features/events/lib/event-repository'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Événements - Spity',
  description: 'Agenda des sorties, initiations, coachings et contests Spity.',
}

export default async function EventsPage() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const events = await listEventsForViewer(
    currentProfile.user.id,
    currentProfile.clubProfile?.id ?? null
  )

  return (
    <AppShell activeItem="events" user={currentProfile.user}>
      <EventsBoard initialEvents={events} role={currentProfile.user.role} />
    </AppShell>
  )
}
