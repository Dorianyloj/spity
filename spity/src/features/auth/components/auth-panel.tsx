'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, LogIn, Mail, ShieldCheck, UserPlus, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import BrandMark from '@/components/brand/brand-mark'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, Input } from '@/components/ui'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/lib/validators'
import { authSuccessResponseSchema } from '../schemas'

type AuthPanelProps = {
  mode: 'login' | 'register'
}

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

export default function AuthPanel({ mode }: AuthPanelProps) {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: emptyLoginValues,
  })

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: emptyRegisterValues,
  })

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
      loginForm.reset(emptyLoginValues)
      router.push('/app')
      router.refresh()
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
      registerForm.reset(emptyRegisterValues)
      router.push('/app')
      router.refresh()
    }
  }

  const isLogin = mode === 'login'
  const passwordType = showPassword ? 'text' : 'password'

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1fr_480px]">
        <section
          className="relative hidden overflow-hidden bg-cover bg-center text-white lg:block"
          style={{ backgroundImage: makePanelBackground(isLogin ? brandAssets.cragClose : brandAssets.indoor) }}
        >
          <div className="absolute inset-0 bg-[#173236]/20" />
          <div className="relative flex h-full flex-col justify-between p-10">
            <Link href="/" className="flex items-center gap-3">
              <BrandMark className="bg-white/6 shadow-xl shadow-black/20 ring-1 ring-white/12" priority size={48} tone="dark" />
              <span className="text-2xl font-bold tracking-normal">Spity</span>
            </Link>

            <div className="max-w-xl space-y-6">
              <Badge className="bg-primary text-primary-foreground" variant="default">Communauté escalade</Badge>
              <p className="text-5xl font-bold leading-tight">
                Trouvez vos partenaires et gardez vos sessions au même endroit.
              </p>
              <p className="text-lg text-white/78">
                Profils grimpeurs, clubs, lieux et événements structurés pour une pratique plus simple.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <UsersRound className="mb-3 text-coral" size={22} />
                Matching local
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <ShieldCheck className="mb-3 text-coral" size={22} />
                Sessions fiables
              </div>
              <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                <Lock className="mb-3 text-coral" size={22} />
                Compte sécurisé
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center bg-background px-4 py-8 sm:px-8">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground lg:hidden">
                <BrandMark className="bg-white/6 ring-1 ring-white/12" size={36} tone="dark" />
                <span>Spity</span>
              </Link>
              <Link
                href={isLogin ? '/register' : '/login'}
                className="text-sm font-semibold text-[#376b31] underline-offset-4 hover:underline"
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </Link>
            </div>

            <Card hover={false}>
              <CardHeader>
                <h1 className="text-lg font-bold leading-tight sm:text-xl">
                  {isLogin ? 'Connexion' : 'Inscription'}
                </h1>
                <CardDescription>
                  {isLogin ? 'Accédez à votre compte Spity.' : 'Créez votre compte et complétez votre profil.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLogin ? (
                  <form className="space-y-4" onSubmit={loginForm.handleSubmit(submitLogin)}>
                    <Input
                      label="Email"
                      type="email"
                      autoComplete="email"
                      error={loginForm.formState.errors.email?.message}
                      icon={<Mail size={18} />}
                      {...loginForm.register('email')}
                    />
                    <Input
                      label="Mot de passe"
                      type={passwordType}
                      autoComplete="current-password"
                      error={loginForm.formState.errors.password?.message}
                      icon={<Lock size={18} />}
                      action={
                        <button
                          type="button"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                          onClick={() => setShowPassword((value) => !value)}
                          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                      {...loginForm.register('password')}
                    />
                    {feedback && <p className="text-sm text-destructive">{feedback}</p>}
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
                      icon={<Mail size={18} />}
                      {...registerForm.register('email')}
                    />
                    <Input
                      label="Mot de passe"
                      type={passwordType}
                      autoComplete="new-password"
                      error={registerForm.formState.errors.password?.message}
                      icon={<Lock size={18} />}
                      action={
                        <button
                          type="button"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                          onClick={() => setShowPassword((value) => !value)}
                          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                      {...registerForm.register('password')}
                    />
                    <fieldset className="space-y-2">
                      <legend className="text-sm font-medium text-foreground">Type de profil</legend>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm text-foreground">
                          <input type="radio" value="grimpeur" {...registerForm.register('role')} />
                          Grimpeur
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm text-foreground">
                          <input type="radio" value="club" {...registerForm.register('role')} />
                          Club
                        </label>
                      </div>
                    </fieldset>
                    {feedback && <p className="text-sm text-destructive">{feedback}</p>}
                    <Button type="submit" className="w-full" isLoading={registerForm.formState.isSubmitting}>
                      <UserPlus size={18} />
                      Créer mon compte
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
