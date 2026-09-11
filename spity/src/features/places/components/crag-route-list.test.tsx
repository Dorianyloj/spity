import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CragRouteList, { type CragRoute } from './crag-route-list'

const routes: CragRoute[] = [
  { id: 'route-1', nom: 'La dalle douce', cotation: '5c', secteur: 'Ouest', style: 'dalle', hauteur: 18, degaines: 7, status: 'ok', voteCount: 2 },
  { id: 'route-2', nom: 'Le grand dévers', cotation: '7a+', secteur: 'Est', style: 'devers', hauteur: 31, degaines: 12, status: 'humide', voteCount: 0 },
  { id: 'route-3', nom: 'Fissure du matin', cotation: '6b', secteur: 'Ouest', style: 'fissure', hauteur: null, degaines: null, status: null, voteCount: 1 },
]

const routeNames = () => screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)

describe('CragRouteList', () => {
  it('shows compact route rows sorted from the hardest grade by default', () => {
    render(<CragRouteList routes={routes} />)

    expect(routeNames()).toEqual(['Le grand dévers', 'Fissure du matin', 'La dalle douce'])
    expect(screen.getByText('31 m · 12 dégaines')).toBeInTheDocument()
    expect(screen.getAllByText('Humide')).toHaveLength(2)
    expect(screen.getByRole('status')).toHaveClass('sr-only')
  })

  it('searches, filters and sorts the routes', async () => {
    const user = userEvent.setup()
    render(<CragRouteList routes={routes} />)

    await user.type(screen.getByLabelText('Rechercher une voie'), 'fissure')
    expect(routeNames()).toEqual(['Fissure du matin'])

    await user.clear(screen.getByLabelText('Rechercher une voie'))
    await user.selectOptions(screen.getByLabelText('Secteur'), 'Ouest')
    await user.selectOptions(screen.getByLabelText('Trier'), 'easiest')
    expect(routeNames()).toEqual(['La dalle douce', 'Fissure du matin'])

    await user.selectOptions(screen.getByLabelText('État'), 'unknown')
    expect(routeNames()).toEqual(['Fissure du matin'])
  })
})
