'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { createClubProfileBodySchema, createGrimpeurProfileBodySchema, profileMeResponseSchema } from '../schemas'
import type { CreateClubProfileBody, CreateGrimpeurProfileBody, ProfileMeResponse } from '../schemas'

type ProfileFormMode = 'onboarding' | 'settings'

type ProfileFormProps = {
  mode: ProfileFormMode
}

const disciplines = [
  { value: 'bloc', label: 'Bloc' },
  { value: 'voie', label: 'Voie' },
  { value: 'trad', label: 'Trad' },
]

const gear = [
  { value: 'chaussons', label: 'Chaussons' },
  { value: 'baudrier', label: 'Baudrier' },
  { value: 'corde', label: 'Corde' },
  { value: 'crashpad', label: 'Crashpad' },
]

const grades = ['4a', '4b', '4c', '5a', '5b', '5c', '6a', '6a+', '6b', '6b+', '6c', '6c+', '7a', '7a+', '7b', '7b+', '7c', '7c+', '8a', '8a+', '8b', '8b+', '8c', '8c+']

const grimpeurDefaultValues: CreateGrimpeurProfileBody = {
  disciplines: ['bloc'],
  niveaux: {
    bloc: '5a',
    voie: '5a',
    trad: '5a',
  },
  materiel: ['chaussons'],
}

const clubDefaultValues: CreateClubProfileBody = {
  nom: '',
  bio: '',
  location: '',
  ffmeNum: '',
}

const parseApiError = async (response: Response) => {
  const data: unknown = await response.json().catch(() => null)
  const errorSchema = z.object({ error: z.string() })
  const parsedError = errorSchema.safeParse(data)

  return parsedError.success ? parsedError.data.error : 'Une erreur est survenue'
}

const mergeGrimpeurDefaults = (profile: ProfileMeResponse['grimpeurProfile']): CreateGrimpeurProfileBody => {
  if (!profile) {
    return grimpeurDefaultValues
  }

  return {
    disciplines: profile.disciplines,
    niveaux: {
      ...grimpeurDefaultValues.niveaux,
      ...profile.niveaux,
    },
    materiel: profile.materiel,
  }
}

const mergeClubDefaults = (profile: ProfileMeResponse['clubProfile']): CreateClubProfileBody => {
  if (!profile) {
    return clubDefaultValues
  }

  return {
    nom: profile.nom,
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    ffmeNum: profile.ffmeNum ?? '',
  }
}

export default function ProfileForm({ mode }: ProfileFormProps) {
  const [profile, setProfile] = useState<ProfileMeResponse | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)

  const grimpeurForm = useForm<CreateGrimpeurProfileBody>({
    resolver: zodResolver(createGrimpeurProfileBodySchema),
    defaultValues: grimpeurDefaultValues,
  })

  const clubForm = useForm<CreateClubProfileBody>({
    resolver: zodResolver(createClubProfileBodySchema),
    defaultValues: clubDefaultValues,
  })

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      const response = await fetch('/api/profile/me', { cache: 'no-store' })

      if (!response.ok) {
        if (isMounted) {
          setIsLoadingProfile(false)
        }
        return
      }

      const data: unknown = await response.json()
      const parsedData = profileMeResponseSchema.safeParse(data)

      if (isMounted && parsedData.success) {
        setProfile(parsedData.data)
        grimpeurForm.reset(mergeGrimpeurDefaults(parsedData.data.grimpeurProfile))
        clubForm.reset(mergeClubDefaults(parsedData.data.clubProfile))
        setIsLoadingProfile(false)
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [clubForm, grimpeurForm])

  const submitGrimpeurProfile = async (values: CreateGrimpeurProfileBody) => {
    setFeedback(null)
    const hasProfile = Boolean(profile?.grimpeurProfile)
    const response = await fetch('/api/profile/grimpeur', {
      method: hasProfile ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      return
    }

    const data: unknown = await response.json()
    const parsedData = profileMeResponseSchema.safeParse(data)

    if (parsedData.success) {
      setProfile(parsedData.data)
      grimpeurForm.reset(mergeGrimpeurDefaults(parsedData.data.grimpeurProfile))
      setFeedback(hasProfile ? 'Profil grimpeur mis à jour' : 'Profil grimpeur créé')
    }
  }

  const submitClubProfile = async (values: CreateClubProfileBody) => {
    setFeedback(null)
    const hasProfile = Boolean(profile?.clubProfile)
    const response = await fetch('/api/profile/club', {
      method: hasProfile ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      return
    }

    const data: unknown = await response.json()
    const parsedData = profileMeResponseSchema.safeParse(data)

    if (parsedData.success) {
      setProfile(parsedData.data)
      clubForm.reset(mergeClubDefaults(parsedData.data.clubProfile))
      setFeedback(hasProfile ? 'Profil club mis à jour' : 'Profil club créé')
    }
  }

  if (isLoadingProfile) {
    return (
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">Chargement du profil...</CardContent>
          </Card>
        </div>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Connexion requise</CardTitle>
              <CardDescription>Connectez-vous avant de compléter votre profil Spity.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link className="spity-btn spity-btn--primary" href="/login">
                Aller à la connexion
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  const isGrimpeur = profile.user.role === 'grimpeur'
  const title = mode === 'onboarding' ? 'Compléter votre profil' : 'Mon profil'

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="space-y-3">
            <Badge variant={profile.onboardingComplete ? 'success' : 'warning'}>
              {profile.onboardingComplete ? 'Profil complet' : 'Onboarding'}
            </Badge>
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
            <p className="max-w-2xl text-muted-foreground">
              Ces informations alimenteront le matching grimpeur, les événements clubs et les recommandations locales.
            </p>
          </div>

          {feedback && (
            <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
              {feedback}
            </div>
          )}

          {isGrimpeur ? (
            <Card>
              <CardHeader>
                <CardTitle>Profil grimpeur</CardTitle>
                <CardDescription>Disciplines, niveaux et matériel disponible.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={grimpeurForm.handleSubmit(submitGrimpeurProfile)}>
                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium text-foreground">Disciplines</legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {disciplines.map((discipline) => (
                        <label key={discipline.value} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
                          <input type="checkbox" value={discipline.value} {...grimpeurForm.register('disciplines')} />
                          {discipline.label}
                        </label>
                      ))}
                    </div>
                    {grimpeurForm.formState.errors.disciplines?.message && (
                      <p className="text-xs text-destructive">{grimpeurForm.formState.errors.disciplines.message}</p>
                    )}
                  </fieldset>

                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium text-foreground">Niveaux par discipline</legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {disciplines.map((discipline) => (
                        <label key={discipline.value} className="space-y-1.5 text-sm font-medium text-foreground">
                          {discipline.label}
                          <select className="spity-input" {...grimpeurForm.register(`niveaux.${discipline.value}`)}>
                            {grades.map((grade) => (
                              <option key={grade} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="space-y-3">
                    <legend className="text-sm font-medium text-foreground">Matériel</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {gear.map((item) => (
                        <label key={item.value} className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
                          <input type="checkbox" value={item.value} {...grimpeurForm.register('materiel')} />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <Button type="submit" isLoading={grimpeurForm.formState.isSubmitting}>
                    {profile.grimpeurProfile ? 'Mettre à jour' : 'Créer le profil'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Profil club</CardTitle>
                <CardDescription>Identité, localisation et affiliation FFME.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={clubForm.handleSubmit(submitClubProfile)}>
                  <Input
                    label="Nom du club"
                    error={clubForm.formState.errors.nom?.message}
                    {...clubForm.register('nom')}
                  />
                  <Input
                    label="Localisation"
                    placeholder="Lyon, Grenoble, Chambéry..."
                    error={clubForm.formState.errors.location?.message}
                    {...clubForm.register('location')}
                  />
                  <Input
                    label="Numéro FFME"
                    error={clubForm.formState.errors.ffmeNum?.message}
                    {...clubForm.register('ffmeNum')}
                  />
                  <Textarea
                    label="Bio"
                    error={clubForm.formState.errors.bio?.message}
                    {...clubForm.register('bio')}
                  />
                  <Button type="submit" isLoading={clubForm.formState.isSubmitting}>
                    {profile.clubProfile ? 'Mettre à jour' : 'Créer le profil'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </section>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Compte</CardTitle>
              <CardDescription>{profile.user.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="secondary">{profile.user.role}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email vérifié</span>
                <Badge variant={profile.user.emailVerified ? 'success' : 'warning'}>
                  {profile.user.emailVerified ? 'Oui' : 'Non'}
                </Badge>
              </div>
              {profile.onboardingComplete && (
                <Link className="spity-btn spity-btn--secondary w-full" href="/profile/me">
                  Voir mon profil
                </Link>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}
