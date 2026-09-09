import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegistrationForm from './registration-form'

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush, refresh: mockRefresh }) }))

const password = 'SpityTest42!'
const mockFetch = jest.fn()
const originalFetch = global.fetch

it('places the login link after the registration form', () => {
  render(<RegistrationForm />)
  const link = screen.getByRole('link', { name: 'Se connecter' })
  expect(link).toHaveAttribute('href', '/login')
  expect(screen.getByText('Déjà un compte ?')).toBeVisible()
  const submit = screen.getByRole('button', { name: 'Créer mon compte' })
  expect(submit.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
})

beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = mockFetch
})
afterAll(() => {
  global.fetch = originalFetch
})

async function fillForm(confirmation = password) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Email'), 'test@example.fr')
  await user.type(screen.getByLabelText('Mot de passe'), password)
  await user.type(screen.getByLabelText('Confirmer le mot de passe'), confirmation)
  return user
}

it('prevents submission when passwords differ and focuses the confirmation', async () => {
  render(<RegistrationForm />)
  const user = await fillForm('Different42!')
  await user.click(screen.getByRole('button', { name: 'Créer mon compte' }))
  expect(await screen.findByText('Les mots de passe ne correspondent pas')).toBeVisible()
  expect(screen.getByLabelText('Confirmer le mot de passe')).toHaveFocus()
  expect(mockFetch).not.toHaveBeenCalled()
})

it.each(['grimpeur', 'club'] as const)(
  'sends only account fields for %s and continues to onboarding',
  async (role) => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        user: {
          id: '88888888-8888-4888-8888-888888888888',
          email: 'test@example.fr',
          role,
          avatarUrl: null,
          emailVerified: false,
        },
      }),
    })
    render(<RegistrationForm />)
    const user = await fillForm()
    await user.click(screen.getByRole('radio', { name: role === 'club' ? 'Club' : 'Grimpeur' }))
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/app'))
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/auth/register',
      expect.objectContaining({
        body: JSON.stringify({ email: 'test@example.fr', password, role }),
      })
    )
    expect(mockRefresh).toHaveBeenCalled()
  }
)

it('supports keyboard profile selection and password visibility', async () => {
  render(<RegistrationForm />)
  const user = userEvent.setup()
  screen.getByRole('radio', { name: 'Grimpeur' }).focus()
  await user.keyboard('{ArrowRight}')
  expect(screen.getByRole('radio', { name: 'Club' })).toBeChecked()
  expect(screen.getByText(/Ensuite : présentez votre club/)).toBeVisible()
  const toggle = screen.getByRole('button', { name: 'Afficher les mots de passe' })
  toggle.focus()
  await user.keyboard('{Enter}')
  expect(screen.getByLabelText('Mot de passe')).toHaveAttribute('type', 'text')
  expect(screen.getByLabelText('Confirmer le mot de passe')).toHaveAttribute('type', 'text')
})

it('updates password criteria without sending a request', async () => {
  render(<RegistrationForm />)
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Mot de passe'), password)
  expect(screen.getAllByText('Critère rempli :')).toHaveLength(5)
  expect(mockFetch).not.toHaveBeenCalled()
})

it.each(['network', 'server', 'malformed'] as const)(
  'keeps the form retryable after a %s error',
  async (failure) => {
    if (failure === 'network') mockFetch.mockRejectedValue(new Error('offline'))
    else
      mockFetch.mockResolvedValue({
        ok: failure === 'malformed',
        json: async () => ({ error: 'Email déjà utilisé' }),
      })
    render(<RegistrationForm />)
    const user = await fillForm()
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }))
    expect(await screen.findByRole('alert')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Créer mon compte' })).toBeEnabled()
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.fr')
    expect(mockPush).not.toHaveBeenCalled()
  }
)
