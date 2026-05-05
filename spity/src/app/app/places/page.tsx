import { asc } from 'drizzle-orm'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { clubProfiles, falaises, salles, voies } from '@/db/schema'
import AppShell from '@/features/app/components/app-shell'
import PlacesDirectory from '@/features/places/components/places-directory'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Lieux - Spity',
  description: 'Répertoire des salles, falaises et clubs Spity.',
}

const parseStringArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value !== 'string') {
    return []
  }

  try {
    const parsedValue: unknown = JSON.parse(value)

    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export default async function PlacesPage() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    redirect('/login')
  }

  if (!currentProfile.grimpeurProfile && !currentProfile.clubProfile) {
    redirect('/profile/onboarding')
  }

  const [salleRows, falaiseRows, clubRows, voieRows] = await Promise.all([
    db.select().from(salles).orderBy(asc(salles.nom)),
    db.select().from(falaises).orderBy(asc(falaises.nom)),
    db.select().from(clubProfiles).orderBy(asc(clubProfiles.nom)),
    db.select().from(voies).orderBy(asc(voies.nom)),
  ])

  return (
    <AppShell activeItem="places" user={currentProfile.user}>
      <PlacesDirectory
        salles={salleRows.map((salle) => ({
          ...salle,
          disciplines: parseStringArray(salle.disciplines),
        }))}
        falaises={falaiseRows.map((falaise) => ({
          ...falaise,
          niveaux: parseStringArray(falaise.niveaux),
        }))}
        clubs={clubRows}
        voies={voieRows}
      />
    </AppShell>
  )
}
