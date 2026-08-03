import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import AuthPanel from '@/features/auth/components/auth-panel'
import EventForm from '@/features/events/components/event-form'
import FilterToolbar from './ui/filter-toolbar'
import Input from './ui/input'
import Textarea from './ui/textarea'

expect.extend(toHaveNoViolations)

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('accessibility checks', () => {
  it('has no detectable violation in the shared form controls', async () => {
    const { container } = render(
      <div>
        <Input label="Adresse électronique" error="Adresse invalide" />
        <Textarea label="Présentation" error="Présentation trop longue" />
        <FilterToolbar
          countLabel="3 résultats"
          filters={[
            {
              label: 'Discipline',
              onChange: jest.fn(),
              options: [{ label: 'Bloc', value: 'bloc' }],
              value: 'bloc',
            },
          ]}
          onQueryChange={jest.fn()}
          query=""
        />
      </div>
    )

    expect(await axe(container)).toHaveNoViolations()
  })

  it.each(['login', 'register'] as const)('has no detectable violation in the %s panel', async (mode) => {
    const { container } = render(<AuthPanel mode={mode} />)

    expect(await axe(container)).toHaveNoViolations()
  })

  it('operates the password visibility control from the keyboard', async () => {
    const user = userEvent.setup()
    render(<AuthPanel mode="login" />)
    const passwordInput = screen.getByLabelText('Mot de passe')
    const visibilityButton = screen.getByRole('button', { name: 'Afficher le mot de passe' })

    visibilityButton.focus()
    await user.keyboard('{Enter}')

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(visibilityButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('has no detectable violation in the event form', async () => {
    const { container } = render(<EventForm onSaved={jest.fn()} />)

    expect(await axe(container)).toHaveNoViolations()
  })
})
