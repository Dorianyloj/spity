import { createEventBodySchema, eventFormSchema, updateEventBodySchema } from './schemas'

const validEvent = {
  title: 'Sortie falaise à Curis',
  type: 'outing',
  description: 'Une sortie encadrée.',
  location: 'Curis-au-Mont-d’Or',
  startsAt: '2026-08-10T08:00:00.000Z',
  endsAt: '2026-08-10T16:00:00.000Z',
  capacity: 8,
}

describe('event schemas', () => {
  it('accepte un événement complet', () => {
    expect(createEventBodySchema.safeParse(validEvent).success).toBe(true)
  })

  it('refuse une fin antérieure au début', () => {
    const result = createEventBodySchema.safeParse({
      ...validEvent,
      endsAt: '2026-08-10T07:00:00.000Z',
    })

    expect(result.success).toBe(false)
  })

  it('refuse une capacité nulle', () => {
    expect(createEventBodySchema.safeParse({ ...validEvent, capacity: 0 }).success).toBe(false)
  })

  it('exige au moins un champ lors d’une modification', () => {
    expect(updateEventBodySchema.safeParse({}).success).toBe(false)
    expect(updateEventBodySchema.safeParse({ status: 'cancelled' }).success).toBe(true)
  })

  it('valide les valeurs du formulaire avant conversion ISO', () => {
    expect(eventFormSchema.safeParse({
      ...validEvent,
      startsAt: '2026-08-10T08:00',
      endsAt: '2026-08-10T16:00',
    }).success).toBe(true)
  })

  it('refuse une date de formulaire illisible', () => {
    expect(eventFormSchema.safeParse({
      ...validEvent,
      startsAt: 'date-invalide',
      endsAt: '',
    }).success).toBe(false)
  })
})
