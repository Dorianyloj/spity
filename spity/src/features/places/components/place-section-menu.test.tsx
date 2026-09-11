import { render, screen } from '@testing-library/react'
import PlaceSectionMenu from './place-section-menu'

describe('PlaceSectionMenu', () => {
  it('renders accessible links to each section of a crag detail', () => {
    render(<PlaceSectionMenu sections={[
      { href: '#contribuer', label: 'Contribuer', section: 'contribute' },
      { href: '#voies', label: 'Voies', section: 'routes' },
      { href: '#photos', label: 'Photos', section: 'photos' },
      { href: '#signalements', label: 'Signalements', section: 'reports' },
    ]} />)

    expect(screen.getByRole('navigation', { name: 'Sections de la fiche' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contribuer' })).toHaveAttribute('href', '#contribuer')
    expect(screen.getByRole('link', { name: 'Voies' })).toHaveAttribute('href', '#voies')
    expect(screen.getByRole('link', { name: 'Photos' })).toHaveAttribute('href', '#photos')
    expect(screen.getByRole('link', { name: 'Signalements' })).toHaveAttribute('href', '#signalements')
  })
})
