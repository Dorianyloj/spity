'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, MapPin, ParkingCircle, Trash2 } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { cn } from '@/lib/class-names'
import {
  disciplineLabels,
  orientationLabels,
  orientationOptions,
  placeChangeInputSchema,
  placeDisciplines,
  placeServices,
  rainExposures,
  rockTypeLabels,
  rockTypes,
  seasonLabels,
  seasonOptions,
  sunlightOptions,
  type PlaceChangeInput,
} from '../schemas'

const PlaceMap = dynamic(() => import('./place-map'), {
  ssr: false,
  loading: () => <div className="h-[320px] rounded-lg bg-secondary" aria-label="Chargement de la carte" />,
})

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
  return <fieldset aria-describedby={errorId} aria-invalid={error ? true : undefined}>
    <legend className="mb-2 text-sm font-medium text-foreground">{label}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = value.includes(option.value)
        return <label className={cn(
          'cursor-pointer rounded-full border px-3 py-2 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-ring',
          checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-secondary text-foreground hover:border-primary/60'
        )} key={option.value}>
          <input checked={checked} className="sr-only" name={name} onChange={() => onChange(checked ? value.filter((item) => item !== option.value) : [...value, option.value])} type="checkbox" value={option.value} />
          {option.label}
        </label>
      })}
    </div>
    {error && <p className="mt-2 text-xs font-medium text-destructive" id={errorId} role="alert">{error}</p>}
  </fieldset>
}

type PhotoPickerProps = {
  disabled: boolean
  onChange: (files: File[]) => void
}

function PhotoPicker({ disabled, onChange }: PhotoPickerProps) {
  const [photos, setPhotos] = useState<Array<{ file: File; url: string }>>([])
  const [error, setError] = useState('')
  const [inputKey, setInputKey] = useState(0)

  useEffect(() => () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url))
  }, [photos])

  const replace = (files: File[]) => {
    const invalid = files.find((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)
    if (invalid) {
      setError('Choisis des images JPG, PNG ou WebP de 5 Mio maximum.')
      return
    }
    if (files.length > 6) {
      setError('Ajoute au maximum 6 photos par demande.')
      return
    }
    setError('')
    setPhotos(files.map((file) => ({ file, url: URL.createObjectURL(file) })))
    onChange(files)
  }

  return <div>
    <Input
      key={inputKey}
      accept="image/jpeg,image/png,image/webp"
      disabled={disabled}
      error={error || undefined}
      label="Ajouter des photos (facultatif)"
      multiple
      onChange={(event) => replace([...photos.map((photo) => photo.file), ...Array.from(event.target.files ?? [])])}
      type="file"
    />
    <p className="mt-2 text-xs text-pretty text-muted-foreground">Jusqu’à 6 photos · JPG, PNG ou WebP · 5 Mio maximum chacune. Elles seront publiées après validation.</p>
    {photos.length > 0 && <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo, index) => <li className="relative aspect-video overflow-hidden rounded-lg border border-border" key={`${photo.file.name}-${photo.file.lastModified}-${index}`}>
        <Image alt={`Aperçu de la photo ${index + 1}`} className="object-cover" fill sizes="(min-width: 1024px) 220px, (min-width: 640px) 45vw, 100vw" src={photo.url} unoptimized />
        <Button aria-label={`Retirer la photo ${index + 1}`} className="absolute right-2 top-2" disabled={disabled} size="sm" variant="destructive" onClick={() => {
          replace(photos.filter((_, photoIndex) => photoIndex !== index).map((item) => item.file))
          setInputKey((key) => key + 1)
        }}>
          <Trash2 size={16} aria-hidden="true" />
        </Button>
      </li>)}
    </ul>}
  </div>
}

type ApiError = { error?: string; issues?: Array<{ path: string; message: string }> }

type Props = {
  backHref: string
  initialValues: PlaceChangeInput
  placeName: string
}

export default function PlaceContributionForm({ backHref, initialValues, placeName }: Props) {
  const [mapTarget, setMapTarget] = useState<'place' | 'parking'>('place')
  const [locationStatus, setLocationStatus] = useState('Clique sur la carte pour corriger le point du lieu.')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPickerKey, setPhotoPickerKey] = useState(0)
  const [submissionStatus, setSubmissionStatus] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
    setValue,
  } = useForm<PlaceChangeInput>({ resolver: zodResolver(placeChangeInputSchema), defaultValues: initialValues })
  const displayError = (field: string) => (errors as Record<string, { message?: string }>)[field]?.message
  const latitude = useWatch({ control, name: 'latitude' })
  const longitude = useWatch({ control, name: 'longitude' })
  const parkingLatitude = useWatch({ control, name: 'parkingLatitude' as never }) as number | null | undefined
  const parkingLongitude = useWatch({ control, name: 'parkingLongitude' as never }) as number | null | undefined
  const isCrag = initialValues.kind === 'falaise'

  const changePoint = ({ latitude: nextLatitude, longitude: nextLongitude }: { latitude: number; longitude: number }) => {
    const roundedLatitude = Number(nextLatitude.toFixed(6))
    const roundedLongitude = Number(nextLongitude.toFixed(6))
    if (mapTarget === 'parking' && isCrag) {
      setValue('parkingLatitude' as never, roundedLatitude as never, { shouldValidate: true })
      setValue('parkingLongitude' as never, roundedLongitude as never, { shouldValidate: true })
      setLocationStatus('Point du parking enregistré.')
      return
    }
    setValue('latitude', roundedLatitude, { shouldValidate: true })
    setValue('longitude', roundedLongitude, { shouldValidate: true })
    setLocationStatus('Point du lieu enregistré. Corrige aussi la commune si nécessaire.')
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
        : 'Une photo n’a pas pu être importée.'
      throw new Error(message)
    }
    return parsed.data.media.id
  }

  const cleanupPhotos = (ids: string[]) => {
    ids.forEach((id) => { void fetch(`/api/media/${id}`, { method: 'DELETE', keepalive: true }).catch(() => undefined) })
  }

  const submit = async (values: PlaceChangeInput) => {
    setSubmissionStatus('')
    setSubmitted(false)
    let uploadedIds: string[] = []
    try {
      uploadedIds = await Promise.all(photoFiles.map(uploadPhoto))
      const response = await fetch('/api/places/changes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, photoMediaIds: uploadedIds }),
      })
      const payload = await response.json() as ApiError
      if (!response.ok) {
        payload.issues?.forEach((issue) => setError(issue.path as never, { message: issue.message }))
        cleanupPhotos(uploadedIds)
        setSubmissionStatus(payload.error ?? 'La contribution n’a pas pu être envoyée.')
        return
      }
      setPhotoFiles([])
      setPhotoPickerKey((key) => key + 1)
      setSubmitted(true)
      setSubmissionStatus('Contribution envoyée pour validation.')
    } catch (error) {
      cleanupPhotos(uploadedIds)
      setSubmissionStatus(error instanceof Error ? error.message : 'La contribution n’a pas pu être envoyée. Réessaie dans un instant.')
    }
  }

  const common = <>
    <div className="grid gap-4 md:grid-cols-3">
      <Input label="Commune" error={errors.city?.message} {...register('city')} />
      <Input label="Département" error={errors.department?.message} {...register('department')} />
      <Input label="Région" error={errors.region?.message} {...register('region')} />
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <Input label="Source de l’information" type="url" placeholder="https://…" error={errors.sourceUrl?.message} {...register('sourceUrl')} />
      <Textarea className="min-h-11" label="Pourquoi cette correction ?" placeholder="Ex. changement d’accès, horaires confirmés…" error={errors.message?.message} {...register('message')} />
    </div>
    <Textarea label="Restrictions ou fermetures connues" error={errors.restrictions?.message} {...register('restrictions')} />
    <Textarea label="Informations complémentaires" error={errors.notes?.message} {...register('notes')} />
  </>

  return <form className="space-y-6" noValidate onSubmit={handleSubmit(submit)}>
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Corriger {placeName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-pretty text-muted-foreground">La fiche est préremplie avec les informations actuelles. Corrige ce qui est faux et ajoute des photos si elles aideront la communauté.</p>
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Nom du lieu" error={errors.name?.message} {...register('name')} />
          <div className="rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm"><p className="font-semibold">Type de lieu</p><p className="mt-1 text-muted-foreground">{isCrag ? 'Falaise / site extérieur' : 'Salle d’escalade'}</p></div>
        </div>
        <PhotoPicker disabled={isSubmitting} key={photoPickerKey} onChange={setPhotoFiles} />
      </CardContent>
    </Card>

    <Card hover={false}>
      <CardHeader><CardTitle>Localisation</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Point à placer sur la carte">
          <Button aria-pressed={mapTarget === 'place'} variant={mapTarget === 'place' ? 'primary' : 'secondary'} onClick={() => setMapTarget('place')}><MapPin size={17} aria-hidden="true" /> Lieu</Button>
          {isCrag && <Button aria-pressed={mapTarget === 'parking'} variant={mapTarget === 'parking' ? 'primary' : 'secondary'} onClick={() => setMapTarget('parking')}><ParkingCircle size={17} aria-hidden="true" /> Parking</Button>}
        </div>
        <div className="overflow-hidden rounded-lg border border-border"><PlaceMap latitude={latitude ?? 45.764} longitude={longitude ?? 4.8357} parkingLatitude={parkingLatitude} parkingLongitude={parkingLongitude} onChange={changePoint} /></div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite" role="status"><MapPin size={16} aria-hidden="true" />{locationStatus}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Latitude" type="number" step="any" error={errors.latitude?.message} {...register('latitude', { setValueAs: (value) => value === '' ? null : Number(value) })} />
          <Input label="Longitude" type="number" step="any" error={errors.longitude?.message} {...register('longitude', { setValueAs: (value) => value === '' ? null : Number(value) })} />
        </div>
        {isCrag && <fieldset className="rounded-lg border border-border p-4">
          <legend className="px-2 text-sm font-bold text-foreground">Point du parking</legend>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <Input label="Latitude parking" type="number" step="any" error={displayError('parkingLatitude')} {...register('parkingLatitude' as never, { setValueAs: (value) => value === '' ? null : Number(value) })} />
            <Input label="Longitude parking" type="number" step="any" error={displayError('parkingLongitude')} {...register('parkingLongitude' as never, { setValueAs: (value) => value === '' ? null : Number(value) })} />
            <Button className="w-full lg:w-auto" disabled={isSubmitting || (parkingLatitude === null && parkingLongitude === null)} variant="ghost" onClick={() => { setValue('parkingLatitude' as never, null as never, { shouldValidate: true }); setValue('parkingLongitude' as never, null as never, { shouldValidate: true }) }}>Effacer</Button>
          </div>
        </fieldset>}
        {common}
      </CardContent>
    </Card>

    <Card hover={false}>
      <CardHeader><CardTitle>Détails</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {isCrag ? <>
          <Controller control={control} name="disciplines" render={({ field }) => <ChoiceField label="Disciplines" name="disciplines" options={placeDisciplines.map((value) => ({ value, label: disciplineLabels[value] }))} value={field.value} onChange={field.onChange} error={errors.disciplines?.message} />} />
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-medium text-foreground">Type de roche<select className="spity-input mt-1.5 min-h-11" {...register('rockType' as never)}><option value="">Non renseigné</option>{rockTypes.map((value) => <option key={value} value={value}>{rockTypeLabels[value]}</option>)}</select></label>
            <label className="text-sm font-medium text-foreground">Exposition à la pluie<select className="spity-input mt-1.5 min-h-11" {...register('rainExposure' as never)}><option value="">Non renseignée</option>{rainExposures.map((value) => <option key={value} value={value}>{rainLabels[value]}</option>)}</select></label>
            <label className="text-sm font-medium text-foreground">Ensoleillement<select className="spity-input mt-1.5 min-h-11" {...register('sunlight' as never)}><option value="">Non renseigné</option>{sunlightOptions.map((value) => <option key={value} value={value}>{sunlightLabels[value]}</option>)}</select></label>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Controller control={control} name="seasons" render={({ field }) => <ChoiceField label="Saisons favorables" name="seasons" options={seasonOptions.map((value) => ({ value, label: seasonLabels[value] }))} value={field.value} onChange={field.onChange} error={displayError('seasons')} />} />
            <Controller control={control} name="orientations" render={({ field }) => <ChoiceField label="Orientations" name="orientations" options={orientationOptions.map((value) => ({ value, label: orientationLabels[value] }))} value={field.value} onChange={field.onChange} error={displayError('orientations')} />} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="Niveaux (séparés par une virgule)" error={displayError('levels')} {...register('levels' as never)} />
            <label className="text-sm font-medium text-foreground">Orientation principale<select className="spity-input mt-1.5 min-h-11" {...register('orientation' as never)}><option value="">Non renseignée</option>{(['nord', 'sud', 'est', 'ouest', 'multi'] as const).map((value) => <option key={value} value={value}>{value === 'multi' ? 'Multiple' : orientationLabels[value]}</option>)}</select></label>
            <label className="text-sm font-medium text-foreground">État du site<select className="spity-input mt-1.5 min-h-11" {...register('status' as never)}><option value="">Non renseigné</option><option value="sec">Sec</option><option value="humide">Humide</option><option value="attention">Attention</option><option value="ferme">Fermé</option></select></label>
          </div>
          <Textarea label="Accès au site" error={displayError('access')} {...register('access' as never)} />
          <div className="grid gap-4 md:grid-cols-2"><Input label="Temps et difficulté d’approche" error={displayError('approach')} {...register('approach' as never)} /><Input label="Stationnement" error={displayError('parking')} {...register('parking' as never)} /></div>
        </> : <>
          <Input label="Adresse complète" error={displayError('address')} {...register('address' as never)} />
          <Controller control={control} name="disciplines" render={({ field }) => <ChoiceField label="Disciplines" name="disciplines" options={(['voie', 'bloc', 'speed'] as const).map((value) => ({ value, label: disciplineLabels[value] }))} value={field.value} onChange={field.onChange} error={displayError('disciplines')} />} />
          <Controller control={control} name="services" render={({ field }) => <ChoiceField label="Services disponibles" name="services" options={placeServices.map((value) => ({ value, label: serviceLabels[value] }))} value={field.value} onChange={field.onChange} error={displayError('services')} />} />
          <div className="grid gap-4 md:grid-cols-2"><Input label="Horaires semaine" error={displayError('weekdayHours')} {...register('weekdayHours' as never)} /><Input label="Horaires week-end" error={displayError('weekendHours')} {...register('weekendHours' as never)} /></div>
          <div className="grid gap-4 md:grid-cols-3"><Input label="Tarif entrée" error={displayError('entryPrice')} {...register('entryPrice' as never)} /><Input label="Tarif abonnement" error={displayError('subscriptionPrice')} {...register('subscriptionPrice' as never)} /><label className="text-sm font-medium text-foreground">Fréquentation<select className="spity-input mt-1.5 min-h-11" {...register('attendance' as never)}><option value="">Non renseignée</option><option value="calme">Calme</option><option value="moderee">Modérée</option><option value="elevee">Élevée</option></select></label></div>
          <div className="grid gap-4 md:grid-cols-3"><Input label="Niveau minimum" error={displayError('minimumLevel')} {...register('minimumLevel' as never)} /><Input label="Niveau maximum" error={displayError('maximumLevel')} {...register('maximumLevel' as never)} /><Input label="Site web" type="url" error={displayError('website')} {...register('website' as never)} /></div>
        </>}
      </CardContent>
    </Card>

    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link className="text-center text-sm font-semibold text-muted-foreground hover:text-foreground" href={backHref}>Retour à la fiche</Link>
      <Button className="w-full sm:w-auto" isLoading={isSubmitting} loadingText="Envoi…" type="submit">Envoyer la contribution</Button>
    </div>
    {submissionStatus && <div className={cn('rounded-lg border p-4 text-sm font-medium', submitted ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-destructive/40 bg-destructive/10 text-destructive')} role={submitted ? 'status' : 'alert'}>{submitted && <Check className="mr-2 inline" size={18} aria-hidden="true" />}{submissionStatus}</div>}
  </form>
}
