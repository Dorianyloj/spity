'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarPlus, Save, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import {
  eventFormSchema,
  eventResponseSchema,
  type EventFormValues,
  type SpityEvent,
} from '../schemas'

type EventFormProps = {
  event?: SpityEvent
  onCancel?: () => void
  onSaved: (event: SpityEvent) => void
}

const defaultValues: EventFormValues = {
  title: '',
  type: 'outing',
  description: '',
  location: '',
  startsAt: '',
  endsAt: '',
  capacity: 8,
}

const toLocalDateTimeValue = (value: string | null) => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return localDate.toISOString().slice(0, 16)
}

const toFormValues = (event?: SpityEvent): EventFormValues => event ? {
  title: event.title,
  type: event.type,
  description: event.description ?? '',
  location: event.location ?? '',
  startsAt: toLocalDateTimeValue(event.startsAt),
  endsAt: toLocalDateTimeValue(event.endsAt),
  capacity: event.capacity,
} : defaultValues

const parseError = async (response: Response) => {
  const payload: unknown = await response.json().catch(() => null)
  const result = z.object({ error: z.string() }).safeParse(payload)

  return result.success ? result.data.error : 'L’événement n’a pas pu être enregistré'
}

export default function EventForm({ event, onCancel, onSaved }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: toFormValues(event),
  })

  useEffect(() => {
    form.reset(toFormValues(event))
  }, [event, form])

  const submit = async (values: EventFormValues) => {
    form.clearErrors('root')
    const payload = {
      title: values.title,
      type: values.type,
      description: values.description || null,
      location: values.location,
      startsAt: new Date(values.startsAt).toISOString(),
      endsAt: values.endsAt ? new Date(values.endsAt).toISOString() : null,
      capacity: values.capacity,
    }
    const response = await fetch(event ? `/api/events/${event.id}` : '/api/events', {
      method: event ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      form.setError('root', { message: await parseError(response) })
      return
    }

    const responsePayload: unknown = await response.json()
    const parsedResponse = eventResponseSchema.safeParse(responsePayload)

    if (!parsedResponse.success) {
      form.setError('root', { message: 'La réponse du serveur est invalide' })
      return
    }

    onSaved(parsedResponse.data.event)

    if (!event) {
      form.reset(defaultValues)
    }
  }

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>{event ? 'Modifier l’événement' : 'Publier un événement'}</CardTitle>
        <CardDescription>Les dates, la capacité et le lieu sont contrôlés avant publication.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)} noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Titre"
              placeholder="Sortie falaise découverte"
              error={form.formState.errors.title?.message}
              {...form.register('title')}
            />
            <label className="text-sm font-medium text-foreground">
              Type
              <select className="spity-input mt-1.5 min-h-11 w-full" {...form.register('type')}>
                <option value="outing">Sortie</option>
                <option value="contest">Contest</option>
                <option value="coaching">Coaching</option>
                <option value="initiation">Initiation</option>
              </select>
            </label>
          </div>
          <Textarea
            label="Description"
            placeholder="Niveau conseillé, matériel requis, programme..."
            error={form.formState.errors.description?.message}
            {...form.register('description')}
          />
          <Input
            label="Lieu"
            placeholder="Falaise de Curis, Rhône"
            error={form.formState.errors.location?.message}
            {...form.register('location')}
          />
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              label="Début"
              type="datetime-local"
              error={form.formState.errors.startsAt?.message}
              {...form.register('startsAt')}
            />
            <Input
              label="Fin"
              type="datetime-local"
              error={form.formState.errors.endsAt?.message}
              {...form.register('endsAt')}
            />
            <Input
              label="Capacité"
              type="number"
              min={1}
              max={1000}
              error={form.formState.errors.capacity?.message}
              {...form.register('capacity', { valueAsNumber: true })}
            />
          </div>
          <p className="min-h-5 text-sm font-semibold text-destructive" role="alert">
            {form.formState.errors.root?.message}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button isLoading={form.formState.isSubmitting} type="submit">
              {event ? <Save size={17} aria-hidden="true" /> : <CalendarPlus size={17} aria-hidden="true" />}
              {event ? 'Enregistrer' : 'Publier'}
            </Button>
            {onCancel && (
              <Button onClick={onCancel} type="button" variant="ghost">
                <X size={17} aria-hidden="true" />
                Fermer
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
