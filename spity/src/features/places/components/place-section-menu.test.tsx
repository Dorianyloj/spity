import { render, screen } from '@testing-library/react'
import PlaceSectionMenu from './place-section-menu'

describe('PlaceSectionMenu', () => {
  it('renders accessible links to each section of a crag detail', () => {
    render(<PlaceSectionMenu activeSection="routes" sections={[
      { href: '?section=routes', label: 'Voies', section: 'routes' },
      { href: '?section=photos', label: 'Photos', section: 'photos' },
      { href: '?section=reports', label: 'Signalements', section: 'reports' },
      { href: '?section=contribute', label: 'Contribuer', section: 'contribute' },
    ]} />)

    expect(screen.getByRole('navigation', { name: 'Sections de la fiche' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voies' })).toHaveAttribute('href', '?section=routes')
    expect(screen.getByRole('link', { name: 'Voies' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Photos' })).toHaveAttribute('href', '?section=photos')
    expect(screen.getByRole('link', { name: 'Signalements' })).toHaveAttribute('href', '?section=reports')
    expect(screen.getByRole('link', { name: 'Contribuer' })).toHaveAttribute('href', '?section=contribute')
  })
})
