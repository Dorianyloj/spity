import {
  canRegisterForEvent,
  validateEventCapacity,
  validateEventTiming,
} from './event-rules'

const now = new Date('2026-07-20T10:00:00.000Z')
const future = new Date('2026-07-21T10:00:00.000Z')

describe('event rules', () => {
  it('accepte une plage future cohérente', () => {
    expect(validateEventTiming({
      startsAt: future,
      endsAt: new Date('2026-07-21T17:00:00.000Z'),
    }, now)).toBeNull()
  })

  it('refuse un événement passé', () => {
    expect(validateEventTiming({
      startsAt: new Date('2026-07-19T10:00:00.000Z'),
      endsAt: null,
    }, now)).toBe('La date de début doit être dans le futur')
  })

  it('refuse une fin antérieure au début', () => {
    expect(validateEventTiming({
      startsAt: future,
      endsAt: new Date('2026-07-21T09:00:00.000Z'),
    }, now)).toBe('La date de fin doit être postérieure au début')
  })

  it('empêche de réduire la capacité sous le nombre d’inscrits', () => {
    expect(validateEventCapacity(4, 5)).toContain('5 inscriptions actives')
    expect(validateEventCapacity(5, 5)).toBeNull()
  })

  it('autorise une inscription sur un événement futur avec une place', () => {
    expect(canRegisterForEvent({
      status: 'scheduled',
      startsAt: future,
      capacity: 8,
      registeredCount: 7,
    }, now)).toBeNull()
  })

  it.each([
    [{ status: 'cancelled' as const, startsAt: future, capacity: 8, registeredCount: 0 }, 'Cet événement est annulé'],
    [{ status: 'scheduled' as const, startsAt: now, capacity: 8, registeredCount: 0 }, 'Cet événement a déjà commencé'],
    [{ status: 'scheduled' as const, startsAt: future, capacity: 8, registeredCount: 8 }, 'Cet événement est complet'],
  ])('refuse une inscription invalide', (event, expectedMessage) => {
    expect(canRegisterForEvent(event, now)).toBe(expectedMessage)
  })
})
