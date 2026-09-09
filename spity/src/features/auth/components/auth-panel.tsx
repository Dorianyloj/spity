'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, LogIn, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import BrandMark from '@/components/brand/brand-mark'
import { Button, Card, CardContent, CardDescription, CardHeader, Input } from '@/components/ui'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'
import { cn } from '@/lib/class-names'
import { loginSchema, type LoginInput } from '@/lib/validators'
import { authSuccessResponseSchema } from '../schemas'
import RegistrationForm from './registration-form'

type AuthPanelProps = {
  mode: 'login' | 'register'
}

const emptyLoginValues: LoginInput = {
  email: '',
  password: '',
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

  const isLogin = mode === 'login'
  const passwordType = showPassword ? 'text' : 'password'

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        className={cn(
          'grid min-h-screen',
          isLogin ? 'lg:grid-cols-[1fr_480px]' : 'lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]'
        )}
      >
        <section
          className="relative hidden overflow-hidden bg-cover bg-center text-white lg:sticky lg:top-0 lg:block lg:h-screen"
          style={{
            backgroundImage: makePanelBackground(isLogin ? brandAssets.cragClose : brandAssets.indoor),
          }}
        >
          <div className="absolute inset-0 bg-[#173236]/20" />
          <div className="relative flex h-full flex-col p-10 xl:p-14">
            <Link href="/" aria-label="Accueil Spity" className="flex min-h-11 w-fit items-center rounded-lg">
              <BrandMark priority size={48} tone="dark" />
            </Link>

            <div className="flex flex-1 items-center py-12">
              <div className="max-w-xl space-y-6">
                <p className="text-4xl font-bold leading-tight xl:text-5xl">
                  Trouvez vos partenaires et gardez vos sessions au même endroit.
                </p>
                <p className="max-w-md text-lg leading-relaxed text-white/80">
                  Profils grimpeurs, clubs, lieux et événements structurés pour une pratique plus simple.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className={cn('flex items-center bg-background px-4 py-8 sm:px-8', !isLogin && 'lg:px-10 xl:px-16')}
        >
          <div className={cn('mx-auto w-full space-y-8', isLogin ? 'max-w-md' : 'max-w-2xl')}>
            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <Link
                href="/"
                aria-label="Accueil Spity"
                className="flex min-h-11 items-center rounded-lg lg:hidden"
              >
                <BrandMark size={48} tone="light" />
              </Link>
              <Link
                href={isLogin ? '/register' : '/login'}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-[#376b31] underline-offset-4 hover:underline"
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </Link>
            </div>

            {isLogin ? (
              <Card hover={false}>
                <CardHeader>
                  <h1 className="text-lg font-bold leading-tight sm:text-xl">Connexion</h1>
                  <CardDescription>Accédez à votre compte Spity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={loginForm.handleSubmit(submitLogin)} noValidate>
                    <Input
                      label="Email"
                      type="email"
                      autoComplete="email"
                      error={loginForm.formState.errors.email?.message}
                      icon={<Mail size={18} />}
                      {...loginForm.register('email')}
                    />
                    <Input
                      id="login-password"
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
                          aria-controls="login-password"
                          aria-pressed={showPassword}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      }
                      {...loginForm.register('password')}
                    />
                    {feedback && (
                      <p className="text-sm text-destructive" role="alert">
                        {feedback}
                      </p>
                    )}
                    <Button type="submit" className="w-full" isLoading={loginForm.formState.isSubmitting}>
                      <LogIn size={18} />
                      Se connecter
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <RegistrationForm />
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
