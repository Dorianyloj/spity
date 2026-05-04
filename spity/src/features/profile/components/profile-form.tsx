'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Award, CheckCircle2, Mail, MapPin, Mountain, ShieldCheck, UserRound, UsersRound } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { createClubProfileBodySchema, createGrimpeurProfileBodySchema, profileMeResponseSchema } from '../schemas'
import type { CreateClubProfileBody, CreateGrimpeurProfileBody, ProfileMeResponse, UserEquipment } from '../schemas'
import EquipmentInventorySection from './equipment-inventory-section'

type ProfileFormMode = 'onboarding' | 'settings'
type ProfileFormVariant = 'standalone' | 'app'
type ProfileTab = 'overview' | 'practice' | 'equipment' | 'account'

type ProfileFormProps = {
  mode: ProfileFormMode
  variant?: ProfileFormVariant
}

const disciplines = [
  { value: 'bloc', label: 'Bloc' },
  { value: 'voie', label: 'Voie' },
  { value: 'trad', label: 'Trad' },
]

const disciplineLabels = {
  bloc: 'Bloc',
  voie: 'Voie',
  trad: 'Trad',
  escalade: 'Escalade',
  'via-ferrata': 'Via ferrata',
  'grandes-voies': 'Grandes voies',
  speed: 'Speed',
}

const gear = [
  { value: 'chaussons', label: 'Chaussons' },
  { value: 'baudrier', label: 'Baudrier' },
  { value: 'corde', label: 'Corde' },
  { value: 'crashpad', label: 'Crashpad' },
]

const gearLabels = {
  chaussons: 'Chaussons',
  baudrier: 'Baudrier',
  corde: 'Corde',
  crashpad: 'Crashpad',
}

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

export default function ProfileForm({ mode, variant = 'standalone' }: ProfileFormProps) {
  const [profile, setProfile] = useState<ProfileMeResponse | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview')

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

  const updateEquipment = (equipment: UserEquipment[]) => {
    setProfile((currentProfile) => currentProfile ? { ...currentProfile, equipment } : currentProfile)
  }

  if (isLoadingProfile) {
    if (variant === 'app') {
      return (
        <Card hover={false}>
          <CardContent className="p-6 text-sm text-muted-foreground">Chargement du profil...</CardContent>
        </Card>
      )
    }

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
    if (variant === 'app') {
      return (
        <Card hover={false}>
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
      )
    }

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
  const isSettings = mode === 'settings'
  const displayName = profile.clubProfile?.nom ?? profile.user.email.split('@')[0]
  const profileKind = isGrimpeur ? 'Grimpeur' : 'Club'
  const selectedDisciplines = profile.grimpeurProfile?.disciplines ?? []
  const selectedGear = profile.grimpeurProfile?.materiel ?? []
  const selectedEquipment = profile.equipment
  const equipmentObjectCount = selectedEquipment.reduce((total, item) => total + item.quantity, 0)
  const profileStats = isGrimpeur
    ? [
        { label: 'Disciplines', value: String(selectedDisciplines.length), icon: Mountain },
        { label: 'Objets déclarés', value: String(equipmentObjectCount || selectedGear.length), icon: ShieldCheck },
        { label: 'Karma', value: String(profile.grimpeurProfile?.karma ?? 0), icon: Award },
      ]
    : [
        { label: 'Type', value: 'Club', icon: UsersRound },
        { label: 'FFME', value: profile.clubProfile?.ffmeNum ? 'Oui' : 'Non', icon: ShieldCheck },
        { label: 'Événements', value: '0', icon: Award },
      ]
  const tabs: Array<{ id: ProfileTab; label: string; icon: typeof UserRound; disabled?: boolean }> = [
    { id: 'overview', label: 'Aperçu', icon: UserRound },
    { id: 'practice', label: isGrimpeur ? 'Pratique' : 'Club', icon: Mountain },
    { id: 'equipment', label: 'Matériel', icon: ShieldCheck, disabled: !isGrimpeur },
    { id: 'account', label: 'Compte', icon: Mail },
  ]
  const summaryCard = isSettings && isGrimpeur && profile.grimpeurProfile ? (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Résumé grimpeur</CardTitle>
        <CardDescription>Vue finale de votre profil tel qu’il sera utilisé dans le matching.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-sm font-medium text-foreground">Disciplines</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedDisciplines.map((discipline) => (
              <Badge key={discipline} variant="primary">
                {disciplineLabels[discipline] ?? discipline}
              </Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {selectedDisciplines.map((discipline) => (
            <div key={discipline} className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">{disciplineLabels[discipline] ?? discipline}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {profile.grimpeurProfile?.niveaux[discipline] ?? 'N/A'}
              </p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Matériel disponible</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedEquipment.length > 0 ? (
              selectedEquipment.slice(0, 6).map((item) => (
                <Badge key={item.id} variant="secondary">
                  {item.quantity} x {item.brand ? `${item.brand} ` : ''}{item.model}
                </Badge>
              ))
            ) : (
              selectedGear.map((item) => (
                <Badge key={item} variant="secondary">
                  {gearLabels[item as keyof typeof gearLabels] ?? item}
                </Badge>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null
  const clubSummaryCard = isSettings && !isGrimpeur && profile.clubProfile ? (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Résumé club</CardTitle>
        <CardDescription>Informations visibles pour les grimpeurs et futurs membres.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Localisation</p>
          <p className="mt-1 font-medium text-foreground">{profile.clubProfile.location ?? 'À compléter'}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Affiliation FFME</p>
          <p className="mt-1 font-medium text-foreground">{profile.clubProfile.ffmeNum ?? 'Non renseignée'}</p>
        </div>
        <div className="rounded-lg border border-border p-4 sm:col-span-2">
          <p className="text-sm text-muted-foreground">Bio</p>
          <p className="mt-1 text-foreground">{profile.clubProfile.bio ?? 'Aucune bio renseignée.'}</p>
        </div>
      </CardContent>
    </Card>
  ) : null
  const profileFormCard = isGrimpeur ? (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>{isSettings ? 'Modifier ma pratique' : 'Profil grimpeur'}</CardTitle>
        <CardDescription>
          {isSettings
            ? 'Disciplines et niveaux utilisés pour trouver les bons partenaires.'
            : 'Disciplines, niveaux et matériel disponible pour trouver les bons partenaires.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={grimpeurForm.handleSubmit(submitGrimpeurProfile)}>
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">Disciplines</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {disciplines.map((discipline) => (
                <label key={discipline.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted">
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

          {!isSettings && (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-foreground">Matériel de base</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {gear.map((item) => (
                  <label key={item.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted">
                    <input type="checkbox" value={item.value} {...grimpeurForm.register('materiel')} />
                    {item.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <Button type="submit" isLoading={grimpeurForm.formState.isSubmitting}>
            {profile.grimpeurProfile ? 'Mettre à jour' : 'Créer le profil'}
          </Button>
        </form>
      </CardContent>
    </Card>
  ) : (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>{isSettings ? 'Modifier les informations club' : 'Profil club'}</CardTitle>
        <CardDescription>Identité, localisation et affiliation FFME pour rendre le club visible.</CardDescription>
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
  )
  const accountCard = (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Compte</CardTitle>
        <CardDescription>{profileKind} connecté</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-start gap-3 rounded-lg border border-border p-3">
          <Mail className="mt-0.5 text-muted-foreground" size={18} />
          <div className="min-w-0">
            <p className="font-medium text-foreground">Email</p>
            <p className="truncate text-muted-foreground">{profile.user.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <span className="text-muted-foreground">Type</span>
          <Badge variant="secondary">{profile.user.role}</Badge>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <span className="text-muted-foreground">Email vérifié</span>
          <Badge variant={profile.user.emailVerified ? 'success' : 'warning'}>
            {profile.user.emailVerified ? 'Oui' : 'Non'}
          </Badge>
        </div>
        {profile.onboardingComplete && variant === 'standalone' && (
          <Link className="spity-btn spity-btn--secondary w-full" href="/app">
            Entrer dans l’app
          </Link>
        )}
      </CardContent>
    </Card>
  )
  const purposeCard = (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Ce profil servira à</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 text-success" size={18} />
          <span>Améliorer le matching avec des partenaires compatibles.</span>
        </div>
        <div className="flex gap-3">
          <MapPin className="mt-0.5 text-success" size={18} />
          <span>Préparer les recommandations de lieux et d’événements locaux.</span>
        </div>
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 text-success" size={18} />
          <span>Rendre les sessions plus fiables pour la communauté.</span>
        </div>
      </CardContent>
    </Card>
  )
  const settingsTabContent = (
    <section className="space-y-6">
      {feedback && (
        <div className="rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground">
          {feedback}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            {summaryCard}
            {clubSummaryCard}
          </section>
          <aside className="space-y-6">
            {accountCard}
            {purposeCard}
          </aside>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="mx-auto max-w-4xl space-y-6">
          {profileFormCard}
        </div>
      )}

      {activeTab === 'equipment' && isGrimpeur && (
        <EquipmentInventorySection equipment={selectedEquipment} onEquipmentChange={updateEquipment} />
      )}

      {activeTab === 'account' && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            {accountCard}
          </section>
          <aside>{purposeCard}</aside>
        </div>
      )}
    </section>
  )
  const onboardingContent = (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        {feedback && (
          <div className="rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground">
            {feedback}
          </div>
        )}
        {profileFormCard}
      </section>
      <aside className="space-y-6">
        {accountCard}
        {purposeCard}
      </aside>
    </div>
  )
  const content = (
    <div className={variant === 'app' ? 'space-y-6' : 'mx-auto max-w-6xl space-y-6'}>
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="bg-slate-deep px-6 py-8 text-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20">
                {isGrimpeur ? <UserRound size={34} /> : <UsersRound size={34} />}
              </div>
              <div>
                <Badge variant={profile.onboardingComplete ? 'success' : 'warning'}>
                  {profile.onboardingComplete ? 'Profil complet' : 'Onboarding'}
                </Badge>
                <h1 className="mt-3 text-4xl font-bold text-white">{isSettings ? displayName : title}</h1>
                <p className="mt-2 max-w-2xl text-white/75">
                  {isSettings
                    ? 'Votre profil pilote les recommandations, le matching et les invitations locales.'
                    : 'Complétez ces informations pour accéder à l’expérience connectée Spity.'}
                </p>
              </div>
            </div>

            {variant === 'standalone' && (
              <div className="flex flex-wrap gap-3">
                {profile.onboardingComplete && (
                  <Link className="spity-btn bg-white text-slate-deep hover:bg-white/90" href="/app">
                    Entrer dans l’app
                  </Link>
                )}
                <Link className="spity-btn bg-white/10 text-white hover:bg-white/20" href="/">
                  Accueil
                </Link>
              </div>
            )}
          </div>
        </div>

        {isSettings && (
          <div className="grid gap-0 border-t border-border md:grid-cols-3">
            {profileStats.map((stat) => {
              const Icon = stat.icon

              return (
                <div key={stat.label} className="flex items-center gap-3 border-b border-border p-5 md:border-b-0 md:border-r last:md:border-r-0">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-coral-light text-coral">
                    <Icon size={21} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {isSettings && (
        <nav className="flex gap-2 overflow-x-auto rounded-xl border border-border bg-card p-2" aria-label="Navigation du profil">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                aria-current={isActive ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                } ${tab.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={tab.disabled}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      )}

      {isSettings ? settingsTabContent : onboardingContent}
    </div>
  )

  if (variant === 'app') {
    return content
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      {content}
    </main>
  )
}
