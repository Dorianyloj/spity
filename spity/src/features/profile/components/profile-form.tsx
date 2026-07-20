'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, CheckCircle2, Clock, Mail, MapPin, Mountain, SearchCheck, ShieldCheck, Target, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { demoClimbingAssets, makeDarkPanelBackground } from '@/lib/brand-assets'
import { createClubProfileBodySchema, createGrimpeurProfileBodySchema, defaultPartnerSearch, profileMeResponseSchema, updatePublicProfileBodySchema } from '../schemas'
import type { CreateClubProfileBody, CreateGrimpeurProfileBody, ProfileMeResponse, UpdatePublicProfileBody, UserEquipment } from '../schemas'
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

const climbingEnvironmentOptions: Array<{ value: NonNullable<UpdatePublicProfileBody['climbingEnvironment']>; label: string }> = [
  { value: 'indoor', label: 'Salle' },
  { value: 'outdoor', label: 'Falaise' },
  { value: 'mixed', label: 'Salle + falaise' },
]

const availabilityOptions: Array<{ value: UpdatePublicProfileBody['availability'][number]; label: string }> = [
  { value: 'weekday_morning', label: 'Semaine matin' },
  { value: 'weekday_lunch', label: 'Semaine midi' },
  { value: 'weekday_evening', label: 'Semaine soir' },
  { value: 'weekend_morning', label: 'Week-end matin' },
  { value: 'weekend_afternoon', label: 'Week-end après-midi' },
  { value: 'weekend_evening', label: 'Week-end soir' },
]

const partnerLevelOptions: Array<{ value: UpdatePublicProfileBody['partnerSearch']['levelPreference']; label: string }> = [
  { value: 'same_or_close', label: 'Niveau proche' },
  { value: 'stronger', label: 'Plus expérimenté' },
  { value: 'beginner_friendly', label: 'Débutants bienvenus' },
  { value: 'any', label: 'Peu importe' },
]

const partnerStyleOptions: Array<{ value: UpdatePublicProfileBody['partnerSearch']['style']; label: string }> = [
  { value: 'relaxed', label: 'Session tranquille' },
  { value: 'performance', label: 'Performance' },
  { value: 'training', label: 'Entraînement' },
  { value: 'discovery', label: 'Découverte' },
]

const goalOptions = [
  'Trouver des partenaires réguliers',
  'Progresser en voie',
  'Progresser en bloc',
  'Sortir plus en falaise',
  'Préparer une grande voie',
  'Reprendre après une pause',
  'Participer à des événements club',
  'Partager du matériel',
]

const climbingEnvironmentLabels = Object.fromEntries(climbingEnvironmentOptions.map((option) => [option.value, option.label]))
const availabilityLabels = Object.fromEntries(availabilityOptions.map((option) => [option.value, option.label]))
const partnerLevelLabels = Object.fromEntries(partnerLevelOptions.map((option) => [option.value, option.label]))
const partnerStyleLabels = Object.fromEntries(partnerStyleOptions.map((option) => [option.value, option.label]))

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

const publicProfileDefaultValues: UpdatePublicProfileBody = {
  avatarUrl: null,
  displayName: null,
  bio: null,
  location: null,
  climbingEnvironment: 'mixed',
  availability: [],
  partnerSearch: defaultPartnerSearch,
  goals: [],
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

const mergePublicProfileDefaults = (profile: ProfileMeResponse): UpdatePublicProfileBody => {
  return {
    avatarUrl: profile.user.avatarUrl,
    displayName: profile.grimpeurProfile?.displayName ?? profile.user.email.split('@')[0],
    bio: profile.grimpeurProfile?.bio ?? null,
    location: profile.grimpeurProfile?.location ?? null,
    climbingEnvironment: profile.grimpeurProfile?.climbingEnvironment ?? 'mixed',
    availability: profile.grimpeurProfile?.availability ?? [],
    partnerSearch: profile.grimpeurProfile?.partnerSearch ?? defaultPartnerSearch,
    goals: profile.grimpeurProfile?.goals ?? [],
  }
}

export default function ProfileForm({ mode, variant = 'standalone' }: ProfileFormProps) {
  const [profile, setProfile] = useState<ProfileMeResponse | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview')
  const [publicProfileDraft, setPublicProfileDraft] = useState<UpdatePublicProfileBody>(publicProfileDefaultValues)
  const [isSavingPublicProfile, setIsSavingPublicProfile] = useState(false)

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
        setPublicProfileDraft(mergePublicProfileDefaults(parsedData.data))
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

  const updatePublicProfileDraft = <Field extends keyof UpdatePublicProfileBody>(
    field: Field,
    value: UpdatePublicProfileBody[Field]
  ) => {
    setPublicProfileDraft((currentDraft) => ({ ...currentDraft, [field]: value }))
  }

  const toggleAvailability = (availability: UpdatePublicProfileBody['availability'][number]) => {
    setPublicProfileDraft((currentDraft) => ({
      ...currentDraft,
      availability: currentDraft.availability.includes(availability)
        ? currentDraft.availability.filter((item) => item !== availability)
        : [...currentDraft.availability, availability],
    }))
  }

  const toggleGoal = (goal: string) => {
    setPublicProfileDraft((currentDraft) => ({
      ...currentDraft,
      goals: currentDraft.goals.includes(goal)
        ? currentDraft.goals.filter((item) => item !== goal)
        : [...currentDraft.goals, goal],
    }))
  }

  const updatePartnerSearch = <Field extends keyof UpdatePublicProfileBody['partnerSearch']>(
    field: Field,
    value: UpdatePublicProfileBody['partnerSearch'][Field]
  ) => {
    setPublicProfileDraft((currentDraft) => ({
      ...currentDraft,
      partnerSearch: {
        ...currentDraft.partnerSearch,
        [field]: value,
      },
    }))
  }

  const submitPublicProfile = async () => {
    setFeedback(null)
    const parsedDraft = updatePublicProfileBodySchema.safeParse(publicProfileDraft)

    if (!parsedDraft.success) {
      setFeedback(parsedDraft.error.issues[0]?.message ?? 'Profil public invalide')
      return
    }

    setIsSavingPublicProfile(true)
    const response = await fetch('/api/profile/public', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedDraft.data),
    })
    setIsSavingPublicProfile(false)

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      return
    }

    const data: unknown = await response.json()
    const parsedData = profileMeResponseSchema.safeParse(data)

    if (parsedData.success) {
      setProfile(parsedData.data)
      setPublicProfileDraft(mergePublicProfileDefaults(parsedData.data))
      setFeedback('Profil public mis à jour')
    }
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
      <main
        className="min-h-screen bg-background bg-cover bg-center px-4 py-10"
        style={{ backgroundImage: makeDarkPanelBackground(demoClimbingAssets.verdonWall) }}
      >
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
      <main
        className="min-h-screen bg-background bg-cover bg-center px-4 py-10"
        style={{ backgroundImage: makeDarkPanelBackground(demoClimbingAssets.verdonWall) }}
      >
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
  const displayName = profile.grimpeurProfile?.displayName ?? profile.clubProfile?.nom ?? profile.user.email.split('@')[0]
  const profileKind = isGrimpeur ? 'Grimpeur' : 'Club'
  const selectedDisciplines = profile.grimpeurProfile?.disciplines ?? []
  const selectedGear = profile.grimpeurProfile?.materiel ?? []
  const selectedEquipment = profile.equipment
  const tabs: Array<{ id: ProfileTab; label: string; icon: typeof UserRound; disabled?: boolean }> = [
    { id: 'overview', label: 'Aperçu', icon: UserRound },
    { id: 'practice', label: isGrimpeur ? 'Pratique' : 'Club', icon: Mountain },
    { id: 'equipment', label: 'Matériel', icon: ShieldCheck, disabled: !isGrimpeur },
    { id: 'account', label: 'Compte', icon: Mail },
  ]
  const profileCompletionLabel = profile.onboardingComplete ? 'Complet' : 'À finaliser'
  const environmentLabel = profile.grimpeurProfile?.climbingEnvironment
    ? climbingEnvironmentLabels[profile.grimpeurProfile.climbingEnvironment]
    : 'À préciser'
  const readinessItems = isGrimpeur
    ? [
        { label: 'Photo', done: Boolean(profile.user.avatarUrl) },
        { label: 'Bio', done: Boolean(profile.grimpeurProfile?.bio) },
        { label: 'Localisation', done: Boolean(profile.grimpeurProfile?.location) },
        { label: 'Disponibilités', done: Boolean(profile.grimpeurProfile?.availability.length) },
        { label: 'Objectifs', done: Boolean(profile.grimpeurProfile?.goals.length) },
        { label: 'Matériel', done: selectedEquipment.length > 0 || selectedGear.length > 0 },
      ]
    : [
        { label: 'Nom', done: Boolean(profile.clubProfile?.nom) },
        { label: 'Bio', done: Boolean(profile.clubProfile?.bio) },
        { label: 'Localisation', done: Boolean(profile.clubProfile?.location) },
        { label: 'Affiliation', done: Boolean(profile.clubProfile?.ffmeNum) },
      ]
  const completedReadinessItems = readinessItems.filter((item) => item.done).length
  const readinessCard = (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Progression</CardTitle>
        <CardDescription>Les éléments utiles pour rendre le profil clair et fiable.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-coral-light p-4 text-coral-dark">
          <p className="text-3xl font-bold">{completedReadinessItems}/{readinessItems.length}</p>
          <p className="text-sm font-medium">éléments complétés</p>
        </div>
        <div className="space-y-2">
          {readinessItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
              <span className="text-foreground">{item.label}</span>
              <Badge variant={item.done ? 'success' : 'default'}>{item.done ? 'OK' : 'À faire'}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
  const publicProfileCard = isSettings && isGrimpeur && profile.grimpeurProfile ? (
    <Card hover={false} className="overflow-hidden">
      <div
        className="h-28 bg-cover bg-center"
        style={{ backgroundImage: makeDarkPanelBackground(demoClimbingAssets.verdonRoute) }}
        aria-hidden="true"
      />
      <CardContent className="-mt-10 space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-4 border-card bg-coral-light text-coral spity-shadow-soft">
              {profile.user.avatarUrl ? (
                <div
                  aria-label={`Photo de profil de ${displayName}`}
                  className="h-full w-full bg-cover bg-center"
                  role="img"
                  style={{ backgroundImage: `url(${profile.user.avatarUrl})` }}
                />
              ) : (
                <UserRound size={38} />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{displayName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {profile.grimpeurProfile.location ?? 'Localisation à compléter'} · {environmentLabel}
              </p>
            </div>
          </div>
          <Badge variant={profile.grimpeurProfile.partnerSearch.enabled ? 'success' : 'secondary'}>
            {profile.grimpeurProfile.partnerSearch.enabled ? 'Recherche partenaire' : 'Pas en recherche'}
          </Badge>
        </div>

        <p className="text-foreground">
          {profile.grimpeurProfile.bio ?? 'Ajoutez une bio courte pour présenter votre pratique, vos lieux habituels et ce que vous cherchez sur Spity.'}
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock size={16} />
              Disponibilités
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.grimpeurProfile.availability.length > 0 ? (
                profile.grimpeurProfile.availability.map((availability) => (
                  <Badge key={availability} variant="secondary">{availabilityLabels[availability]}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">À compléter</span>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Target size={16} />
              Objectifs
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {profile.grimpeurProfile.goals.length > 0 ? (
                profile.grimpeurProfile.goals.slice(0, 3).map((goal) => (
                  <Badge key={goal} variant="primary">{goal}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">À définir</span>
              )}
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SearchCheck size={16} />
              Matching
            </div>
            <p className="mt-3 text-sm font-medium text-foreground">
              {partnerLevelLabels[profile.grimpeurProfile.partnerSearch.levelPreference]}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {partnerStyleLabels[profile.grimpeurProfile.partnerSearch.style]}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : null
  const publicIdentityEditorCard = isSettings && isGrimpeur ? (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Modifier la fiche</CardTitle>
        <CardDescription>Les informations visibles pour les futurs partenaires.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={(event) => {
          event.preventDefault()
          void submitPublicProfile()
        }}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Photo de profil URL"
              placeholder="https://..."
              value={publicProfileDraft.avatarUrl ?? ''}
              icon={<Camera size={17} />}
              onChange={(event) => updatePublicProfileDraft('avatarUrl', event.target.value)}
            />
            <Input
              label="Nom affiché"
              placeholder="Dorian J."
              value={publicProfileDraft.displayName ?? ''}
              icon={<UserRound size={17} />}
              onChange={(event) => updatePublicProfileDraft('displayName', event.target.value)}
            />
            <Input
              label="Localisation"
              placeholder="Lyon, Grenoble, Chambéry..."
              value={publicProfileDraft.location ?? ''}
              icon={<MapPin size={17} />}
              onChange={(event) => updatePublicProfileDraft('location', event.target.value)}
            />
            <label className="space-y-1.5 text-sm font-medium text-foreground">
              Environnement principal
              <select
                className="spity-input"
                value={publicProfileDraft.climbingEnvironment ?? ''}
                onChange={(event) => updatePublicProfileDraft('climbingEnvironment', event.target.value as UpdatePublicProfileBody['climbingEnvironment'])}
              >
                <option value="">À préciser</option>
                {climbingEnvironmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Textarea
            label="Bio courte"
            placeholder="Présente ta pratique, tes lieux habituels, ton style de session..."
            value={publicProfileDraft.bio ?? ''}
            onChange={(event) => updatePublicProfileDraft('bio', event.target.value)}
          />

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">Disponibilités</legend>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {availabilityOptions.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted">
                  <input
                    checked={publicProfileDraft.availability.includes(option.value)}
                    type="checkbox"
                    onChange={() => toggleAvailability(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">Objectifs</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {goalOptions.map((goal) => (
                <label key={goal} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-muted">
                  <input
                    checked={publicProfileDraft.goals.includes(goal)}
                    type="checkbox"
                    onChange={() => toggleGoal(goal)}
                  />
                  {goal}
                </label>
              ))}
            </div>
          </fieldset>

          <Button type="submit" isLoading={isSavingPublicProfile}>
            Mettre à jour la fiche publique
          </Button>
        </form>
      </CardContent>
    </Card>
  ) : null
  const matchingPreferencesCard = isSettings && isGrimpeur ? (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Préférences de matching</CardTitle>
        <CardDescription>Ces signaux aideront Spity à proposer les bons partenaires.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={(event) => {
          event.preventDefault()
          void submitPublicProfile()
        }}>
          <label className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
            <input
              checked={publicProfileDraft.partnerSearch.enabled}
              type="checkbox"
              onChange={(event) => updatePartnerSearch('enabled', event.target.checked)}
            />
            Je recherche actuellement des partenaires
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-foreground">
              Niveau recherché
              <select
                className="spity-input"
                value={publicProfileDraft.partnerSearch.levelPreference}
                onChange={(event) => updatePartnerSearch('levelPreference', event.target.value as UpdatePublicProfileBody['partnerSearch']['levelPreference'])}
              >
                {partnerLevelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium text-foreground">
              Style de session
              <select
                className="spity-input"
                value={publicProfileDraft.partnerSearch.style}
                onChange={(event) => updatePartnerSearch('style', event.target.value as UpdatePublicProfileBody['partnerSearch']['style'])}
              >
                {partnerStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Textarea
            label="Note partenaire"
            placeholder="Ex: disponible pour assurer en voie, ok débutants, je préfère les sessions calmes..."
            value={publicProfileDraft.partnerSearch.notes ?? ''}
            onChange={(event) => updatePartnerSearch('notes', event.target.value)}
          />
          <Button type="submit" isLoading={isSavingPublicProfile}>
            Enregistrer les préférences
          </Button>
        </form>
      </CardContent>
    </Card>
  ) : null
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
        <div
          className="rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground"
          role="status"
          aria-live="polite"
        >
          {feedback}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            {publicProfileCard}
            {publicIdentityEditorCard}
            {clubSummaryCard}
          </section>
          <aside className="space-y-6">
            {readinessCard}
            {purposeCard}
          </aside>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="space-y-6">
            {profileFormCard}
            {matchingPreferencesCard}
          </section>
          <aside className="space-y-6">
            {summaryCard}
            {purposeCard}
          </aside>
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
          <div
            className="rounded-lg border border-border bg-card p-4 text-sm font-medium text-foreground"
            role="status"
            aria-live="polite"
          >
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
    <div className={variant === 'app' ? 'space-y-6' : 'mx-auto max-w-7xl space-y-6'}>
      {!isSettings && (
        <section
          className="overflow-hidden rounded-lg border border-white/10 bg-cover bg-center p-5 shadow-2xl shadow-black/20"
          style={{ backgroundImage: makeDarkPanelBackground(profile.user.role === 'club' ? demoClimbingAssets.indoorGym : demoClimbingAssets.fontainebleau) }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={profile.onboardingComplete ? 'success' : 'warning'}>
                  {profileCompletionLabel}
                </Badge>
                <Badge variant="secondary">{profileKind}</Badge>
              </div>
              <h1 className="mt-3 text-3xl font-black text-white">{title}</h1>
              <p className="mt-1 max-w-2xl text-white/[0.72]">
                Complétez votre identité Spity avant d’entrer dans l’espace connecté.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {profile.onboardingComplete && (
                <Link className="spity-btn spity-btn--primary" href="/app">
                  Entrer dans l’app
                </Link>
              )}
              <Link className="spity-btn spity-btn--secondary" href="/">
                Accueil
              </Link>
            </div>
          </div>
        </section>
      )}

      {isSettings && (
        <nav className="spity-tab-row" aria-label="Navigation du profil">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                aria-current={isActive ? 'page' : undefined}
                className={`spity-tab-row__item min-w-[132px] ${
                  isActive ? 'spity-tab-row__item--active' : ''
                } ${tab.disabled ? 'spity-tab-row__item--disabled' : ''}`}
                disabled={tab.disabled}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={17} aria-hidden="true" />
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
    <main
      className="min-h-screen bg-background bg-cover bg-center px-4 py-8"
      style={{ backgroundImage: makeDarkPanelBackground(demoClimbingAssets.verdonWall) }}
    >
      {content}
    </main>
  )
}
