import { render, screen } from '@testing-library/react'
import PlaceContributionForm from './place-contribution-form'

jest.mock('next/dynamic', () => () => function MockPlaceMap() {
  return <div data-testid="place-map" />
})
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ alt }: { alt?: string }) {
    return <span aria-label={alt ?? ''} />
  },
}))

const common = {
  placeId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e',
  message: '',
  photoMediaIds: [],
  name: 'Roche Corbière',
  city: 'Lyon',
  department: 'Rhône',
  region: 'Auvergne-Rhône-Alpes',
  latitude: 45.764,
  longitude: 4.8357,
  restrictions: '',
  sourceUrl: '',
  notes: '',
}

describe('PlaceContributionForm', () => {
  it('renders the prefilled crag contribution, its parking controls and photo guidance', () => {
    render(<PlaceContributionForm
      backHref="/app/places/falaises/eb7c2638-3114-41b6-8917-a5dc4bc1d22e"
      placeName="Roche Corbière"
      initialValues={{
        ...common,
        kind: 'falaise',
        disciplines: ['voie'],
        rockType: 'calcaire',
        rainExposure: 'expose',
        sunlight: 'mixte',
        levels: '5c, 6a',
        orientation: 'sud',
        orientations: ['sud'],
        seasons: ['printemps'],
        status: 'sec',
        access: 'Suivre le sentier.',
        approach: '15 min',
        parking: 'Parking du col',
        parkingLatitude: 45.765,
        parkingLongitude: 4.836,
      }}
    />)

    expect(screen.getByRole('heading', { name: 'Corriger Roche Corbière' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Parking' })).toBeInTheDocument()
    expect(screen.getByLabelText('Latitude parking')).toHaveValue(45.765)
    expect(screen.getByText(/Jusqu’à 6 photos/)).toBeInTheDocument()
    expect(screen.getByLabelText('Accès au site')).toHaveValue('Suivre le sentier.')
  })

  it('renders the prefilled gym contribution and its practical fields', () => {
    render(<PlaceContributionForm
      backHref="/app/places/salles/eb7c2638-3114-41b6-8917-a5dc4bc1d22e"
      placeName="Bloc Factory"
      initialValues={{
        ...common,
        kind: 'salle',
        name: 'Bloc Factory',
        address: '10 rue du Bloc, Lyon',
        disciplines: ['bloc', 'voie'],
        services: ['douches'],
        website: 'https://bloc.example',
        weekdayHours: '9h–23h',
        weekendHours: '10h–20h',
        entryPrice: '15 €',
        subscriptionPrice: '55 €',
        minimumLevel: '4a',
        maximumLevel: '8a',
        attendance: 'moderee',
      }}
    />)

    expect(screen.getByRole('heading', { name: 'Corriger Bloc Factory' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Parking' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Adresse complète')).toHaveValue('10 rue du Bloc, Lyon')
    expect(screen.getByLabelText('Horaires semaine')).toHaveValue('9h–23h')
    expect(screen.getByLabelText('Tarif entrée')).toHaveValue('15 €')
  })
})
