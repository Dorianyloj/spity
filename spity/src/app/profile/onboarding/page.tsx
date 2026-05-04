import type { Metadata } from 'next'
import ProfileForm from '@/features/profile/components/profile-form'

export const metadata: Metadata = {
  title: 'Onboarding profil - Spity',
  description: 'Compléter son profil Spity.',
}

export default function ProfileOnboardingPage() {
  return <ProfileForm mode="onboarding" />
}
