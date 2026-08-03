import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlacesDirectory from './places-directory'

const salles = [{
  id: 'salle-1',
  nom: 'Arkose Lyon',
  location: 'Lyon',
  adresse: '15 rue du Bloc',
  disciplines: ['bloc', 'voie'],
  photoUrl: null,
  horaires: { semaine: '10h-23h' },
  tarifs: { entree: '18 EUR' },
  services: ['Parking', 'Douche'],
  siteWeb: null,
  latitude: 45.75,
  longitude: 4.85,
  niveauMin: '4a',
  niveauMax: '8a',
  frequentation: 'moderee' as const,
}]

const falaises = [{
  id: 'falaise-1',
  nom: 'Curis',
  location: 'Curis-au-Mont-d’Or',
  acces: 'Sentier balisé',
  niveaux: ['5c', '6a'],
  photoUrl: null,
  latitude: 45.86,
  longitude: 4.82,
  orientation: 'sud' as const,
  approche: '15 minutes',
  parking: 'Parking mairie',
  saison: ['printemps', 'automne'],
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
  hauteur: 24,
  degaines: 10,
  secteur: 'Principal',
  style: 'vertical' as const,
  status: 'ok' as const,
}]

describe('PlacesDirectory', () => {
  it('renders every place type and its route details', () => {
    render(<PlacesDirectory salles={salles} falaises={falaises} clubs={clubs} voies={voies} />)

    expect(screen.getByRole('heading', { name: 'Arkose Lyon' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Curis' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Club Alpin Lyon' })).toBeInTheDocument()
    expect(screen.getByText('La directe')).toBeInTheDocument()
    expect(screen.getByText('3 résultat(s) affiché(s)')).toBeInTheDocument()
  })

  it('filters by text, type and status and exposes empty states', async () => {
    const user = userEvent.setup()
    render(<PlacesDirectory salles={salles} falaises={falaises} clubs={clubs} voies={voies} />)

    await user.type(screen.getByRole('searchbox'), 'directe')
    expect(screen.queryByRole('heading', { name: 'Arkose Lyon' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Curis' })).toBeInTheDocument()
    expect(screen.getByText('Aucune salle trouvée')).toBeInTheDocument()
    expect(screen.getByText('Aucun club trouvé')).toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    await user.selectOptions(screen.getByLabelText('Type'), 'clubs')
    expect(screen.getByRole('heading', { name: 'Club Alpin Lyon' })).toBeInTheDocument()
    expect(screen.getByText('Aucune falaise trouvée')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Type'), 'all')
    await user.selectOptions(screen.getByLabelText('État'), 'sec')
    expect(screen.getByRole('heading', { name: 'Curis' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Arkose Lyon' })).not.toBeInTheDocument()
  })
})
