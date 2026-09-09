import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { FlowButton } from './flow-button'

expect.extend(toHaveNoViolations)

it('defaults to a non-submitting button and accepts keyboard activation', async () => {
  const onClick = jest.fn()
  render(<FlowButton text="Continuer" onClick={onClick} />)
  const button = screen.getByRole('button', { name: 'Continuer' })
  expect(button).toHaveAttribute('type', 'button')
  button.focus()
  await userEvent.setup().keyboard('{Enter}')
  expect(onClick).toHaveBeenCalledTimes(1)
})

it('preserves native submit behavior', () => {
  const submit = jest.fn((event) => event.preventDefault())
  render(
    <form onSubmit={submit}>
      <FlowButton type="submit" text="Enregistrer" />
    </form>
  )
  fireEvent.click(screen.getByRole('button'))
  expect(submit).toHaveBeenCalledTimes(1)
})

it('renders navigation as a link without a nested button', () => {
  render(<FlowButton href="/register" text="Rejoindre Spity" aria-label="Créer votre compte Spity" />)
  expect(screen.getByRole('link', { name: 'Créer votre compte Spity' })).toHaveAttribute('href', '/register')
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

it.each([false, true])('prevents activation when disabled (loading=%s)', async (isLoading) => {
  const onClick = jest.fn()
  render(
    <FlowButton
      text="Enregistrer"
      disabled={!isLoading}
      isLoading={isLoading}
      loadingText="Enregistrement…"
      onClick={onClick}
    />
  )
  const button = screen.getByRole('button')
  expect(button).toBeDisabled()
  if (isLoading) {
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAccessibleName('Enregistrement…')
  }
  await userEvent.setup().click(button)
  expect(onClick).not.toHaveBeenCalled()
})

it('has no detectable accessibility violations across variants and loading', async () => {
  const { container } = render(
    <main>
      <FlowButton text="Primaire" />
      <FlowButton text="Clair" variant="light" />
      <FlowButton text="Lien" variant="outline" href="/login" />
      <FlowButton isLoading />
    </main>
  )
  expect(await axe(container)).toHaveNoViolations()
})
