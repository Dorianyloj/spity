import { render, screen } from '@testing-library/react'
import EmptyState from './empty-state'

describe('EmptyState', () => {
  it('exposes its visual title as a level-two heading', () => {
    render(
      <EmptyState
        title="Aucun profil ne correspond"
        description="Modifiez les filtres de recherche."
      />
    )

    expect(screen.getByRole('heading', { level: 2, name: 'Aucun profil ne correspond' })).toBeInTheDocument()
    expect(screen.getByText('Modifiez les filtres de recherche.')).toBeInTheDocument()
  })
})
