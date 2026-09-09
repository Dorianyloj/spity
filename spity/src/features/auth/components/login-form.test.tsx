import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from './login-form'

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush, refresh: mockRefresh }) }))
const mockFetch = jest.fn()
const originalFetch = global.fetch

beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = mockFetch
})
afterAll(() => {
  global.fetch = originalFetch
})

async function fillForm() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Email'), 'test@example.fr')
  await user.type(screen.getByLabelText('Mot de passe'), 'SpityTest42!')
  return user
}

it('validates required fields and focuses the first error without a request', async () => {
  render(<LoginForm />)
  await userEvent.setup().click(screen.getByRole('button', { name: 'Se connecter' }))
  await waitFor(() => expect(screen.getByLabelText('Email')).toHaveFocus())
  expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  expect(mockFetch).not.toHaveBeenCalled()
})

it.each(['grimpeur', 'club'] as const)('logs in a %s and redirects to the app', async (role) => {
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
  render(<LoginForm />)
  const user = await fillForm()
  await user.click(screen.getByRole('button', { name: 'Se connecter' }))
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/app'))
  expect(mockRefresh).toHaveBeenCalled()
  expect(mockFetch).toHaveBeenCalledWith(
    '/api/auth/login',
    expect.objectContaining({
      body: JSON.stringify({ email: 'test@example.fr', password: 'SpityTest42!' }),
    })
  )
})

it.each(['network', 'server', 'malformed'] as const)(
  'keeps values and permits retry after a %s error',
  async (failure) => {
    if (failure === 'network') mockFetch.mockRejectedValue(new Error('offline'))
    else
      mockFetch.mockResolvedValue({
        ok: failure === 'malformed',
        json: async () => ({ error: 'Identifiants invalides' }),
      })
    render(<LoginForm />)
    const user = await fillForm()
    await user.click(screen.getByRole('button', { name: 'Se connecter' }))
    expect(await screen.findByRole('alert')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeEnabled()
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.fr')
    expect(mockPush).not.toHaveBeenCalled()
  }
)
