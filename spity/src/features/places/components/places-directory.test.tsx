import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlacesDirectory from './places-directory'

jest.mock('next/dynamic', () => () => function MockPlacesMap({ ariaLabel, className, expanded }: { ariaLabel: string; className?: string; expanded?: boolean }) {
  return <div aria-label={ariaLabel} className={className} data-expanded={expanded} data-testid="places-map" />
})

const salles = [{
  id: 'salle-1',
  nom: 'Arkose Lyon',
  location: 'Lyon',
  adresse: '15 rue du Bloc',
  disciplines: ['bloc', 'voie'],
  photoUrl: null,
  latitude: 45.75,
  longitude: 4.85,
  niveauMin: '4a',
  niveauMax: '8a',
}]

const falaises = [{
  id: 'falaise-1',
  nom: 'Curis',
  location: 'Curis-au-Mont-d’Or',
  disciplines: ['voie', 'trad'],
  niveaux: ['5c', '6a'],
  photoUrl: null,
  latitude: 45.86,
  longitude: 4.82,
  status: 'sec' as const,
}]

const clubs = [{
  id: 'club-1',
  nom: 'Club Alpin Lyon',
  bio: 'Sorties locales et formation.',
  location: 'Lyon',
  ffmeNum: 'FFME-69001',
}]

const voies = [{
  id: 'voie-1',
  falaiseId: 'falaise-1',
  nom: 'La directe',
  cotation: '6a',
  secteur: 'Principal',
}]

describe('PlacesDirectory', () => {
  it('renders a compact directory and its useful map', () => {
    render(<PlacesDirectory canSuggest salles={salles} falaises={falaises} clubs={clubs} voies={voies} />)

    expect(screen.getByRole('heading', { name: 'Arkose Lyon' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Curis' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Club Alpin Lyon' })).toBeInTheDocument()
    expect(screen.getByText('Salle')).toBeInTheDocument()
    expect(screen.getByText('Falaise')).toBeInTheDocument()
    expect(screen.getByText('Club')).toBeInTheDocument()
    expect(screen.getByText('Sec')).toBeInTheDocument()
    expect(screen.getByText('6a')).toBeInTheDocument()
    expect(screen.queryByText('La directe')).not.toBeInTheDocument()
    expect(screen.getByText('3 lieux trouvés')).toHaveClass('sr-only')
    expect(screen.getByRole('heading', { name: 'Carte des falaises' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Carte des salles' })).toBeInTheDocument()
    expect(screen.getAllByTestId('places-map')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'Ajouter un lieu' })).toHaveAttribute('href', '/app/places/suggest')
  })

  it('filters accurately and lets the climber reset the exploration', async () => {
    const user = userEvent.setup()
    render(<PlacesDirectory salles={salles} falaises={falaises} clubs={clubs} voies={voies} />)

    await user.type(screen.getByRole('searchbox'), 'directe')
    expect(screen.queryByRole('heading', { name: 'Arkose Lyon' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Curis' })).toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    expect(screen.getByRole('heading', { name: 'Arkose Lyon' })).toBeInTheDocument()
    await user.click(screen.getByRole('combobox', { name: 'Pratique' }))
    await user.click(await screen.findByRole('option', { name: 'Trad' }))
    expect(screen.getByRole('heading', { name: 'Curis' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Arkose Lyon' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('combobox', { name: 'Pratique' }))
    await user.click(await screen.findByRole('option', { name: 'Grande voie' }))
    expect(screen.getByText('Aucun lieu trouvé')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Réinitialiser les filtres' }))
    expect(screen.getByRole('heading', { name: 'Arkose Lyon' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Club Alpin Lyon' })).toBeInTheDocument()
  })

  it('lets the climber expand the map without keeping the result list on screen', async () => {
    const user = userEvent.setup()
    render(<PlacesDirectory salles={salles} falaises={falaises} clubs={clubs} voies={voies} />)

    await user.click(screen.getByRole('button', { name: 'Agrandir la carte des falaises' }))
    expect(screen.getByRole('button', { name: 'Réduire la carte des falaises' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('heading', { name: 'Résultats' })).not.toBeInTheDocument()
    expect(screen.getByTestId('places-map')).toHaveClass('min-h-96')
    expect(screen.queryByRole('heading', { name: 'Carte des salles' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Réduire la carte des falaises' }))
    expect(screen.getByRole('heading', { name: 'Résultats' })).toBeInTheDocument()
  })
})
