import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import AppShell from '@/features/app/components/app-shell'
import ProfileForm from '@/features/profile/components/profile-form'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { findPublicProfileByUserId } from '@/features/profile/lib/public-profile-repository'
import { profileMeResponseSchema } from '@/features/profile/schemas'
import { profileSection } from '@/features/profile/lib/presentation'
import ProfileWorkspace from '@/features/profile/components/profile-workspace'

export const metadata: Metadata = {
  title: 'Mon profil - Spity',
  description: 'Consulter et modifier son profil Spity.',
  robots: { index: false, follow: false },
}

export default async function ProfileMePage({ searchParams }: { searchParams: Promise<{ section?: string; page?: string }> }) {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const query = await searchParams
  const publicProfile = currentProfile.user.role === 'grimpeur' ? await findPublicProfileByUserId(currentProfile.user.id, Number(query.page ?? 1)) : null
  if (currentProfile.user.role === 'grimpeur' && !publicProfile) notFound()
  return (
    <AppShell activeItem="profile" user={currentProfile.user}>
      {currentProfile.grimpeurProfile && publicProfile ? <ProfileWorkspace key={`${publicProfile.page}:${query.section ?? ''}`} initialSection={profileSection(query.section)} initialProfile={profileMeResponseSchema.parse({ ...currentProfile, onboardingComplete: true })} publicProfile={publicProfile} /> : <ProfileForm mode="settings" variant="app" />}
    </AppShell>
  )
}
