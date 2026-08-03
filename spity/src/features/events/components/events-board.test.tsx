import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { SpityEvent } from '../schemas'
import EventsBoard from './events-board'

const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>()
const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
}) as Response

const event: SpityEvent = {
  id: '11111111-1111-4111-8111-111111111111',
  clubId: '22222222-2222-4222-8222-222222222222',
  clubName: 'Club Alpin Lyon',
  title: 'Sortie à Curis',
  type: 'outing',
  description: 'Une journée en falaise.',
  location: 'Curis-au-Mont-d’Or',
  startsAt: '2030-07-27T08:30:00.000Z',
  endsAt: null,
  capacity: 8,
  status: 'scheduled',
  registeredCount: 1,
  remainingCapacity: 7,
  isRegistered: false,
  isOwner: false,
  participants: [],
}

describe('EventsBoard', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('renders the role-specific empty state', () => {
    const { rerender } = render(<EventsBoard initialEvents={[]} role="grimpeur" />)

    expect(screen.getByText('Aucun événement disponible')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Nouvel événement' })).not.toBeInTheDocument()

    rerender(<EventsBoard initialEvents={[]} role="club" />)
    expect(screen.getByRole('button', { name: 'Nouvel événement' })).toBeInTheDocument()
  })

  it('registers then unregisters a climber', async () => {
    const registeredEvent: SpityEvent = {
      ...event,
      registeredCount: 2,
      remainingCapacity: 6,
      isRegistered: true,
    }
    fetchMock
      .mockResolvedValueOnce(jsonResponse({ event: registeredEvent }))
      .mockResolvedValueOnce(jsonResponse({ event }))
    render(<EventsBoard initialEvents={[event]} role="grimpeur" />)

    fireEvent.click(screen.getByRole('button', { name: 'S’inscrire' }))
    expect(await screen.findByText('Inscription confirmée.')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenNthCalledWith(1, `/api/events/${event.id}/registrations`, expect.objectContaining({ method: 'POST' }))

    fireEvent.click(screen.getByRole('button', { name: 'Annuler mon inscription' }))
    expect(await screen.findByText('Inscription annulée.')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenNthCalledWith(2, `/api/events/${event.id}/registrations`, expect.objectContaining({ method: 'DELETE' }))
  })

  it('lets an owning club edit and cancel an event', async () => {
    const ownedEvent: SpityEvent = {
      ...event,
      isOwner: true,
      participants: [{
        userId: '33333333-3333-4333-8333-333333333333',
        displayName: 'Lina Martin',
        avatarUrl: null,
      }],
    }
    const cancelledEvent: SpityEvent = { ...ownedEvent, status: 'cancelled' }
    fetchMock.mockResolvedValueOnce(jsonResponse({ event: cancelledEvent }))
    render(<EventsBoard initialEvents={[ownedEvent]} role="club" />)

    expect(screen.getByText('Lina Martin')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Modifier' }))
    expect(screen.getByRole('heading', { name: 'Modifier l’événement' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }))
    expect(screen.queryByRole('heading', { name: 'Modifier l’événement' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Annuler l’événement' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(`/api/events/${event.id}`, expect.objectContaining({
      method: 'PATCH',
      body: JSON.stringify({ status: 'cancelled' }),
    })))
    expect(await screen.findByText('Événement annulé.')).toBeInTheDocument()
    expect(screen.getByText('Annulation enregistrée')).toBeInTheDocument()
  })

  it('displays an API mutation error', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'Événement complet' }, 409))
    render(<EventsBoard initialEvents={[event]} role="grimpeur" />)

    fireEvent.click(screen.getByRole('button', { name: 'S’inscrire' }))

    expect(await screen.findByText('Événement complet')).toBeInTheDocument()
  })
})
