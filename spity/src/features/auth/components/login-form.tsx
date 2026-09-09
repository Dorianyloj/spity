'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input } from '@/components/ui'
import { loginSchema, type LoginInput } from '@/lib/validators'
import { authErrorResponseSchema, authSuccessResponseSchema } from '../schemas'

export default function LoginForm() {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [sending, setSending] = useState(false)
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  const { errors, isSubmitting } = form.formState

  const submit = async (values: LoginInput) => {
    setFeedback(null)
    setSending(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const error = authErrorResponseSchema.safeParse(data)
        setFeedback(error.success ? error.data.error : 'La connexion a échoué. Réessayez.')
        return
      }
      if (!authSuccessResponseSchema.safeParse(data).success) {
        setFeedback('La connexion n’a pas pu être confirmée. Réessayez.')
        return
      }
      form.reset()
      router.push('/app')
      router.refresh()
    } catch {
      setFeedback('Connexion impossible. Vérifiez votre connexion internet et réessayez.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-semibold text-[#376b31]">Heureux de vous retrouver</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Connexion</h1>
        <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
          Reprenez là où vous en étiez. Connectez-vous pour retrouver vos partenaires et organiser vos
          prochaines sessions.
        </p>
      </div>

      <form className="space-y-7" onSubmit={form.handleSubmit(submit)} noValidate>
        <fieldset
          disabled={sending}
          className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <legend className="sr-only">Vos identifiants</legend>
          <div>
            <h2 className="font-semibold">Vos identifiants</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Utilisez l’adresse email associée à votre compte.
            </p>
          </div>
          <Input
            id="login-email"
            className="bg-[#f8fbf5]"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            required
            error={errors.email?.message}
            icon={<Mail size={18} />}
            {...form.register('email')}
          />
          <Input
            id="login-password"
            className="bg-[#f8fbf5]"
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            error={errors.password?.message}
            icon={<Lock size={18} />}
            action={
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                aria-controls="login-password"
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            {...form.register('password')}
          />
        </fieldset>

        <div className="space-y-4">
          {feedback && (
            <p
              className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive"
              role="alert"
            >
              {feedback}
            </p>
          )}
          <Button
            type="submit"
            className="min-h-12 w-full justify-between px-5"
            isLoading={isSubmitting}
            loadingText="Connexion en cours…"
          >
            Se connecter
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            Grimpeur ou club, retrouvez votre espace avec le même formulaire.
          </p>
        </div>
      </form>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 border-t border-border pt-6">
        <p className="text-sm text-muted-foreground">Pas encore de compte ?</p>
        <Link
          href="/register"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#376b31]/40 px-5 py-2 text-sm font-semibold text-[#376b31] transition-colors hover:border-[#376b31] hover:bg-[#e8f0df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#376b31] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Créer un compte
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </div>
  )
}
