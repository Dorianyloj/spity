import type { Metadata } from 'next'
import ProfileForm from '@/features/profile/components/profile-form'

export const metadata: Metadata = {
  title: 'Mon profil - Spity',
  description: 'Consulter et modifier son profil Spity.',
}

export default function ProfileMePage() {
  return <ProfileForm mode="settings" />
}
