'use client'

import { useState, type FormEvent } from 'react'
import { AlertTriangle, CheckCircle2, CloudSun, Route } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { cn } from '@/lib/class-names'

type ContributionMode = 'condition' | 'route' | 'alert'

type CragContributionActionsProps = {
  falaiseId: string
  falaiseName: string
}

const modes: Array<{
  value: ContributionMode
  label: string
  description: string
  icon: typeof CloudSun
}> = [
  { value: 'condition', label: 'Déclarer l’état', description: 'Sec, humide ou fermé', icon: CloudSun },
  { value: 'route', label: 'Ajouter une voie', description: 'Cotation et informations utiles', icon: Route },
  { value: 'alert', label: 'Signaler une alerte', description: 'Accès ou sécurité', icon: AlertTriangle },
]

const numberOrNull = (value: FormDataEntryValue | null) => {
  if (typeof value !== 'string' || !value.trim()) return null
  return Number(value)
}

export default function CragContributionActions({ falaiseId, falaiseName }: CragContributionActionsProps) {
  const router = useRouter()
  const [mode, setMode] = useState<ContributionMode>('condition')
  const [formKey, setFormKey] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ kind: 'error' | 'success'; message: string } | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback(null)
    const values = new FormData(event.currentTarget)
    const endpoint = mode === 'route' ? '/api/places/routes' : '/api/places/reports'
    const body = mode === 'route'
      ? {
          falaiseId,
          nom: values.get('nom'),
          cotation: values.get('cotation'),
          secteur: values.get('secteur'),
          hauteur: numberOrNull(values.get('hauteur')),
          degaines: numberOrNull(values.get('degaines')),
          style: values.get('style'),
          status: values.get('status'),
        }
      : mode === 'condition'
        ? {
            falaiseId,
            type: 'condition',
            conditionState: values.get('conditionState'),
            message: values.get('message'),
          }
        : {
            falaiseId,
            type: values.get('type'),
            message: values.get('message'),
          }

    setIsSubmitting(true)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const payload: unknown = await response.json().catch(() => null)
      const error = payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : null

      if (!response.ok) {
        setFeedback({ kind: 'error', message: error ?? 'La contribution n’a pas pu être envoyée.' })
        return
      }

      const messages: Record<ContributionMode, string> = {
        condition: 'État mis à jour. Merci pour l’info.',
        route: 'Voie ajoutée à la fiche.',
        alert: 'Alerte ajoutée à la fiche.',
      }
      setFeedback({ kind: 'success', message: messages[mode] })
      setFormKey((key) => key + 1)
      setMode('condition')
      router.refresh()
    } catch {
      setFeedback({ kind: 'error', message: 'Connexion impossible. Réessaie dans un instant.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Contribuer à {falaiseName}</CardTitle>
        <CardDescription>Partage l’information qui aide à grimper ici aujourd’hui.</CardDescription>
      </CardHeader>
      <CardContent>
        <form key={formKey} className="space-y-5" onSubmit={submit}>
          <fieldset>
            <legend className="sr-only">Type de contribution</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {modes.map(({ value, label, description, icon: Icon }) => (
                <label
                  className={cn(
                    'cursor-pointer rounded-lg border p-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-card',
                    mode === value ? 'border-primary bg-primary/10' : 'border-border bg-white/[0.03] hover:border-primary/50'
                  )}
                  key={value}
                >
                  <input
                    checked={mode === value}
                    className="sr-only"
                    name="contributionMode"
                    onChange={() => { setMode(value); setFeedback(null) }}
                    type="radio"
                    value={value}
                  />
                  <span className="flex items-center gap-2 text-sm font-bold text-foreground"><Icon className="text-primary" size={17} />{label}</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {mode === 'condition' && <div className="grid gap-4 sm:grid-cols-[minmax(0,220px)_1fr]">
            <label className="block text-sm font-medium text-foreground">
              État actuel
              <select className="spity-input mt-1.5 min-h-11 w-full" defaultValue="sec" name="conditionState" required>
                <option value="sec">Sec</option>
                <option value="humide">Humide</option>
                <option value="attention">À surveiller</option>
                <option value="ferme">Fermé</option>
              </select>
            </label>
            <Textarea label="Précision facultative" maxLength={500} name="message" placeholder="Ex. ressuyage en cours dans le dévers." rows={3} />
          </div>}

          {mode === 'route' && <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nom de la voie" maxLength={255} name="nom" placeholder="Ex. Le pas du loup" required />
            <Input label="Cotation" maxLength={4} name="cotation" pattern="[3-9][a-c]\\+?" placeholder="6a+" required />
            <Input label="Secteur" maxLength={120} name="secteur" placeholder="Facultatif" />
            <label className="block text-sm font-medium text-foreground">
              Style
              <select className="spity-input mt-1.5 min-h-11 w-full" defaultValue="" name="style">
                <option value="">À préciser</option>
                <option value="dalle">Dalle</option>
                <option value="vertical">Vertical</option>
                <option value="devers">Dévers</option>
                <option value="fissure">Fissure</option>
                <option value="pilier">Pilier</option>
                <option value="mixte">Mixte</option>
              </select>
            </label>
            <Input label="Hauteur (m)" max={2000} min={1} name="hauteur" placeholder="Facultatif" type="number" />
            <Input label="Dégaines" max={100} min={1} name="degaines" placeholder="Facultatif" type="number" />
            <label className="block text-sm font-medium text-foreground sm:col-span-2">
              État de l’équipement
              <select className="spity-input mt-1.5 min-h-11 w-full" defaultValue="ok" name="status">
                <option value="ok">OK</option>
                <option value="humide">Humide</option>
                <option value="spit_a_verifier">Spit à vérifier</option>
                <option value="fermee">Fermée</option>
              </select>
            </label>
          </div>}

          {mode === 'alert' && <div className="grid gap-4 sm:grid-cols-[minmax(0,220px)_1fr]">
            <label className="block text-sm font-medium text-foreground">
              Nature de l’alerte
              <select className="spity-input mt-1.5 min-h-11 w-full" defaultValue="safety" name="type" required>
                <option value="safety">Sécurité</option>
                <option value="access">Accès</option>
                <option value="info">Information</option>
              </select>
            </label>
            <Textarea label="Ce qui se passe" maxLength={500} minLength={8} name="message" placeholder="Décris précisément la situation et le secteur concerné." required rows={3} />
          </div>}

          <div className="flex flex-wrap items-center gap-3">
            <Button isLoading={isSubmitting} loadingText="Envoi…" type="submit">
              {mode === 'condition' ? 'Mettre à jour l’état' : mode === 'route' ? 'Ajouter la voie' : 'Envoyer l’alerte'}
            </Button>
            {feedback && <p aria-live="polite" className={cn('text-sm font-medium', feedback.kind === 'error' ? 'text-destructive' : 'text-primary')}>
              {feedback.kind === 'success' && <CheckCircle2 className="mr-1 inline-block" size={16} />}{feedback.message}
            </p>}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
