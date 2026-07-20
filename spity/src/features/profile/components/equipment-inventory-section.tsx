'use client'

import { Package, Pencil, Plus, Save, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import {
  createUserEquipmentBodySchema,
  equipmentItemResponseSchema,
  parseEquipmentResponseSchema,
  type CreateUserEquipmentBody,
  type UserEquipment,
} from '../schemas'

type EquipmentInventorySectionProps = {
  equipment: UserEquipment[]
  onEquipmentChange: (equipment: UserEquipment[]) => void
}

type EquipmentDraftField = keyof CreateUserEquipmentBody

const categoryOptions: Array<{ value: CreateUserEquipmentBody['category']; label: string }> = [
  { value: 'chaussons', label: 'Chaussons' },
  { value: 'baudrier', label: 'Baudrier' },
  { value: 'corde', label: 'Corde' },
  { value: 'degaine', label: 'Dégaine' },
  { value: 'mousqueton', label: 'Mousqueton' },
  { value: 'assureur', label: 'Assureur' },
  { value: 'casque', label: 'Casque' },
  { value: 'crashpad', label: 'Crashpad' },
  { value: 'longe', label: 'Longe' },
  { value: 'sac', label: 'Sac' },
  { value: 'autre', label: 'Autre' },
]

const conditionOptions: Array<{ value: CreateUserEquipmentBody['condition']; label: string }> = [
  { value: 'neuf', label: 'Neuf' },
  { value: 'bon', label: 'Bon état' },
  { value: 'use', label: 'Usé' },
  { value: 'a_verifier', label: 'À vérifier' },
]

const categoryLabels = Object.fromEntries(categoryOptions.map((option) => [option.value, option.label]))
const conditionLabels = Object.fromEntries(conditionOptions.map((option) => [option.value, option.label]))

const emptyDraft: CreateUserEquipmentBody = {
  category: 'degaine',
  quantity: 1,
  brand: null,
  model: '',
  color: null,
  size: null,
  lengthMeters: null,
  diameterMm: null,
  condition: 'bon',
  availableForPartner: true,
  notes: null,
}

const apiErrorSchema = z.object({
  error: z.string(),
  issues: z.array(z.string()).optional(),
})

const parseApiError = async (response: Response) => {
  const data: unknown = await response.json().catch(() => null)
  const parsedData = apiErrorSchema.safeParse(data)

  if (!parsedData.success) {
    return 'Une erreur est survenue'
  }

  return parsedData.data.issues?.[0] ?? parsedData.data.error
}

const toEquipmentPayload = (equipmentItem: UserEquipment): CreateUserEquipmentBody => ({
  category: equipmentItem.category,
  quantity: equipmentItem.quantity,
  brand: equipmentItem.brand,
  model: equipmentItem.model,
  color: equipmentItem.color,
  size: equipmentItem.size,
  lengthMeters: equipmentItem.lengthMeters,
  diameterMm: equipmentItem.diameterMm,
  condition: equipmentItem.condition,
  availableForPartner: equipmentItem.availableForPartner,
  notes: equipmentItem.notes,
})

export default function EquipmentInventorySection({ equipment, onEquipmentChange }: EquipmentInventorySectionProps) {
  const [draft, setDraft] = useState<CreateUserEquipmentBody>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [quickText, setQuickText] = useState('')
  const [pendingItems, setPendingItems] = useState<CreateUserEquipmentBody[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const equipmentCount = equipment.reduce((total, item) => total + item.quantity, 0)

  const updateDraft = (field: EquipmentDraftField, value: CreateUserEquipmentBody[EquipmentDraftField]) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }))
  }

  const updatePendingItem = (index: number, field: EquipmentDraftField, value: CreateUserEquipmentBody[EquipmentDraftField]) => {
    setPendingItems((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  }

  const resetDraft = () => {
    setDraft(emptyDraft)
    setEditingId(null)
  }

  const saveEquipment = async (values: CreateUserEquipmentBody, id: string | null = null) => {
    const parsedValues = createUserEquipmentBodySchema.safeParse(values)

    if (!parsedValues.success) {
      setFeedback(parsedValues.error.issues[0]?.message ?? 'Matériel invalide')
      return null
    }

    const response = await fetch(id ? `/api/profile/equipment/${id}` : '/api/profile/equipment', {
      method: id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedValues.data),
    })

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      return null
    }

    const data: unknown = await response.json()
    const parsedData = equipmentItemResponseSchema.safeParse(data)

    if (!parsedData.success) {
      setFeedback('Réponse API matériel invalide')
      return null
    }

    return parsedData.data.equipment
  }

  const submitDraft = async () => {
    setFeedback(null)
    setIsSaving(true)
    const savedEquipment = await saveEquipment(draft, editingId)
    setIsSaving(false)

    if (!savedEquipment) {
      return
    }

    if (editingId) {
      onEquipmentChange(equipment.map((item) => item.id === savedEquipment.id ? savedEquipment : item))
      setFeedback('Matériel mis à jour')
    } else {
      onEquipmentChange([savedEquipment, ...equipment])
      setFeedback('Matériel ajouté')
    }

    resetDraft()
  }

  const parseQuickText = async () => {
    setFeedback(null)
    setIsParsing(true)
    const response = await fetch('/api/profile/equipment/parse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: quickText }),
    })
    setIsParsing(false)

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      return
    }

    const data: unknown = await response.json()
    const parsedData = parseEquipmentResponseSchema.safeParse(data)

    if (!parsedData.success) {
      setFeedback('Analyse matériel invalide')
      return
    }

    setPendingItems(parsedData.data.items)
    setFeedback(`${parsedData.data.items.length} élément(s) préparé(s). Corrigez puis enregistrez.`)
  }

  const savePendingItem = async (index: number) => {
    setFeedback(null)
    const savedEquipment = await saveEquipment(pendingItems[index])

    if (!savedEquipment) {
      return
    }

    onEquipmentChange([savedEquipment, ...equipment])
    setPendingItems((items) => items.filter((_, itemIndex) => itemIndex !== index))
    setFeedback('Matériel ajouté')
  }

  const deleteEquipment = async (equipmentId: string) => {
    setFeedback(null)
    setDeletingId(equipmentId)
    const response = await fetch(`/api/profile/equipment/${equipmentId}`, { method: 'DELETE' })
    setDeletingId(null)

    if (!response.ok) {
      setFeedback(await parseApiError(response))
      return
    }

    onEquipmentChange(equipment.filter((item) => item.id !== equipmentId))
    setFeedback('Matériel supprimé')
  }

  const startEditing = (equipmentItem: UserEquipment) => {
    setDraft(toEquipmentPayload(equipmentItem))
    setEditingId(equipmentItem.id)
    setFeedback(null)
  }

  const renderDraftFields = (
    values: CreateUserEquipmentBody,
    onChange: (field: EquipmentDraftField, value: CreateUserEquipmentBody[EquipmentDraftField]) => void
  ) => (
    <div className="grid gap-3 md:grid-cols-2">
      <label className="space-y-1.5 text-sm font-medium text-foreground">
        Catégorie
        <select className="spity-input" value={values.category} onChange={(event) => onChange('category', event.target.value as CreateUserEquipmentBody['category'])}>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <Input
        label="Quantité"
        min={1}
        max={200}
        type="number"
        value={values.quantity}
        onChange={(event) => onChange('quantity', Number(event.target.value))}
      />

      <Input
        label="Marque"
        placeholder="Petzl, Black Diamond..."
        value={values.brand ?? ''}
        onChange={(event) => onChange('brand', event.target.value)}
      />

      <Input
        label="Modèle"
        placeholder="Djinn Axess, Joker 9.1..."
        value={values.model}
        onChange={(event) => onChange('model', event.target.value)}
      />

      <Input
        label="Couleur"
        placeholder="Turquoise, rouge..."
        value={values.color ?? ''}
        onChange={(event) => onChange('color', event.target.value)}
      />

      <Input
        label="Taille"
        placeholder="M, 42, L..."
        value={values.size ?? ''}
        onChange={(event) => onChange('size', event.target.value)}
      />

      <Input
        label="Longueur corde (m)"
        min={1}
        max={200}
        type="number"
        value={values.lengthMeters ?? ''}
        onChange={(event) => onChange('lengthMeters', event.target.value === '' ? null : Number(event.target.value))}
      />

      <Input
        label="Diamètre corde (mm)"
        placeholder="9.1"
        value={values.diameterMm ?? ''}
        onChange={(event) => onChange('diameterMm', event.target.value)}
      />

      <label className="space-y-1.5 text-sm font-medium text-foreground">
        État
        <select className="spity-input" value={values.condition} onChange={(event) => onChange('condition', event.target.value as CreateUserEquipmentBody['condition'])}>
          {conditionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm">
        <input
          checked={values.availableForPartner}
          type="checkbox"
          onChange={(event) => onChange('availableForPartner', event.target.checked)}
        />
        Disponible pour une sortie avec partenaire
      </label>

      <div className="md:col-span-2">
        <Textarea
          label="Notes"
          placeholder="Année d’achat, usage falaise, remarque sécurité..."
          value={values.notes ?? ''}
          onChange={(event) => onChange('notes', event.target.value)}
        />
      </div>
    </div>
  )

  return (
    <Card hover={false}>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Inventaire matériel</CardTitle>
            <CardDescription>Déclarez le matériel exact disponible pour les sorties et le matching.</CardDescription>
          </div>
          <Badge variant="primary">{equipmentCount} objet(s)</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {feedback && (
          <div
            className="rounded-lg border border-border bg-muted p-3 text-sm font-medium text-foreground"
            role="status"
            aria-live="polite"
          >
            {feedback}
          </div>
        )}

        <section className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-coral" size={18} />
            <h3 className="font-semibold text-foreground">Ajout rapide assisté</h3>
          </div>
          <Textarea
            className="mt-3"
            label="Liste libre"
            placeholder="10 dégaines Djinn Axess turquoise&#10;2 mousquetons Black Diamond&#10;1 corde Beal Joker 9.1mm 70m"
            value={quickText}
            onChange={(event) => setQuickText(event.target.value)}
          />
          <div className="mt-3 flex flex-wrap gap-3">
            <Button type="button" variant="secondary" isLoading={isParsing} onClick={() => void parseQuickText()}>
              <Sparkles size={16} />
              Analyser
            </Button>
            {pendingItems.length > 0 && (
              <Button type="button" variant="ghost" onClick={() => setPendingItems([])}>
                Vider les brouillons
              </Button>
            )}
          </div>
        </section>

        {pendingItems.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-semibold text-foreground">Brouillons à valider</h3>
            {pendingItems.map((item, index) => (
              <div key={`${item.model}-${index}`} className="rounded-lg border border-border p-4">
                {renderDraftFields(item, (field, value) => updatePendingItem(index, field, value))}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button type="button" size="sm" onClick={() => void savePendingItem(index)}>
                    <Save size={16} />
                    Enregistrer
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setPendingItems((items) => items.filter((_, itemIndex) => itemIndex !== index))}>
                    Retirer
                  </Button>
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-2">
            <Plus className="text-coral" size={18} />
            <h3 className="font-semibold text-foreground">{editingId ? 'Modifier le matériel' : 'Ajouter manuellement'}</h3>
          </div>
          <div className="mt-4">{renderDraftFields(draft, updateDraft)}</div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" isLoading={isSaving} onClick={() => void submitDraft()}>
              <Save size={16} />
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </Button>
            {editingId && (
              <Button type="button" variant="ghost" onClick={resetDraft}>
                Annuler
              </Button>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-semibold text-foreground">Matériel enregistré</h3>
          {equipment.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground">
              Aucun matériel détaillé pour le moment.
            </div>
          ) : (
            <div className="grid gap-3">
              {equipment.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-coral-light text-coral">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.quantity} x {item.brand ? `${item.brand} ` : ''}{item.model}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {categoryLabels[item.category]} · {conditionLabels[item.condition]}
                          {item.color ? ` · ${item.color}` : ''}
                          {item.lengthMeters ? ` · ${item.lengthMeters}m` : ''}
                          {item.diameterMm ? ` · ${item.diameterMm}mm` : ''}
                        </p>
                        {item.notes && <p className="mt-2 text-sm text-muted-foreground">{item.notes}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button type="button" size="sm" variant="ghost" onClick={() => startEditing(item)}>
                        <Pencil size={16} />
                        Modifier
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        isLoading={deletingId === item.id}
                        onClick={() => void deleteEquipment(item.id)}
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  )
}
