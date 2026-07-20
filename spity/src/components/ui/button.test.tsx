import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './button'

describe('Button', () => {
  it('runs the requested action from the keyboard', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()

    render(<Button onClick={onClick}>Enregistrer</Button>)
    await user.tab()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('button', { name: 'Enregistrer' })).toHaveFocus()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('exposes and locks its loading state', () => {
    render(<Button isLoading loadingText="Enregistrement">Enregistrer</Button>)

    expect(screen.getByRole('button', { name: 'Enregistrement' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Enregistrement' })).toHaveAttribute('aria-busy', 'true')
  })
})
