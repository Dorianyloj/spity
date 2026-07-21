import { render, screen } from '@testing-library/react'
import type { AuthUser } from '@/features/auth/schemas'
import type { SpityEvent } from '@/features/events/schemas'
import type { PublicClimber } from '@/features/matching/schemas'
import type { ClubProfile, GrimpeurProfile, UserEquipment } from '@/features/profile/schemas'
import AppDashboard from './app-dashboard'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

const grimpeurUser: AuthUser = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'lina@example.com',
  role: 'grimpeur',
  avatarUrl: null,
  emailVerified: true,
}

const grimpeurProfile: GrimpeurProfile = {
  id: '22222222-2222-4222-8222-222222222222',
  userId: grimpeurUser.id,
  displayName: 'Lina M.',
  bio: 'Grimpeuse lyonnaise',
  location: 'Lyon',
  climbingEnvironment: 'mixed',
  availability: ['weekday_evening'],
  partnerSearch: { enabled: true, levelPreference: 'same_or_close', style: 'training', notes: null },
  goals: ['Progresser'],
  disciplines: ['bloc', 'voie'],
  niveaux: { bloc: '6b', voie: '6a' },
  materiel: ['chaussons'],
  karma: 12,
}

const equipment: UserEquipment[] = [{
  id: '33333333-3333-4333-8333-333333333333',
  userId: grimpeurUser.id,
  category: 'corde',
  quantity: 1,
  brand: 'Beal',
  model: 'Joker',
  color: 'bleu',
  size: null,
  lengthMeters: 70,
  diameterMm: '9.1',
  condition: 'bon',
  availableForPartner: true,
  notes: null,
}]

const climbers: PublicClimber[] = [{
  userId: '44444444-4444-4444-8444-444444444444',
  displayName: 'Nassim B.',
  avatarUrl: null,
  bio: null,
  location: 'Villeurbanne',
  climbingEnvironment: 'indoor',
  availability: ['weekend_morning'],
  partnerSearch: { enabled: true, levelPreference: 'any', style: 'relaxed', notes: null },
  goals: [],
  disciplines: ['voie'],
  niveaux: { voie: '6a+' },
  materiel: ['baudrier'],
  karma: 5,
}]

const events: SpityEvent[] = [{
  id: '55555555-5555-4555-8555-555555555555',
  clubId: '66666666-6666-4666-8666-666666666666',
  clubName: 'Club Alpin Lyon',
  title: 'Sortie à Curis',
  type: 'outing',
  description: null,
  location: 'Curis',
  startsAt: '2030-07-27T08:30:00.000Z',
  endsAt: null,
  capacity: 8,
  status: 'scheduled',
  registeredCount: 1,
  remainingCapacity: 7,
  isRegistered: false,
  isOwner: false,
  participants: [],
}]

describe('AppDashboard', () => {
  it('renders the climber dashboard and recommendations', () => {
    render(
      <AppDashboard
        user={grimpeurUser}
        grimpeurProfile={grimpeurProfile}
        clubProfile={null}
        equipment={equipment}
        events={events}
        matchingClimbers={climbers}
      />
    )

    expect(screen.getByRole('heading', { name: 'Bonjour Lina M.' })).toBeInTheDocument()
    expect(screen.getAllByText('Nassim B.')).toHaveLength(2)
    expect(screen.getByText('1 x Joker')).toBeInTheDocument()
    expect(screen.getByText('Sortie à Curis')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Partenaires' })).toHaveAttribute('href', '/app/matching')
  })

  it('renders the club variant and hides climber-only navigation', () => {
    const clubUser: AuthUser = { ...grimpeurUser, role: 'club', email: 'club@example.com' }
    const clubProfile: ClubProfile = {
      id: '77777777-7777-4777-8777-777777777777',
      userId: clubUser.id,
      nom: 'Club Spity',
      bio: 'Club local',
      location: 'Lyon',
      ffmeNum: 'FFME-42',
    }
    const ownedEvents = events.map((event) => ({ ...event, isOwner: true }))

    render(
      <AppDashboard
        user={clubUser}
        grimpeurProfile={null}
        clubProfile={clubProfile}
        equipment={[]}
        events={ownedEvents}
        matchingClimbers={[]}
      />
    )

    expect(screen.getByRole('heading', { name: 'Bonjour Club Spity' })).toBeInTheDocument()
    expect(screen.getByText('FFME-42')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Partenaires' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Gérer les événements' })).toHaveAttribute('href', '/app/events')
  })
})
