'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Check, LocateFixed, MapPin, Mountain, ParkingCircle, Search, Trash2, Warehouse } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { cn } from '@/lib/class-names'
import {
  disciplineLabels,
  locationSearchResponseSchema,
  orientationLabels,
  orientationOptions,
  placeCreationInputSchema,
  placeDisciplines,
  placeServices,
  rainExposures,
  reverseGeocodeResponseSchema,
  rockTypeLabels,
  rockTypes,
  seasonLabels,
  seasonOptions,
  sunlightOptions,
  type LocationSearchResult,
  type PlaceCreationInput,
} from '../schemas'

const PlaceMap = dynamic(() => import('./place-map'), {
  ssr: false,
  loading: () => <div className="h-[320px] rounded-lg bg-secondary" aria-label="Chargement de la carte" />,
})

const defaultValues: PlaceCreationInput = {
  kind: 'falaise',
  name: '',
  photoMediaId: null,
  disciplines: [],
  latitude: 45.764,
  longitude: 4.8357,
  city: '',
  department: '',
  region: '',
  address: '',
  rockType: '',
  rainExposure: '',
  sunlight: '',
  seasons: [],
  orientations: [],
  services: [],
  website: '',
  access: '',
  approach: '',
  parking: '',
  parkingLatitude: null,
  parkingLongitude: null,
  restrictions: '',
  sourceUrl: '',
  notes: '',
}

const rainLabels = { abrite: 'Abrité', partiellement_abrite: 'Partiellement abrité', expose: 'Exposé' } as const
const sunlightLabels = { ombrage: 'Ombragé', mixte: 'Mixte', ensoleille: 'Ensoleillé' } as const
const serviceLabels = {
  vestiaires: 'Vestiaires', douches: 'Douches', location_materiel: 'Location de matériel',
  restauration: 'Restauration', entrainement: 'Espace entraînement', parking_velo: 'Parking vélo',
} as const

type ChoiceFieldProps = {
  error?: string
  label: string
  name: string
  options: ReadonlyArray<{ label: string; value: string }>
  value: string[]
  onChange: (value: string[]) => void
}

function ChoiceField({ error, label, name, onChange, options, value }: ChoiceFieldProps) {
  const errorId = error ? `${name}-error` : undefined

  return (
    <fieldset aria-describedby={errorId} aria-invalid={error ? true : undefined}>
      <legend className="mb-2 text-sm font-medium text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value.includes(option.value)
          return (
            <label key={option.value} className={cn(
              'cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-ring',
              checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary text-foreground hover:border-primary/60'
            )}>
              <input
                checked={checked}
                className="sr-only"
                name={name}
                onChange={() => onChange(checked ? value.filter((item) => item !== option.value) : [...value, option.value])}
                type="checkbox"
                value={option.value}
              />
              {option.label}
            </label>
          )
        })}
      </div>
      {error && <p className="mt-2 text-xs font-medium text-destructive" id={errorId} role="alert">{error}</p>}
    </fieldset>
  )
}

type ApiError = { error?: string; issues?: Array<{ path: string; message: string }> }

export default function PlaceRequestForm() {
  const [mapTarget, setMapTarget] = useState<'place' | 'parking'>('place')
  const [locationStatus, setLocationStatus] = useState('Clique sur la carte pour placer précisément le lieu.')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([])
  const [searchStatus, setSearchStatus] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState('')
  const [photoInputKey, setPhotoInputKey] = useState(0)

  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
  }, [photoPreview])
  const [submissionStatus, setSubmissionStatus] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
  } = useForm<PlaceCreationInput>({ resolver: zodResolver(placeCreationInputSchema), defaultValues })
  const kind = useWatch({ control, name: 'kind' })
  const latitude = useWatch({ control, name: 'latitude' })
  const longitude = useWatch({ control, name: 'longitude' })
  const parkingLatitude = useWatch({ control, name: 'parkingLatitude' })
  const parkingLongitude = useWatch({ control, name: 'parkingLongitude' })

  const identifyLocation = async (nextLatitude = latitude, nextLongitude = longitude) => {
    setLocationStatus('Recherche de la commune et de la région…')

    try {
      const response = await fetch(`/api/places/reverse-geocode?lat=${encodeURIComponent(nextLatitude)}&lon=${encodeURIComponent(nextLongitude)}`)
      const payload: unknown = await response.json()
      const parsed = reverseGeocodeResponseSchema.safeParse(payload)

      if (!response.ok || !parsed.success) {
        const message = typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string'
          ? payload.error
          : 'Localisation automatique indisponible. Tu peux remplir les champs manuellement.'
        setLocationStatus(message)
        return
      }

      setValue('city', parsed.data.city, { shouldValidate: true })
      setValue('department', parsed.data.department, { shouldValidate: true })
      setValue('region', parsed.data.region, { shouldValidate: true })
      setLocationStatus(`${parsed.data.city} · ${parsed.data.department} · ${parsed.data.region}`)
    } catch {
      setLocationStatus('Localisation automatique indisponible. Tu peux remplir les champs manuellement.')
    }
  }

  const handleMapChange = ({ latitude: nextLatitude, longitude: nextLongitude }: { latitude: number; longitude: number }) => {
    const roundedLatitude = Number(nextLatitude.toFixed(6))
    const roundedLongitude = Number(nextLongitude.toFixed(6))

    if (mapTarget === 'parking' && kind === 'falaise') {
      setValue('parkingLatitude', roundedLatitude, { shouldValidate: true })
      setValue('parkingLongitude', roundedLongitude, { shouldValidate: true })
      setLocationStatus('Point du parking enregistré.')
      return
    }

    setValue('latitude', roundedLatitude, { shouldValidate: true })
    setValue('longitude', roundedLongitude, { shouldValidate: true })
    void identifyLocation(roundedLatitude, roundedLongitude)
  }

  const searchLocation = async () => {
    const query = searchQuery.trim()
    if (query.length < 2) {
      setSearchResults([])
      setSearchStatus('Saisis au moins 2 caractères.')
      return
    }

    setIsSearching(true)
    setSearchStatus('Recherche en cours…')
    try {
      const response = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`)
      const payload: unknown = await response.json()
      const parsed = locationSearchResponseSchema.safeParse(payload)

      if (!response.ok || !parsed.success) {
        const message = typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string'
          ? payload.error
          : 'Recherche indisponible. Réessaie.'
        setSearchResults([])
        setSearchStatus(message)
        return
      }

      setSearchResults(parsed.data.results)
      setSearchStatus(parsed.data.results.length ? `${parsed.data.results.length} résultat(s)` : 'Aucun résultat.')
    } catch {
      setSearchResults([])
      setSearchStatus('Recherche indisponible. Réessaie.')
    } finally {
      setIsSearching(false)
    }
  }

  const selectSearchResult = (result: LocationSearchResult) => {
    if (mapTarget === 'place' && kind === 'salle' && result.type !== 'municipality') {
      setValue('address', result.label, { shouldValidate: true })
    }
    setSearchQuery(result.label)
    setSearchResults([])
    setSearchStatus('')
    handleMapChange({ latitude: result.latitude, longitude: result.longitude })
  }

  const changePhoto = (file: File | null) => {
    setPhotoError('')

    if (!file) {
      setPhotoFile(null)
      setPhotoPreview(null)
      return true
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setPhotoFile(null)
      setPhotoPreview(null)
      setPhotoError('Choisis une image JPG, PNG ou WebP de 5 Mio maximum.')
      return false
    }

    const preview = URL.createObjectURL(file)
    setPhotoFile(file)
    setPhotoPreview(preview)
    return true
  }

  const uploadPhoto = async (file: File) => {
    const body = new FormData()
    body.set('file', file)
    const response = await fetch('/api/media', { method: 'POST', body })
    const payload: unknown = await response.json()
    const parsed = z.object({ media: z.object({ id: z.uuid() }) }).safeParse(payload)
    if (!response.ok || !parsed.success) {
      const message = typeof payload === 'object' && payload && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : 'La photo n’a pas pu être importée.'
      throw new Error(message)
    }
    return parsed.data.media.id
  }

  const submit = async (values: PlaceCreationInput) => {
    setSubmissionStatus('')
    setSubmitted(false)
    let uploadedPhotoId: string | null = null

    try {
      if (photoFile) uploadedPhotoId = await uploadPhoto(photoFile)
      const response = await fetch('/api/places/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, photoMediaId: uploadedPhotoId }),
      })
      const payload = await response.json() as ApiError

      if (!response.ok) {
        payload.issues?.forEach((issue) => {
          if (issue.path in defaultValues) {
            setError(issue.path as keyof PlaceCreationInput, { message: issue.message })
          }
        })
        if (uploadedPhotoId) void fetch(`/api/media/${uploadedPhotoId}`, { method: 'DELETE', keepalive: true }).catch(() => undefined)
        setSubmissionStatus(payload.error ?? 'La demande n’a pas pu être envoyée.')
        return
      }

      setSubmitted(true)
      setSubmissionStatus('Lieu envoyé pour validation.')
      reset(defaultValues)
      setMapTarget('place')
      changePhoto(null)
      setPhotoInputKey((key) => key + 1)
    } catch (error) {
      if (uploadedPhotoId) void fetch(`/api/media/${uploadedPhotoId}`, { method: 'DELETE', keepalive: true }).catch(() => undefined)
      setSubmissionStatus(error instanceof Error ? error.message : 'La demande n’a pas pu être envoyée. Réessaie dans un instant.')
    }
  }

  const disciplines = kind === 'salle' ? placeDisciplines.filter((item) => ['voie', 'bloc', 'speed'].includes(item)) : placeDisciplines.filter((item) => item !== 'speed')

  return (
    <form className="space-y-6" noValidate onSubmit={handleSubmit(submit)}>
      <Card hover={false}>
        <CardHeader>
          <CardTitle>1. Type de lieu</CardTitle>
        </CardHeader>
        <CardContent>
          <fieldset>
            <legend className="sr-only">Type de lieu</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                { value: 'falaise', label: 'Site extérieur', description: 'Falaise, bloc, grande voie ou via ferrata', icon: Mountain },
                { value: 'salle', label: 'Salle d’escalade', description: 'Bloc, voie ou vitesse en intérieur', icon: Warehouse },
              ] as const).map((option) => {
                const Icon = option.icon
                return (
                  <label key={option.value} className={cn(
                    'cursor-pointer rounded-lg border p-4 transition-colors focus-within:ring-2 focus-within:ring-ring',
                    kind === option.value ? 'border-primary bg-primary/10' : 'border-border bg-secondary/40 hover:border-primary/60'
                  )}>
                    <input
                      className="sr-only"
                      type="radio"
                      value={option.value}
                      {...register('kind', {
                        onChange: (event) => {
                          setValue('disciplines', [], { shouldValidate: false })
                          if (event.target.value === 'salle') {
                            setMapTarget('place')
                            setValue('parkingLatitude', null)
                            setValue('parkingLongitude', null)
                          }
                        },
                      })}
                    />
                    <span className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Icon size={20} aria-hidden="true" /></span>
                      <span><span className="block font-bold text-foreground">{option.label}</span><span className="mt-1 block text-sm text-muted-foreground">{option.description}</span></span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Input label="Nom du lieu" placeholder={kind === 'falaise' ? 'Ex. Roche Corbière' : 'Ex. Climb Up Lyon'} error={errors.name?.message} {...register('name')} />
            <Controller control={control} name="disciplines" render={({ field }) => (
              <ChoiceField label="Disciplines" name="disciplines" options={disciplines.map((value) => ({ value, label: disciplineLabels[value] }))} value={field.value} onChange={field.onChange} error={errors.disciplines?.message} />
            )} />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:items-center">
            {photoPreview ? (
              <div className="relative aspect-video overflow-hidden rounded-lg border border-border">
                <Image alt="Aperçu de la photo du lieu" className="object-cover" fill sizes="(min-width: 640px) 256px, 100vw" src={photoPreview} unoptimized />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-secondary text-muted-foreground" aria-hidden="true">
                <Camera size={28} />
              </div>
            )}
            <div>
              <Input
                key={photoInputKey}
                accept="image/jpeg,image/png,image/webp"
                disabled={isSubmitting}
                error={photoError || undefined}
                label="Photo du lieu (facultative)"
                onChange={(event) => {
                  if (!changePhoto(event.target.files?.[0] ?? null)) event.target.value = ''
                }}
                type="file"
              />
              <p className="mt-2 text-xs text-pretty text-muted-foreground">JPG, PNG ou WebP · 5 Mio maximum.</p>
              {photoPreview && (
                <Button className="mt-2" disabled={isSubmitting} variant="ghost" onClick={() => {
                  changePhoto(null)
                  setPhotoInputKey((key) => key + 1)
                }}>
                  <Trash2 size={16} aria-hidden="true" /> Retirer la photo
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card hover={false}>
        <CardHeader>
          <CardTitle>2. Localisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <Input
                aria-controls={searchResults.length ? 'place-search-results' : undefined}
                label="Rechercher une ville ou une adresse"
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    void searchLocation()
                  }
                }}
                placeholder="Ex. Fontainebleau ou 12 rue…"
                type="search"
                value={searchQuery}
              />
              <Button className="w-full sm:w-auto" isLoading={isSearching} loadingText="Recherche…" variant="secondary" onClick={() => void searchLocation()}>
                <Search size={17} aria-hidden="true" /> Rechercher
              </Button>
            </div>
            {searchStatus && <p className="mt-2 text-sm text-muted-foreground" aria-live="polite" role="status">{searchStatus}</p>}
            {searchResults.length > 0 && (
              <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border" id="place-search-results">
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <button
                      className="w-full px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      onClick={() => selectSearchResult(result)}
                      type="button"
                    >
                      <MapPin className="mr-2 inline text-primary" size={16} aria-hidden="true" />
                      {result.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Point à placer sur la carte">
            <Button aria-pressed={mapTarget === 'place'} variant={mapTarget === 'place' ? 'primary' : 'secondary'} onClick={() => setMapTarget('place')}>
              <MapPin size={17} aria-hidden="true" /> Lieu
            </Button>
            {kind === 'falaise' && (
              <Button aria-pressed={mapTarget === 'parking'} variant={mapTarget === 'parking' ? 'primary' : 'secondary'} onClick={() => setMapTarget('parking')}>
                <ParkingCircle size={17} aria-hidden="true" /> Parking
              </Button>
            )}
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <PlaceMap
              latitude={latitude}
              longitude={longitude}
              parkingLatitude={parkingLatitude}
              parkingLongitude={parkingLongitude}
              onChange={handleMapChange}
            />
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite" role="status"><MapPin size={16} aria-hidden="true" />{locationStatus}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <Input label="Latitude" type="number" step="any" error={errors.latitude?.message} {...register('latitude', { valueAsNumber: true })} />
            <Input label="Longitude" type="number" step="any" error={errors.longitude?.message} {...register('longitude', { valueAsNumber: true })} />
            <Button className="w-full lg:w-auto" variant="secondary" onClick={() => void identifyLocation()}><LocateFixed size={17} aria-hidden="true" /> Identifier ce point</Button>
          </div>
          {kind === 'falaise' && (
            <fieldset className="rounded-lg border border-border p-4">
              <legend className="px-2 text-sm font-bold text-foreground">Point du parking</legend>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
                <Input label="Latitude parking" type="number" step="any" error={errors.parkingLatitude?.message} {...register('parkingLatitude', { setValueAs: (value) => value === '' ? null : Number(value) })} />
                <Input label="Longitude parking" type="number" step="any" error={errors.parkingLongitude?.message} {...register('parkingLongitude', { setValueAs: (value) => value === '' ? null : Number(value) })} />
                <Button
                  className="w-full lg:w-auto"
                  disabled={parkingLatitude === null && parkingLongitude === null}
                  variant="ghost"
                  onClick={() => {
                    setValue('parkingLatitude', null, { shouldValidate: true })
                    setValue('parkingLongitude', null, { shouldValidate: true })
                  }}
                >
                  Effacer
                </Button>
              </div>
            </fieldset>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Commune" error={errors.city?.message} {...register('city')} />
            <Input label="Département" error={errors.department?.message} {...register('department')} />
            <Input label="Région" error={errors.region?.message} {...register('region')} />
          </div>
          {kind === 'salle' && <Input label="Adresse complète" placeholder="Numéro, rue et code postal" error={errors.address?.message} {...register('address')} />}
        </CardContent>
      </Card>

      <Card hover={false}>
        <CardHeader>
          <CardTitle>3. Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {kind === 'falaise' ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="text-sm font-medium text-foreground">Type de roche<select className="spity-input mt-1.5 min-h-11" aria-invalid={errors.rockType ? true : undefined} {...register('rockType')}><option value="">Choisir</option>{rockTypes.map((value) => <option key={value} value={value}>{rockTypeLabels[value]}</option>)}</select>{errors.rockType && <span className="mt-1.5 block text-xs font-medium text-destructive" role="alert">{errors.rockType.message}</span>}</label>
                <label className="text-sm font-medium text-foreground">Exposition à la pluie<select className="spity-input mt-1.5 min-h-11" aria-invalid={errors.rainExposure ? true : undefined} {...register('rainExposure')}><option value="">Choisir</option>{rainExposures.map((value) => <option key={value} value={value}>{rainLabels[value]}</option>)}</select>{errors.rainExposure && <span className="mt-1.5 block text-xs font-medium text-destructive" role="alert">{errors.rainExposure.message}</span>}</label>
                <label className="text-sm font-medium text-foreground">Ensoleillement<select className="spity-input mt-1.5 min-h-11" aria-invalid={errors.sunlight ? true : undefined} {...register('sunlight')}><option value="">Choisir</option>{sunlightOptions.map((value) => <option key={value} value={value}>{sunlightLabels[value]}</option>)}</select>{errors.sunlight && <span className="mt-1.5 block text-xs font-medium text-destructive" role="alert">{errors.sunlight.message}</span>}</label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Controller control={control} name="seasons" render={({ field }) => <ChoiceField label="Saisons favorables" name="seasons" options={seasonOptions.map((value) => ({ value, label: seasonLabels[value] }))} value={field.value} onChange={field.onChange} error={errors.seasons?.message} />} />
                <Controller control={control} name="orientations" render={({ field }) => <ChoiceField label="Orientations" name="orientations" options={orientationOptions.map((value) => ({ value, label: orientationLabels[value] }))} value={field.value} onChange={field.onChange} error={errors.orientations?.message} />} />
              </div>
              <Textarea label="Accès au site" placeholder="Route, sentier, portail, coordonnées utiles…" error={errors.access?.message} {...register('access')} />
              <div className="grid gap-4 md:grid-cols-2"><Input label="Temps et difficulté d’approche" placeholder="Ex. 15 min, sentier raide" error={errors.approach?.message} {...register('approach')} /><Input label="Stationnement" placeholder="Emplacement, capacité, restrictions…" error={errors.parking?.message} {...register('parking')} /></div>
              <Textarea label="Restrictions ou fermetures connues" placeholder="Nidification, propriété privée, horaires, arrêtés…" error={errors.restrictions?.message} {...register('restrictions')} />
            </>
          ) : (
            <>
              <Controller control={control} name="services" render={({ field }) => <ChoiceField label="Services disponibles" name="services" options={placeServices.map((value) => ({ value, label: serviceLabels[value] }))} value={field.value} onChange={field.onChange} error={errors.services?.message} />} />
              <Input label="Site web" type="url" placeholder="https://…" error={errors.website?.message} {...register('website')} />
            </>
          )}
          <Input label="Source de l’information" type="url" placeholder="Site officiel, topo ou page de référence (facultatif)" error={errors.sourceUrl?.message} {...register('sourceUrl')} />
          <Textarea label="Informations complémentaires" placeholder="Ajoute ici ce qui aidera à vérifier et compléter la fiche." error={errors.notes?.message} {...register('notes')} />
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-center text-sm font-semibold text-muted-foreground hover:text-foreground" href="/app/places">Retour aux lieux</Link>
        <Button className="w-full sm:w-auto" isLoading={isSubmitting} loadingText="Envoi…" type="submit">Ajouter le lieu</Button>
      </div>
      {submissionStatus && <div className={cn('rounded-lg border p-4 text-sm font-medium', submitted ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-destructive/40 bg-destructive/10 text-destructive')} role={submitted ? 'status' : 'alert'}>{submitted && <Check className="mr-2 inline" size={18} aria-hidden="true" />}{submissionStatus}</div>}
    </form>
  )
}
