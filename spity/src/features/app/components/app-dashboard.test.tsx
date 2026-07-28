import { render, screen } from '@testing-library/react'
import type { AuthUser } from '@/features/auth/schemas'
import type { FeedPost } from '@/features/feed/schemas'
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

const posts: FeedPost[] = [
  {
    id: '22222222-2222-4222-8222-222222222222',
    author: { name: 'Lina M.', avatarUrl: null },
    context: 'Arkose Lyon · 6b',
    content: 'Session bloc ce soir.',
    tag: 'Session',
    meta: 'Il y a 18 min',
    imageUrl: null,
    likeCount: 24,
    commentCount: 6,
    comments: [],
    likedByViewer: false,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    author: { name: 'Club Alpin Lyon', avatarUrl: null },
    context: 'Curis-au-Mont-d’Or · 6a',
    content: 'Sortie falaise samedi matin.',
    tag: 'Événement',
    meta: 'Il y a 1 h',
    imageUrl: null,
    likeCount: 48,
    commentCount: 12,
    comments: [],
    likedByViewer: false,
  },
]

describe('AppDashboard', () => {
  it('renders a focused community feed without the former side panels', () => {
    render(<AppDashboard posts={posts} user={grimpeurUser} />)

    expect(screen.getByRole('heading', { name: 'Fil d’actualité' })).toBeInTheDocument()
    expect(screen.getByText('Lina M.')).toBeInTheDocument()
    expect(screen.getByText('Club Alpin Lyon')).toBeInTheDocument()
    expect(screen.getByText('Session')).toBeInTheDocument()
    expect(screen.queryByText('Profil actif')).not.toBeInTheDocument()
    expect(screen.queryByText('Événements proches')).not.toBeInTheDocument()
    expect(screen.queryByText('Lieux populaires')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Partenaires' })).toHaveAttribute('href', '/app/matching')
  })

  it('keeps club navigation scoped to club permissions', () => {
    const clubUser: AuthUser = { ...grimpeurUser, role: 'club', email: 'club@example.com' }

    render(<AppDashboard posts={posts} user={clubUser} />)

    expect(screen.getByRole('heading', { name: 'Fil d’actualité' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Partenaires' })).not.toBeInTheDocument()
  })
})
