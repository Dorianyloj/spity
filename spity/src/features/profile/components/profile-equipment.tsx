'use client'

import { Backpack, LockKeyhole, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Badge, Button, Input, Textarea } from '@/components/ui'
import { createUserEquipmentBodySchema, equipmentItemResponseSchema, type UserEquipment } from '../schemas'
import type { SharedEquipment } from '../lib/public-profile-repository'
import { categoryLabels, conditionLabels } from '../lib/presentation'
import ProfileDialog from './profile-dialog'
import { apiData, Choice, failureMessage, FormError, ProfileSelect } from './profile-fields'
import { ProfileCard, ProfileEmpty } from './profile-presentation'

export default function ProfileEquipment({ equipment, onChange, sharingEnabled = false, onSharing }: { equipment: (UserEquipment | SharedEquipment)[]; onChange?: (equipment: UserEquipment[]) => void; sharingEnabled?: boolean; onSharing?: () => void }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState<UserEquipment | 'new' | null>(null)
  const [deleting, setDeleting] = useState<UserEquipment | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState('')
  const owner = Boolean(onChange)
  const visible = equipment.filter((item) => `${categoryLabels[item.category]} ${item.brand ?? ''} ${item.model}`.toLocaleLowerCase('fr-FR').includes(query.toLocaleLowerCase('fr-FR').trim()) && (!owner || filter === 'all' || (filter === 'shared' ? (item as UserEquipment).availableForPartner : !(item as UserEquipment).availableForPartner)))
  const draft = editing && editing !== 'new' ? editing : null
  function open(item: UserEquipment | 'new') { setEditing(item); setErrors({}); setError(null) }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const values = Object.fromEntries(data)
    const parsed = createUserEquipmentBodySchema.safeParse({ ...values, availableForPartner: data.has('availableForPartner') })
    setErrors({}); setError(null)
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((issue) => [issue.path.join('.'), issue.message])))
      const first = form.elements.namedItem(parsed.error.issues[0].path.join('.')); if (first instanceof HTMLElement) first.focus()
      return
    }
    setBusy(true)
    try {
      const item = equipmentItemResponseSchema.parse(await apiData(await fetch(draft ? `/api/profile/equipment/${draft.id}` : '/api/profile/equipment', { method: draft ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data) }))).equipment
      onChange?.(draft ? (equipment as UserEquipment[]).map((existing) => existing.id === item.id ? item : existing) : [item, ...equipment as UserEquipment[]])
      setEditing(null); setFeedback(draft ? 'Matériel mis à jour.' : 'Matériel ajouté.')
    } catch (error) { setError(failureMessage(error)) } finally { setBusy(false) }
  }
  async function remove() {
    if (!deleting) return
    setBusy(true); setError(null)
    try { await apiData(await fetch(`/api/profile/equipment/${deleting.id}`, { method: 'DELETE' })); onChange?.((equipment as UserEquipment[]).filter((item) => item.id !== deleting.id)); setDeleting(null); setFeedback('Équipement retiré de ton inventaire.') }
    catch (error) { setError(failureMessage(error)) } finally { setBusy(false) }
  }
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-4 text-white"><div><h2 className="text-balance text-xl font-bold">{owner ? 'Mon matériel' : 'Matériel partagé'}</h2><p className="mt-1 text-pretty text-sm text-white/75">{owner ? 'Ton inventaire personnel, et ce que tu choisis de partager.' : 'Des équipements disponibles pendant une session commune.'}</p></div>{owner && <Button onClick={() => open('new')}><Plus aria-hidden="true" size={16} />Ajouter du matériel</Button>}</div>
    {owner && <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-secondary p-4 text-sm"><p className="flex items-start gap-2 text-pretty"><LockKeyhole size={18} className="shrink-0" aria-hidden="true" />{sharingEnabled ? 'Seuls les équipements marqués disponibles sont visibles sur ta fiche, sans leurs notes.' : 'Ton inventaire n’est pas affiché sur ta fiche membre. Active le partage si tu le souhaites.'}</p><Button variant="secondary" onClick={onSharing}>Régler le partage</Button></div>}
    <div className="grid gap-3 rounded-lg bg-card p-4 sm:grid-cols-2"><Input label="Rechercher du matériel" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />{owner && <ProfileSelect label="Disponibilité" value={filter} onChange={(event) => setFilter(event.target.value)} options={{ all: 'Tout mon matériel', shared: 'Disponible en session', private: 'Personnel uniquement' }} />}<p className="text-xs text-muted-foreground tabular-nums" role="status">{visible.length} référence(s)</p></div>
    {feedback && <p role="status" className="text-sm text-secondary">{feedback}</p>}
    {visible.length ? <div className="grid gap-4 md:grid-cols-2">{visible.map((item) => <ProfileCard key={item.id} title={`${item.brand ?? ''} ${item.model}`.trim()} icon={Backpack} description={categoryLabels[item.category]}>
      <p className="text-sm tabular-nums">Quantité : {item.quantity}{item.lengthMeters ? ` · ${item.lengthMeters} m` : ''}{item.diameterMm ? ` · ${item.diameterMm} mm` : ''}{item.color ? ` · ${item.color}` : ''}{item.size ? ` · ${item.size}` : ''}</p><div className="mt-3 flex flex-wrap gap-2"><Badge>{conditionLabels[item.condition]}</Badge>{owner && <Badge variant={(item as UserEquipment).availableForPartner ? 'success' : 'default'}>{(item as UserEquipment).availableForPartner ? 'Disponible en session' : 'Personnel'}</Badge>}</div>
      {owner && (item as UserEquipment).notes && <p className="mt-4 wrap-anywhere whitespace-pre-wrap rounded-lg border border-border bg-muted/20 p-3 text-pretty text-xs text-muted-foreground">Notes privées : {(item as UserEquipment).notes}</p>}
      {owner && <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-border pt-3"><Button variant="ghost" onClick={() => open(item as UserEquipment)} aria-label={`Modifier ${item.model}`}><Pencil size={16} aria-hidden="true" />Modifier</Button><Button variant="ghost" aria-label={`Retirer ${item.model}`} onClick={() => { setDeleting(item as UserEquipment); setError(null) }}><Trash2 size={16} aria-hidden="true" /></Button></div>}
    </ProfileCard>)}</div> : <div className="rounded-lg bg-card p-5"><ProfileEmpty title="Aucun matériel à afficher" action={query || filter !== 'all' ? <Button variant="secondary" onClick={() => { setQuery(''); setFilter('all') }}>Effacer les filtres</Button> : owner ? <Button onClick={() => open('new')}>Ajouter un équipement</Button> : <a className="spity-btn spity-btn--secondary" href="/app/matching">Voir les partenaires</a>}>{query || filter !== 'all' ? 'Essaie une autre recherche ou enlève les filtres.' : owner ? 'Ajoute un premier équipement pour préparer tes sessions.' : 'Ce membre ne partage pas de matériel pour le moment.'}</ProfileEmpty></div>}
    <p className="text-pretty text-xs text-white/75">L’état est déclaratif. Le partage ne constitue ni une réservation ni une garantie de sécurité.</p>
    {editing && <ProfileDialog title={draft ? 'Modifier un équipement' : 'Ajouter du matériel'} description="Les notes restent privées, même pour un équipement partagé." onClose={() => setEditing(null)} busy={busy}>
      <form onSubmit={save} noValidate><fieldset disabled={busy} className="space-y-4 p-5 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><ProfileSelect name="category" label="Catégorie" options={categoryLabels} defaultValue={draft?.category ?? 'corde'} /><Input name="quantity" label="Quantité" type="number" required min={1} max={200} defaultValue={draft?.quantity ?? 1} error={errors.quantity} /><Input name="brand" label="Marque" maxLength={80} defaultValue={draft?.brand ?? ''} error={errors.brand} /><Input name="model" label="Modèle ou nom" required maxLength={120} defaultValue={draft?.model ?? ''} error={errors.model} /><Input name="color" label="Couleur" maxLength={60} defaultValue={draft?.color ?? ''} /><Input name="size" label="Taille" maxLength={60} defaultValue={draft?.size ?? ''} /><Input name="lengthMeters" label="Longueur en mètres" type="number" min={1} max={200} defaultValue={draft?.lengthMeters ?? ''} error={errors.lengthMeters} /><Input name="diameterMm" label="Diamètre en millimètres" maxLength={20} defaultValue={draft?.diameterMm ?? ''} /><ProfileSelect name="condition" label="État déclaré" options={conditionLabels} defaultValue={draft?.condition ?? 'bon'} /></div><Choice><input type="checkbox" name="availableForPartner" defaultChecked={draft?.availableForPartner ?? false} />Disponible pendant une session commune</Choice><Textarea name="notes" label="Notes privées" maxLength={500} defaultValue={draft?.notes ?? ''} error={errors.notes} /><FormError message={error} /></fieldset><div className="flex flex-wrap justify-end gap-3 border-t border-border p-5"><Button variant="secondary" onClick={() => setEditing(null)} disabled={busy}>Annuler</Button><Button type="submit" isLoading={busy} loadingText="Enregistrement…">Enregistrer le matériel</Button></div></form>
    </ProfileDialog>}
    {deleting && <ProfileDialog title="Retirer cet équipement ?" description={`${deleting.model} sera supprimé de ton inventaire et de ta fiche membre. Cette action est définitive.`} destructive busy={busy} onClose={() => setDeleting(null)}><div className="space-y-4 p-5"><FormError message={error} /><div className="flex flex-wrap justify-end gap-3"><Button variant="secondary" disabled={busy} onClick={() => setDeleting(null)}>Annuler</Button><Button variant="destructive" isLoading={busy} loadingText="Retrait…" onClick={remove}>Retirer l’équipement</Button></div></div></ProfileDialog>}
  </div>
}
