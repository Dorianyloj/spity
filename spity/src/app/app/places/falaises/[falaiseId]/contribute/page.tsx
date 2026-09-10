import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { falaises } from '@/db/schema'
import AppShell from '@/features/app/components/app-shell'
import PlaceContributionForm from '@/features/places/components/place-contribution-form'
import type { PlaceChangeInput } from '@/features/places/schemas'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Corriger une falaise - Spity',
  description: 'Proposer une correction ou des photos pour un site naturel.',
}

const parseStringArray = (value: unknown) => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string')
  if (typeof value !== 'string') return []
  try {
    const parsed: unknown = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export default async function ContributeCragPage({ params }: { params: Promise<{ falaiseId: string }> }) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')
  if (!profile.grimpeurProfile && !profile.clubProfile) redirect('/profile/onboarding')
  if (profile.user.role !== 'grimpeur' || !profile.grimpeurProfile) redirect('/app/places')

  const { falaiseId } = await params
  const [falaise] = await db.select().from(falaises).where(eq(falaises.id, falaiseId)).limit(1)
  if (!falaise) notFound()
  const orientations = parseStringArray(falaise.orientations)
  const initialValues: PlaceChangeInput = {
    kind: 'falaise',
    placeId: falaise.id,
    message: '',
    photoMediaIds: [],
    name: falaise.nom,
    city: falaise.location,
    department: falaise.department ?? '',
    region: falaise.region ?? '',
    latitude: falaise.latitude,
    longitude: falaise.longitude,
    restrictions: falaise.restrictions ?? '',
    sourceUrl: falaise.sourceUrl ?? '',
    notes: falaise.notes ?? '',
    disciplines: parseStringArray(falaise.disciplines).filter((discipline): discipline is PlaceChangeInput['disciplines'][number] => ['voie', 'bloc', 'grande_voie', 'trad', 'artif', 'deep_water_solo', 'via_ferrata', 'speed'].includes(discipline)),
    rockType: falaise.rockType ?? '',
    rainExposure: falaise.rainExposure ?? '',
    sunlight: falaise.sunlight ?? '',
    levels: parseStringArray(falaise.niveaux).join(', '),
    orientation: falaise.orientation ?? '',
    orientations: orientations.filter((orientation): orientation is 'nord' | 'nord_est' | 'est' | 'sud_est' | 'sud' | 'sud_ouest' | 'ouest' | 'nord_ouest' => ['nord', 'nord_est', 'est', 'sud_est', 'sud', 'sud_ouest', 'ouest', 'nord_ouest'].includes(orientation)),
    seasons: parseStringArray(falaise.saison).filter((season): season is 'printemps' | 'ete' | 'automne' | 'hiver' => ['printemps', 'ete', 'automne', 'hiver'].includes(season)),
    status: falaise.status ?? '',
    access: falaise.acces ?? '',
    approach: falaise.approche ?? '',
    parking: falaise.parking ?? '',
    parkingLatitude: falaise.parkingLatitude,
    parkingLongitude: falaise.parkingLongitude,
  }

  return <AppShell activeItem="places" user={profile.user}>
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-black text-balance text-white sm:text-4xl">Améliorer la fiche</h1>
      <PlaceContributionForm backHref={`/app/places/falaises/${falaise.id}`} initialValues={initialValues} placeName={falaise.nom} />
    </div>
  </AppShell>
}
