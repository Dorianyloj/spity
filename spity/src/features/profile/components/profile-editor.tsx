'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Avatar, Button, Input, Textarea } from '@/components/ui'
import { disciplinesEnum } from '@/lib/validators'
import { profileMeResponseSchema, type ProfileMeResponse } from '../schemas'
import { profileSettingsSchema } from '../workspace-schemas'
import { availabilityLabels, disciplineLabels, environmentLabels, goalOptions, gradeOptions, partnerLevelLabels, partnerStyleLabels, type ProfileEditorKind } from '../lib/presentation'
import ProfileDialog from './profile-dialog'
import { apiData, Choice, failureMessage, FormError, ProfileSelect, uploadProfileImage } from './profile-fields'

export default function ProfileEditor({ kind, profile, onClose, onSaved }: { kind: ProfileEditorKind; profile: ProfileMeResponse; onClose: () => void; onSaved: (profile: ProfileMeResponse) => void }) {
  const climber = profile.grimpeurProfile!
  const [selected, setSelected] = useState(climber.disciplines)
  const [file, setFile] = useState<File | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const uploaded = useRef<string | null>(null)
  const attached = useRef(false)
  const previewRef = useRef<string | null>(null)
  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    if (uploaded.current && !attached.current) void fetch(`/api/media/${uploaded.current}`, { method: 'DELETE', keepalive: true }).catch(() => undefined)
  }, [])
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const text = (name: string) => String(data.get(name) ?? '').trim() || null
    const values = kind === 'identity' ? { section: kind, displayName: text('displayName') ?? '', bio: text('bio'), location: text('location'), ...(removeAvatar ? { avatarMediaId: null } : {}) }
      : kind === 'practice' ? { section: kind, disciplines: selected, niveaux: Object.fromEntries(selected.map((key) => [key, text(`niveaux.${key}`)])), climbingEnvironment: text('climbingEnvironment'), goals: data.getAll('goals') }
        : { section: kind, availability: data.getAll('availability'), partnerSearch: { enabled: data.has('enabled'), levelPreference: text('levelPreference'), style: text('style'), notes: text('notes'), shareEquipment: data.has('shareEquipment') } }
    setErrors({}); setError(null)
    const parsed = profileSettingsSchema.safeParse(values)
    if (!parsed.success) {
      const fields = Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message]))
      setErrors(fields); setError('Vérifie les champs indiqués.')
      const first = form.elements.namedItem(parsed.error.issues[0].path.join('.'))
      if (first instanceof HTMLElement) first.focus()
      return
    }
    setBusy(true)
    try {
      if (file && parsed.data.section === 'identity') {
        uploaded.current ??= (await uploadProfileImage(file)).id
        parsed.data.avatarMediaId = uploaded.current
      }
      const response = await fetch('/api/profile/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) })
      const fresh = profileMeResponseSchema.parse(await apiData(response))
      attached.current = true
      // A replaced avatar may be cleaned up only through the owner endpoint, which
      // refuses attached images (including photos still used by a publication).
      const oldId = profile.user.avatarUrl?.match(/^\/api\/avatars\/([\w-]+)$/)?.[1]
      if (oldId && fresh.user.avatarUrl !== profile.user.avatarUrl) void fetch(`/api/media/${oldId}`, { method: 'DELETE' }).catch(() => undefined)
      onSaved(fresh)
    } catch (error) { setError(failureMessage(error)) }
    finally { setBusy(false) }
  }
  function changeFile(next: File | null) {
    if (uploaded.current && !attached.current) void fetch(`/api/media/${uploaded.current}`, { method: 'DELETE' }).catch(() => undefined)
    uploaded.current = null
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = next ? URL.createObjectURL(next) : null
    setFile(next); setPreview(previewRef.current); setRemoveAvatar(false)
  }
  const titles = { identity: 'Un profil qui te ressemble', practice: 'Ma pratique et mes envies', partners: 'Grimper avec les bonnes personnes' }
  return <ProfileDialog title={titles[kind]} description="Ces informations sont visibles aux membres connectés. Rien ne change tant que tu n’enregistres pas." onClose={onClose} busy={busy}>
    <form onSubmit={save} noValidate><fieldset disabled={busy} className="space-y-5 p-5 sm:p-6">
      {kind === 'identity' && <>
        <div className="flex flex-wrap items-center gap-4"><Avatar size="xl" className="size-20" src={removeAvatar ? undefined : preview || profile.user.avatarUrl || undefined} fallback={climber.displayName || 'Spity'} alt="Aperçu de la photo de profil" /><div className="min-w-0 flex-1 basis-48"><Input type="file" accept="image/jpeg,image/png,image/webp" label="Photo de profil" onChange={(event) => { void changeFile(event.target.files?.[0] ?? null) }} /><p className="mt-2 text-xs text-muted-foreground">JPG, PNG ou WebP · 5 Mio maximum. Les métadonnées de localisation sont retirées.</p></div></div>
        <Button variant="ghost" onClick={() => { changeFile(null); setRemoveAvatar(true) }}>Utiliser mes initiales</Button>
        <div className="grid gap-4 sm:grid-cols-2"><Input name="displayName" label="Nom affiché" required minLength={2} maxLength={80} defaultValue={climber.displayName ?? ''} error={errors.displayName} /><Input name="location" label="Ville ou secteur" maxLength={255} defaultValue={climber.location ?? ''} error={errors.location} /></div>
        <Textarea name="bio" label="Quelques mots sur toi" maxLength={500} defaultValue={climber.bio ?? ''} error={errors.bio} />
        <p className="text-pretty text-xs text-muted-foreground">Choisis une ville ou un secteur, pas une adresse précise. Ton adresse e-mail reste privée.</p>
      </>}
      {kind === 'practice' && <>
        <fieldset><legend className="mb-3 text-sm font-medium">Disciplines et niveaux déclarés</legend><div className="space-y-3">{disciplinesEnum.options.map((key) => <div key={key} className="grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-3"><Choice><input type="checkbox" name="disciplines" value={key} checked={selected.includes(key)} onChange={(event) => setSelected((items) => event.target.checked ? [...items, key] : items.filter((item) => item !== key))} />{disciplineLabels[key]}</Choice><ProfileSelect name={`niveaux.${key}`} label={`Niveau ${disciplineLabels[key]}`} disabled={!selected.includes(key)} defaultValue={climber.niveaux[key] ?? '5a'} options={Object.fromEntries(gradeOptions.map((grade) => [grade, grade]))} error={errors[`niveaux.${key}`]} /></div>)}</div><FormError message={errors.disciplines ?? null} /></fieldset>
        <ProfileSelect name="climbingEnvironment" label="Environnement préféré" defaultValue={climber.climbingEnvironment ?? ''} options={{ '': 'À préciser', ...environmentLabels }} />
        <fieldset><legend className="mb-3 text-sm font-medium">Mes objectifs</legend><div className="grid gap-2 sm:grid-cols-2">{[...new Set([...goalOptions, ...climber.goals])].map((goal) => <Choice key={goal}><input type="checkbox" name="goals" value={goal} defaultChecked={climber.goals.includes(goal)} />{goal}</Choice>)}</div><FormError message={errors.goals ?? null} /></fieldset>
      </>}
      {kind === 'partners' && <>
        <Choice><input type="checkbox" name="enabled" defaultChecked={climber.partnerSearch.enabled} />Je recherche des partenaires en ce moment</Choice>
        <p className="text-pretty text-xs text-muted-foreground">Une pause retire le bouton de demande et ta présence dans la recherche de partenaires, pas le reste de ta fiche.</p>
        <div className="grid gap-4 sm:grid-cols-2"><ProfileSelect name="levelPreference" label="Niveau recherché" options={partnerLevelLabels} defaultValue={climber.partnerSearch.levelPreference} /><ProfileSelect name="style" label="Style de session" options={partnerStyleLabels} defaultValue={climber.partnerSearch.style} /></div>
        <fieldset><legend className="mb-3 text-sm font-medium">Disponibilités habituelles</legend><div className="grid gap-2 sm:grid-cols-2">{Object.entries(availabilityLabels).map(([key, label]) => <Choice key={key}><input type="checkbox" name="availability" value={key} defaultChecked={climber.availability.some((value) => value === key)} />{label}</Choice>)}</div></fieldset>
        <Textarea name="notes" label="Un mot pour les futurs partenaires" maxLength={300} defaultValue={climber.partnerSearch.notes ?? ''} />
        <Choice><input type="checkbox" name="shareEquipment" defaultChecked={climber.partnerSearch.shareEquipment === true} />Afficher mon matériel partagé sur ma fiche membre</Choice>
        <p className="text-pretty text-xs text-muted-foreground">Uniquement les équipements marqués disponibles pour une session. Les notes et le reste de l’inventaire ne sont jamais affichés.</p>
      </>}
      <FormError message={error} />
    </fieldset><div className="flex flex-wrap justify-end gap-3 border-t border-border bg-muted/30 p-5"><Button variant="secondary" disabled={busy} onClick={onClose}>Annuler</Button><Button type="submit" isLoading={busy} loadingText="Enregistrement…">Enregistrer</Button></div></form>
  </ProfileDialog>
}
