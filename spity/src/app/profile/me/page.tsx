import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppShell from '@/features/app/components/app-shell'
import ProfileForm from '@/features/profile/components/profile-form'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Mon profil - Spity',
  description: 'Consulter et modifier son profil Spity.',
}

export default async function ProfileMePage() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  return (
    <AppShell activeItem="profile" user={currentProfile.user}>
      <ProfileForm mode="settings" variant="app" />
    </AppShell>
  )
}
