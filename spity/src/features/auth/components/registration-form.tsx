'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Check, Circle, Eye, EyeOff, Lock, Mail, Mountain, UsersRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/class-names'
import { registerSchema } from '@/lib/validators'
import { registrationFormSchema, type RegistrationFormInput } from '../registration-schema'
import { authSuccessResponseSchema } from '../schemas'

const profileOptions = [
  {
    value: 'grimpeur',
    label: 'Grimpeur',
    description: 'Trouvez vos partenaires et partagez vos sessions.',
    icon: Mountain,
  },
  {
    value: 'club',
    label: 'Club',
    description: 'Présentez votre club et organisez vos événements.',
    icon: UsersRound,
  },
] as const

const passwordRules = [
  { label: '8 caractères minimum', test: (value: string) => value.length >= 8 },
  { label: 'Une majuscule', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Une minuscule', test: (value: string) => /[a-z]/.test(value) },
  { label: 'Un chiffre', test: (value: string) => /[0-9]/.test(value) },
  { label: 'Un caractère spécial', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]

export default function RegistrationForm() {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [sending, setSending] = useState(false)
  const form = useForm<RegistrationFormInput>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', role: 'grimpeur' },
  })
  const password = useWatch({ control: form.control, name: 'password' })
  const role = useWatch({ control: form.control, name: 'role' })
  const { errors, isSubmitting } = form.formState

  const submit = async (values: RegistrationFormInput) => {
    setFeedback(null)
    setSending(true)
    try {
      // Keep confirmation in the browser and preserve the existing API contract.
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerSchema.parse(values)),
      })
      const data: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const error = z.object({ error: z.string() }).safeParse(data)
        setFeedback(error.success ? error.data.error : 'L’inscription a échoué. Réessayez.')
        return
      }
      if (!authSuccessResponseSchema.safeParse(data).success) {
        setFeedback(
          'La création du compte n’a pas pu être confirmée. Essayez de vous connecter ou réessayez.'
        )
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
        <ol
          aria-label="Étapes de l’inscription"
          className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm"
        >
          <li aria-current="step" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-full bg-[#173236] text-xs text-white">
              1
            </span>
            Votre compte
          </li>
          <li className="flex items-center gap-2 text-muted-foreground">
            <span className="flex size-7 items-center justify-center rounded-full border border-border text-xs">
              2
            </span>
            Votre profil
          </li>
        </ol>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Inscription</h1>
        <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
          Votre prochaine session commence ici. Créez votre compte, puis complétez votre profil à votre
          rythme.
        </p>
      </div>

      <form className="space-y-7" onSubmit={form.handleSubmit(submit)} noValidate>
        <fieldset disabled={sending} className="space-y-3">
          <legend className="mb-1 font-semibold">Comment souhaitez-vous rejoindre Spity ?</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {profileOptions.map(({ value, label, description, icon: Icon }) => (
              <label
                key={value}
                className={cn(
                  'relative flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors focus-within:ring-2 focus-within:ring-[#376b31] focus-within:ring-offset-2',
                  role === value
                    ? 'border-[#376b31] bg-[#e8f0df]'
                    : 'border-border bg-card hover:border-[#376b31]/50'
                )}
              >
                <input
                  type="radio"
                  value={value}
                  aria-label={label}
                  aria-describedby={`profile-${value}-description`}
                  className="sr-only"
                  {...form.register('role')}
                />
                <Icon aria-hidden="true" size={22} className="mt-0.5 shrink-0 text-[#376b31]" />
                <span className="pr-5">
                  <span className="block font-semibold">{label}</span>
                  <span
                    id={`profile-${value}-description`}
                    className="mt-1 block text-sm leading-relaxed text-muted-foreground"
                  >
                    {description}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute right-3 top-4 flex size-4 items-center justify-center rounded-full border',
                    role === value ? 'border-[#376b31] bg-[#376b31] text-white' : 'border-muted-foreground'
                  )}
                >
                  {role === value && <Check size={12} />}
                </span>
              </label>
            ))}
          </div>
          {errors.role && (
            <p className="text-sm text-destructive" role="alert">
              {errors.role.message}
            </p>
          )}
        </fieldset>

        <fieldset
          disabled={sending}
          className="space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <legend className="sr-only">Vos identifiants</legend>
          <div>
            <h2 className="font-semibold">Vos identifiants</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tous les champs ci-dessous sont obligatoires.
            </p>
          </div>
          <Input
            id="register-email"
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
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              id="register-password"
              className="bg-[#f8fbf5]"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              aria-describedby={cn('password-requirements', errors.password && 'register-password-error')}
              error={errors.password?.message}
              icon={<Lock size={18} />}
              action={
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Masquer les mots de passe' : 'Afficher les mots de passe'}
                  aria-controls="register-password register-confirm-password"
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
              {...form.register('password')}
            />
            <Input
              id="register-confirm-password"
              className="bg-[#f8fbf5]"
              label="Confirmer le mot de passe"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              error={errors.confirmPassword?.message}
              {...form.register('confirmPassword')}
            />
          </div>
          <div id="password-requirements" className="border-t border-border pt-4">
            <p className="mb-3 text-xs font-medium text-muted-foreground">
              Votre mot de passe doit contenir :
            </p>
            <ul className="grid gap-x-4 gap-y-2 text-xs sm:grid-cols-2">
              {passwordRules.map(({ label, test }) => {
                const fulfilled = test(password)
                const Icon = fulfilled ? Check : Circle
                return (
                  <li
                    key={label}
                    className={cn(
                      'flex items-center gap-2',
                      fulfilled ? 'text-[#376b31]' : 'text-muted-foreground'
                    )}
                  >
                    <Icon aria-hidden="true" size={14} className="shrink-0" />
                    <span className="sr-only">
                      {fulfilled ? 'Critère rempli : ' : 'Critère non rempli : '}
                    </span>
                    {label}
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              72 octets maximum (certains caractères accentués et emojis comptent pour plusieurs octets).
            </p>
          </div>
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
          <Button type="submit" className="min-h-12 w-full justify-between px-5" isLoading={isSubmitting}>
            Créer mon compte
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
          <p className="text-center text-sm leading-relaxed text-muted-foreground">
            {role === 'club'
              ? 'Ensuite : présentez votre club, sa localisation et ses activités.'
              : 'Ensuite : renseignez vos disciplines, vos niveaux et votre matériel.'}
          </p>
        </div>
      </form>
    </div>
  )
}
