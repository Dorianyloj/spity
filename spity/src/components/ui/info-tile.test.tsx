import { render, screen } from '@testing-library/react'
import { MapPin } from 'lucide-react'
import InfoTile from './info-tile'

describe('InfoTile', () => {
  it('renders an icon and gives precedence to the value prop', () => {
    render(
      <InfoTile
        data-testid="tile"
        className="custom-class"
        icon={MapPin}
        label="Lieu"
        value="Fontainebleau"
      >
        Valeur de secours
      </InfoTile>
    )

    expect(screen.getByTestId('tile')).toHaveClass('custom-class')
    expect(screen.getByText('Lieu')).toBeInTheDocument()
    expect(screen.getByText('Fontainebleau')).toBeInTheDocument()
    expect(screen.queryByText('Valeur de secours')).not.toBeInTheDocument()
    expect(screen.getByTestId('tile').querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders children when no value or icon is provided', () => {
    render(<InfoTile label="Niveau">7a</InfoTile>)

    expect(screen.getByText('Niveau')).toBeInTheDocument()
    expect(screen.getByText('7a')).toBeInTheDocument()
  })
})
