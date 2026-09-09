import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './button'
import { createRef } from 'react'

describe('Button', () => {
  it('uses Flow styling for primary actions and preserves their ref', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Button ref={ref} type="submit" size="sm">
        Publier
      </Button>
    )
    const button = screen.getByRole('button', { name: 'Publier' })
    expect(button).toHaveAttribute('data-slot', 'flow-button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(ref.current).toBe(button)
  })

  it.each(['secondary', 'ghost', 'destructive'] as const)('keeps %s actions unanimated', (variant) => {
    render(<Button variant={variant}>Action secondaire</Button>)
    expect(screen.getByRole('button')).not.toHaveAttribute('data-slot', 'flow-button')
  })

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
    render(
      <Button isLoading loadingText="Enregistrement">
        Enregistrer
      </Button>
    )

    expect(screen.getByRole('button', { name: 'Enregistrement' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Enregistrement' })).toHaveAttribute('aria-busy', 'true')
  })
})
