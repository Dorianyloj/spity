import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ProfileMeResponse } from '../schemas'
import ProfileForm from './profile-form'

const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>()

const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
}) as Response

const grimpeurProfile: ProfileMeResponse = {
  user: {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'lina@example.com',
    role: 'grimpeur',
    avatarUrl: 'https://images.example.com/lina.jpg',
    emailVerified: true,
  },
  grimpeurProfile: {
    id: '22222222-2222-4222-8222-222222222222',
    userId: '11111111-1111-4111-8111-111111111111',
    displayName: 'Lina M.',
    bio: 'Bloc et voie autour de Lyon.',
    location: 'Lyon',
    climbingEnvironment: 'mixed',
    availability: ['weekday_evening'],
    partnerSearch: {
      enabled: true,
      levelPreference: 'same_or_close',
      style: 'training',
      notes: 'Sessions régulières',
    },
    goals: ['Progresser en voie'],
    disciplines: ['bloc', 'voie'],
    niveaux: { bloc: '6b', voie: '6a' },
    materiel: ['chaussons', 'baudrier'],
    karma: 8,
  },
  clubProfile: null,
  equipment: [{
    id: '33333333-3333-4333-8333-333333333333',
    userId: '11111111-1111-4111-8111-111111111111',
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
  }],
  onboardingComplete: true,
}

const clubProfile: ProfileMeResponse = {
  user: {
    id: '44444444-4444-4444-8444-444444444444',
    email: 'club@example.com',
    role: 'club',
    avatarUrl: null,
    emailVerified: false,
  },
  grimpeurProfile: null,
  clubProfile: {
    id: '55555555-5555-4555-8555-555555555555',
    userId: '44444444-4444-4444-8444-444444444444',
    nom: 'Club Spity',
    bio: 'Club local',
    location: 'Lyon',
    ffmeNum: 'FFME-42',
  },
  equipment: [],
  onboardingComplete: true,
}

describe('ProfileForm', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('loads a climber profile and navigates through every settings tab', async () => {
    const user = userEvent.setup()
    fetchMock.mockResolvedValueOnce(jsonResponse(grimpeurProfile))

    render(<ProfileForm mode="settings" variant="app" />)
    expect(screen.getByText('Chargement du profil...')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Modifier la fiche' })).toBeInTheDocument()
    expect(screen.getByText('Lina M.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Pratique' }))
    expect(screen.getByRole('heading', { name: 'Modifier ma pratique' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Préférences de matching' })).toBeInTheDocument()
    expect(screen.getByText('1 x Beal Joker')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Matériel' }))
    expect(screen.getByRole('heading', { name: 'Inventaire matériel' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Compte' }))
    expect(screen.getByText('lina@example.com')).toBeInTheDocument()
    expect(screen.getByText('Email vérifié')).toBeInTheDocument()
  })

  it('updates the public climber identity and preferences', async () => {
    const user = userEvent.setup()
    const updatedProfile: ProfileMeResponse = {
      ...grimpeurProfile,
      grimpeurProfile: grimpeurProfile.grimpeurProfile
        ? { ...grimpeurProfile.grimpeurProfile, displayName: 'Lina Spity' }
        : null,
    }
    fetchMock
      .mockResolvedValueOnce(jsonResponse(grimpeurProfile))
      .mockResolvedValueOnce(jsonResponse(updatedProfile))
      .mockResolvedValueOnce(jsonResponse(updatedProfile))

    render(<ProfileForm mode="settings" variant="app" />)
    const displayName = await screen.findByLabelText('Nom affiché')
    await user.clear(displayName)
    await user.type(displayName, 'Lina Spity')
    await user.click(screen.getByLabelText('Semaine matin'))
    await user.click(screen.getByLabelText('Trouver des partenaires réguliers'))
    await user.click(screen.getByRole('button', { name: 'Mettre à jour la fiche publique' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Profil public mis à jour')

    await user.click(screen.getByRole('button', { name: 'Pratique' }))
    await user.click(screen.getByLabelText('Je recherche actuellement des partenaires'))
    await user.selectOptions(screen.getByLabelText('Niveau recherché'), 'stronger')
    await user.selectOptions(screen.getByLabelText('Style de session'), 'performance')
    await user.click(screen.getByRole('button', { name: 'Enregistrer les préférences' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3))
  })

  it('loads and edits the club variant', async () => {
    const user = userEvent.setup()
    fetchMock
      .mockResolvedValueOnce(jsonResponse(clubProfile))
      .mockResolvedValueOnce(jsonResponse(clubProfile))

    render(<ProfileForm mode="settings" variant="app" />)
    expect(await screen.findByRole('heading', { name: 'Résumé club' })).toBeInTheDocument()
    expect(screen.getByText('FFME-42')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Matériel' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Club' }))
    const clubName = screen.getByLabelText('Nom du club')
    await user.clear(clubName)
    await user.type(clubName, 'Club Spity Rhône')
    await user.click(screen.getByRole('button', { name: 'Mettre à jour' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Profil club mis à jour')
  })

  it('shows the authentication fallback when profile loading fails', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'Non authentifié' }, 401))

    render(<ProfileForm mode="onboarding" />)

    expect(await screen.findByRole('heading', { name: 'Connexion requise' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Aller à la connexion' })).toHaveAttribute('href', '/login')
  })
})
