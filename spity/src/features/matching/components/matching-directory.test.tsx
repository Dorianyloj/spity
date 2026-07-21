import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { PartnershipRequest, PublicClimber } from '../schemas'
import MatchingDirectory from './matching-directory'

const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>()
const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
}) as Response

const lina: PublicClimber = {
  userId: '11111111-1111-4111-8111-111111111111',
  displayName: 'Lina Martin',
  avatarUrl: null,
  bio: 'Disponible pour des séances régulières.',
  location: 'Lyon',
  climbingEnvironment: 'mixed',
  availability: ['weekday_evening'],
  partnerSearch: { enabled: true, levelPreference: 'same_or_close', style: 'training', notes: null },
  goals: ['Progresser en voie'],
  disciplines: ['voie'],
  niveaux: { voie: '6b' },
  materiel: ['corde'],
  karma: 12,
}

const sam: PublicClimber = {
  ...lina,
  userId: '22222222-2222-4222-8222-222222222222',
  displayName: 'Sam Dupont',
  bio: null,
  location: null,
  climbingEnvironment: 'indoor',
  availability: ['weekend_morning'],
  disciplines: ['bloc'],
  niveaux: {},
}

const request: PartnershipRequest = {
  id: '33333333-3333-4333-8333-333333333333',
  senderId: sam.userId,
  recipientId: lina.userId,
  status: 'pending',
  createdAt: '2030-07-21T08:00:00.000Z',
  updatedAt: '2030-07-21T08:00:00.000Z',
  respondedAt: null,
  otherParticipant: {
    userId: lina.userId,
    displayName: lina.displayName,
    avatarUrl: null,
    location: lina.location,
    disciplines: lina.disciplines,
    niveaux: lina.niveaux,
  },
  direction: 'sent',
}

describe('MatchingDirectory', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('filters profiles and resets all filters', () => {
    render(<MatchingDirectory climbers={[lina, sam]} initialStatuses={{}} />)

    expect(screen.getByText('Lina Martin')).toBeInTheDocument()
    expect(screen.getByText('Sam Dupont')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Nom ou localisation'), { target: { value: 'Lyon' } })
    expect(screen.getByText('Lina Martin')).toBeInTheDocument()
    expect(screen.queryByText('Sam Dupont')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser les filtres' }))
    fireEvent.change(screen.getByLabelText('Discipline'), { target: { value: 'bloc' } })
    expect(screen.queryByText('Lina Martin')).not.toBeInTheDocument()
    expect(screen.getByText('Sam Dupont')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Niveau'), { target: { value: '8c+' } })
    expect(screen.getByText('Aucun profil ne correspond')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser les filtres' }))
    expect(screen.getByText('Lina Martin')).toBeInTheDocument()
    expect(screen.getByText('Sam Dupont')).toBeInTheDocument()
  })

  it('sends a partnership request and updates its status', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ request }))
    render(<MatchingDirectory climbers={[lina]} initialStatuses={{}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Envoyer une demande' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/partnerships', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ recipientId: lina.userId }),
    })))
    expect(await screen.findByText('Demande envoyée à Lina Martin.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Demande en attente' })).toBeDisabled()
  })

  it('displays the API error and preserves existing request states', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'Demande déjà existante' }, 409))
    render(<MatchingDirectory climbers={[lina, sam]} initialStatuses={{ [sam.userId]: 'accepted' }} />)

    expect(screen.getByRole('button', { name: 'Partenaire confirmé' })).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer une demande' }))

    expect(await screen.findByText('Demande déjà existante')).toBeInTheDocument()
  })
})
