import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import AppShell from '@/features/app/components/app-shell'
import PlaceRequestForm from '@/features/places/components/place-request-form'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Proposer un lieu - Spity',
  description: 'Proposer une salle ou un site d’escalade à la communauté Spity.',
}

export default async function SuggestPlacePage() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) redirect('/login')
  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) redirect('/profile/onboarding')
  if (currentProfile.user.role !== 'grimpeur' || !currentProfile.grimpeurProfile) redirect('/app/places')

  return (
    <AppShell activeItem="places" user={currentProfile.user}>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Répertoire communautaire</p>
          <h1 className="mt-2 text-3xl font-black text-balance text-white sm:text-4xl">Proposer un nouveau lieu</h1>
          <p className="mt-3 max-w-2xl text-pretty text-white/70">
            Ajoute une salle ou un site extérieur. Plus les informations sont précises, plus la validation sera simple.
          </p>
        </div>
        <PlaceRequestForm />
      </div>
    </AppShell>
  )
}
