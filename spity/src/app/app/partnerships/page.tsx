import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppShell from '@/features/app/components/app-shell'
import PartnershipCenter from '@/features/matching/components/partnership-center'
import { listPartnershipsForUser } from '@/features/matching/lib/matching-repository'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Mes demandes - Spity',
  description: 'Suivi des demandes de partenaires Spity.',
}

export default async function PartnershipsPage() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile) {
    redirect(currentProfile.user.role === 'club' ? '/app/events' : '/profile/onboarding')
  }

  const requests = await listPartnershipsForUser(currentProfile.user.id)

  return (
    <AppShell activeItem="partnerships" user={currentProfile.user}>
      <PartnershipCenter initialRequests={requests} />
    </AppShell>
  )
}
