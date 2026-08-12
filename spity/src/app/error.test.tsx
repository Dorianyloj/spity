import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorPage from './error'

describe('ErrorPage', () => {
  it('explains the failure and lets the user retry or return home', async () => {
    const user = userEvent.setup()
    const reset = jest.fn()

    render(<ErrorPage error={new Error('test failure')} reset={reset} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'La page n’a pas pu être chargée' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Revenir à l’accueil' })).toHaveAttribute('href', '/')

    await user.click(screen.getByRole('button', { name: 'Réessayer' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
