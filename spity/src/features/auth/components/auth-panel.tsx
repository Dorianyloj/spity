'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn, LogOut, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validators'
import { authStatusResponseSchema, authSuccessResponseSchema, type AuthUser } from '../schemas'

type AuthMode = 'login' | 'register'

const emptyLoginValues: LoginInput = {
  email: '',
  password: '',
}

const emptyRegisterValues: RegisterInput = {
  email: '',
  password: '',
  role: 'grimpeur',
}

const parseApiError = async (response: Response) => {
  const data: unknown = await response.json().catch(() => null)
  const errorSchema = z.object({ error: z.string() })
  const parsedError = errorSchema.safeParse(data)

  return parsedError.success ? parsedError.data.error : 'Une erreur est survenue'
}

export default function AuthPanel() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: emptyLoginValues,
  })

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: emptyRegisterValues,
  })

  const refreshSession = async () => {
    const response = await fetch('/api/auth/me', { cache: 'no-store' })
    const data: unknown = await response.json()
    const parsedData = authStatusResponseSchema.safeParse(data)

    if (parsedData.success) {
      setCurrentUser(parsedData.data.user)
    }
  }

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      const response = await fetch('/api/auth/me', { cache: 'no-store' })
      const data: unknown = await response.json()
      const parsedData = authStatusResponseSchema.safeParse(data)

      if (isMounted && parsedData.success) {
        setCurrentUser(parsedData.data.user)
      }
    }

    void loadSession()

    return () => {
      isMounted = false
    }
  }, [])

  const submitLogin = async (values: LoginInput) => {
    setFeedback(null)
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      return
    }

    const data: unknown = await response.json()
    const parsedData = authSuccessResponseSchema.safeParse(data)

    if (parsedData.success) {
      setCurrentUser(parsedData.data.user)
      setFeedback('Connexion réussie')
      loginForm.reset(emptyLoginValues)
    }
  }

  const submitRegister = async (values: RegisterInput) => {
    setFeedback(null)
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      return
    }

    const data: unknown = await response.json()
    const parsedData = authSuccessResponseSchema.safeParse(data)

    if (parsedData.success) {
      setCurrentUser(parsedData.data.user)
      setFeedback('Compte créé')
      registerForm.reset(emptyRegisterValues)
    }
  }

  const submitLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setCurrentUser(null)
    setFeedback('Déconnexion réussie')
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <main className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="space-y-3">
            <Badge variant="primary">Auth MVP</Badge>
            <h1 className="text-4xl font-bold text-foreground">Connexion Spity</h1>
            <p className="max-w-2xl text-muted-foreground">
              Créez un compte grimpeur ou club, connectez-vous, puis vérifiez la session active via le cookie HttpOnly.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Session active</CardTitle>
              <CardDescription>État retourné par l&apos;endpoint `/api/auth/me`.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentUser ? (
                <div className="rounded-lg border border-border bg-muted/40 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="success">Connecté</Badge>
                    <span className="font-medium">{currentUser.email}</span>
                    <Badge variant="secondary">{currentUser.role}</Badge>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
                  Aucun utilisateur connecté.
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" type="button" onClick={() => void refreshSession()}>
                  Rafraîchir
                </Button>
                <Button variant="ghost" type="button" onClick={() => void submitLogout()} disabled={!currentUser}>
                  <LogOut size={18} />
                  Déconnexion
                </Button>
              </div>

              {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex rounded-lg border border-border bg-muted p-1">
              <button
                type="button"
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'login' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
                onClick={() => setMode('login')}
              >
                Connexion
              </button>
              <button
                type="button"
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'register' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                }`}
                onClick={() => setMode('register')}
              >
                Inscription
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {mode === 'login' ? (
              <form className="space-y-4" onSubmit={loginForm.handleSubmit(submitLogin)}>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  autoComplete="current-password"
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                />
                <Button type="submit" className="w-full" isLoading={loginForm.formState.isSubmitting}>
                  <LogIn size={18} />
                  Se connecter
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={registerForm.handleSubmit(submitRegister)}>
                <Input
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={registerForm.formState.errors.email?.message}
                  {...registerForm.register('email')}
                />
                <Input
                  label="Mot de passe"
                  type="password"
                  autoComplete="new-password"
                  error={registerForm.formState.errors.password?.message}
                  {...registerForm.register('password')}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground" htmlFor="role">
                    Type de profil
                  </label>
                  <select id="role" className="spity-input" {...registerForm.register('role')}>
                    <option value="grimpeur">Grimpeur</option>
                    <option value="club">Club</option>
                  </select>
                </div>
                <Button type="submit" className="w-full" isLoading={registerForm.formState.isSubmitting}>
                  <UserPlus size={18} />
                  Créer le compte
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
