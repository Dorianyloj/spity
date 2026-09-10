import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppShell from '@/features/app/components/app-shell'
import PlaceRequestForm from '@/features/places/components/place-request-form'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Ajouter un lieu - Spity',
  description: 'Ajouter une salle ou un site d’escalade sur Spity.',
}

export default async function SuggestPlacePage() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) redirect('/login')
  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) redirect('/profile/onboarding')
  if (currentProfile.user.role !== 'grimpeur' || !currentProfile.grimpeurProfile) redirect('/app/places')

  return (
    <AppShell activeItem="places" user={currentProfile.user}>
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-black text-balance text-white sm:text-4xl">Ajouter un lieu</h1>
        <PlaceRequestForm />
      </div>
    </AppShell>
  )
}
