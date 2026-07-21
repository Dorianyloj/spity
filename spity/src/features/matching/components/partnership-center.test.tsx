import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { PartnershipRequest } from '../schemas'
import PartnershipCenter from './partnership-center'

const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>()
const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
}) as Response

const pendingRequest: PartnershipRequest = {
  id: '11111111-1111-4111-8111-111111111111',
  senderId: '22222222-2222-4222-8222-222222222222',
  recipientId: '33333333-3333-4333-8333-333333333333',
  status: 'pending',
  createdAt: '2030-07-21T08:00:00.000Z',
  updatedAt: '2030-07-21T08:00:00.000Z',
  respondedAt: null,
  otherParticipant: {
    userId: '22222222-2222-4222-8222-222222222222',
    displayName: 'Nassim Bernard',
    avatarUrl: null,
    location: 'Grenoble',
    disciplines: ['bloc'],
    niveaux: { bloc: '7a' },
  },
  direction: 'received',
}

describe('PartnershipCenter', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('renders the empty state', () => {
    render(<PartnershipCenter initialRequests={[]} />)

    expect(screen.getByText('Aucune demande pour le moment')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Rechercher un profil' })).toHaveAttribute('href', '/app/matching')
  })

  it('accepts a received request', async () => {
    const acceptedRequest: PartnershipRequest = {
      ...pendingRequest,
      status: 'accepted',
      respondedAt: '2030-07-21T09:00:00.000Z',
      updatedAt: '2030-07-21T09:00:00.000Z',
    }
    fetchMock.mockResolvedValueOnce(jsonResponse({ request: acceptedRequest }))
    render(<PartnershipCenter initialRequests={[pendingRequest]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Accepter la demande de Nassim Bernard' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      `/api/partnerships/${pendingRequest.id}`,
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ status: 'accepted' }) })
    ))
    expect(await screen.findByText('Demande acceptée.')).toBeInTheDocument()
    expect(screen.getByText('Acceptée')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Accepter la demande/ })).not.toBeInTheDocument()
  })

  it('reports a refusal API error', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'Réponse impossible' }, 400))
    render(<PartnershipCenter initialRequests={[pendingRequest]} />)

    fireEvent.click(screen.getByRole('button', { name: 'Refuser la demande de Nassim Bernard' }))

    expect(await screen.findByText('Réponse impossible')).toBeInTheDocument()
    expect(screen.getByText('En attente')).toBeInTheDocument()
  })
})
