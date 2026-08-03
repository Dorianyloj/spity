import { render, screen } from '@testing-library/react'
import LandingPage from './page'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: React.HTMLAttributes<HTMLDivElement>) => <div>{children}</div>,
    h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => <h1>{children}</h1>,
    p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => <p>{children}</p>,
    section: ({ children, className, id }: React.HTMLAttributes<HTMLElement>) => <section className={className} id={id}>{children}</section>,
  },
  useInView: () => true,
}))

describe('LandingPage', () => {
  it('presents the product and its primary actions', () => {
    render(<LandingPage />)

    expect(screen.getByRole('heading', { level: 1, name: /spity/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Rejoindre Spity' })).toHaveAttribute('href', '/register')
    expect(screen.getByRole('link', { name: 'Voir la démo' })).toHaveAttribute('href', '/login')
    expect(screen.getByText('Trouver le bon partenaire')).toBeInTheDocument()
    expect(screen.getByText('Lire le terrain en direct')).toBeInTheDocument()
    expect(screen.getByText('Rejoindre les sorties locales')).toBeInTheDocument()
  })
})
