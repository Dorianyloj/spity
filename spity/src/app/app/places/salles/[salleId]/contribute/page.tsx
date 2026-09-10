import { eq } from 'drizzle-orm'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { db } from '@/db'
import { salles } from '@/db/schema'
import AppShell from '@/features/app/components/app-shell'
import PlaceContributionForm from '@/features/places/components/place-contribution-form'
import type { PlaceChangeInput } from '@/features/places/schemas'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'

export const metadata: Metadata = {
  title: 'Corriger une salle - Spity',
  description: 'Proposer une correction ou des photos pour une salle d’escalade.',
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

const parseStringRecord = (value: unknown) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
  }
  if (typeof value !== 'string') return {}
  try {
    const parsed: unknown = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? Object.fromEntries(Object.entries(parsed).filter((entry): entry is [string, string] => typeof entry[1] === 'string'))
      : {}
  } catch {
    return {}
  }
}

export default async function ContributeGymPage({ params }: { params: Promise<{ salleId: string }> }) {
  const profile = await getCurrentProfile()
  if (!profile) redirect('/login')
  if (!profile.grimpeurProfile && !profile.clubProfile) redirect('/profile/onboarding')
  if (profile.user.role !== 'grimpeur' || !profile.grimpeurProfile) redirect('/app/places')

  const { salleId } = await params
  const [salle] = await db.select().from(salles).where(eq(salles.id, salleId)).limit(1)
  if (!salle) notFound()
  const horaires = parseStringRecord(salle.horaires)
  const tarifs = parseStringRecord(salle.tarifs)
  const initialValues: PlaceChangeInput = {
    kind: 'salle',
    placeId: salle.id,
    message: '',
    photoMediaIds: [],
    name: salle.nom,
    city: salle.location,
    department: salle.department ?? '',
    region: salle.region ?? '',
    latitude: salle.latitude,
    longitude: salle.longitude,
    restrictions: salle.restrictions ?? '',
    sourceUrl: salle.sourceUrl ?? '',
    notes: salle.notes ?? '',
    address: salle.adresse,
    disciplines: parseStringArray(salle.disciplines).filter((discipline): discipline is 'voie' | 'bloc' | 'speed' => ['voie', 'bloc', 'speed'].includes(discipline)),
    services: parseStringArray(salle.services).filter((service): service is 'vestiaires' | 'douches' | 'location_materiel' | 'restauration' | 'entrainement' | 'parking_velo' => ['vestiaires', 'douches', 'location_materiel', 'restauration', 'entrainement', 'parking_velo'].includes(service)),
    website: salle.siteWeb ?? '',
    weekdayHours: horaires.semaine ?? '',
    weekendHours: horaires.weekEnd ?? '',
    entryPrice: tarifs.entree ?? '',
    subscriptionPrice: tarifs.abonnement ?? '',
    minimumLevel: salle.niveauMin ?? '',
    maximumLevel: salle.niveauMax ?? '',
    attendance: salle.frequentation ?? '',
  }

  return <AppShell activeItem="places" user={profile.user}>
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-black text-balance text-white sm:text-4xl">Améliorer la fiche</h1>
      <PlaceContributionForm backHref={`/app/places/salles/${salle.id}`} initialValues={initialValues} placeName={salle.nom} />
    </div>
  </AppShell>
}
