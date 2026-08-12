import { redirect } from 'next/navigation'
import AuthPage from './auth/page'
import LoginPage from './login/page'
import ProfileOnboardingPage from './profile/onboarding/page'
import RegisterPage from './register/page'

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

describe('routing pages', () => {
  it('keeps the legacy authentication entry point on the login page', () => {
    AuthPage()

    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('selects the expected authentication panel mode', () => {
    expect(LoginPage().props.mode).toBe('login')
    expect(RegisterPage().props.mode).toBe('register')
  })

  it('opens the profile form in onboarding mode', () => {
    expect(ProfileOnboardingPage().props.mode).toBe('onboarding')
  })
})
