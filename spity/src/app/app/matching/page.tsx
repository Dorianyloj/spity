import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppShell from '@/features/app/components/app-shell'
import MatchingDirectory from '@/features/matching/components/matching-directory'
import {
  findMatchingClimbers,
  findPartnershipStatuses,
} from '@/features/matching/lib/matching-repository'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Trouver un partenaire - Spity',
  description: 'Annuaire filtrable des grimpeurs disponibles sur Spity.',
}

export default async function MatchingPage() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile) {
    redirect(currentProfile.user.role === 'club' ? '/app/events' : '/profile/onboarding')
  }

  const climbers = await findMatchingClimbers(currentProfile.user.id)
  const statuses = await findPartnershipStatuses(currentProfile.user.id, climbers.map((climber) => climber.userId))

  return (
    <AppShell activeItem="matching" user={currentProfile.user}>
      <MatchingDirectory climbers={climbers} initialStatuses={Object.fromEntries(statuses)} />
    </AppShell>
  )
}
