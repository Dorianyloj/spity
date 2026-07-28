import { render, screen } from '@testing-library/react'
import type { AuthUser } from '@/features/auth/schemas'
import AppDashboard from './app-dashboard'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

const grimpeurUser: AuthUser = {
  id: '11111111-1111-4111-8111-111111111111',
  email: 'lina@example.com',
  role: 'grimpeur',
  avatarUrl: null,
  emailVerified: true,
}

describe('AppDashboard', () => {
  it('renders a focused community feed without the former side panels', () => {
    render(<AppDashboard user={grimpeurUser} />)

    expect(screen.getByRole('heading', { name: 'Fil d’actualité' })).toBeInTheDocument()
    expect(screen.getByText('Lina M.')).toBeInTheDocument()
    expect(screen.getByText('Club Alpin Lyon')).toBeInTheDocument()
    expect(screen.getByText('Nassim B.')).toBeInTheDocument()
    expect(screen.getByText('Chloé R.')).toBeInTheDocument()
    expect(screen.getByText('Recherche partenaire')).toBeInTheDocument()
    expect(screen.queryByText('Profil actif')).not.toBeInTheDocument()
    expect(screen.queryByText('Événements proches')).not.toBeInTheDocument()
    expect(screen.queryByText('Lieux populaires')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Partenaires' })).toHaveAttribute('href', '/app/matching')
  })

  it('keeps club navigation scoped to club permissions', () => {
    const clubUser: AuthUser = { ...grimpeurUser, role: 'club', email: 'club@example.com' }

    render(<AppDashboard user={clubUser} />)

    expect(screen.getByRole('heading', { name: 'Fil d’actualité' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Partenaires' })).not.toBeInTheDocument()
  })
})
