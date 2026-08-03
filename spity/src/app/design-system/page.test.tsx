import { render, screen } from '@testing-library/react'
import DesignSystemPage from './page'

describe('DesignSystemPage', () => {
  it('renders the reusable component catalogue', () => {
    render(<DesignSystemPage />)

    expect(screen.getByRole('heading', { level: 1, name: 'Spity Design System' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Boutons' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Primaire' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Chargement' })).toBeDisabled()
    expect(screen.getByText('Pierre Durand')).toBeInTheDocument()
  })
})
