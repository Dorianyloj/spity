export type EventTiming = {
  startsAt: Date
  endsAt: Date | null
}

export const validateEventTiming = (timing: EventTiming, now = new Date()) => {
  if (timing.startsAt <= now) {
    return 'La date de début doit être dans le futur'
  }

  if (timing.endsAt && timing.endsAt <= timing.startsAt) {
    return 'La date de fin doit être postérieure au début'
  }

  return null
}

export const validateEventCapacity = (capacity: number, registeredCount: number) => {
  if (capacity < registeredCount) {
    return `La capacité ne peut pas être inférieure aux ${registeredCount} inscriptions actives`
  }

  return null
}

export const canRegisterForEvent = (event: {
  status: 'scheduled' | 'cancelled'
  startsAt: Date
  capacity: number
  registeredCount: number
}, now = new Date()) => {
  if (event.status === 'cancelled') {
    return 'Cet événement est annulé'
  }

  if (event.startsAt <= now) {
    return 'Cet événement a déjà commencé'
  }

  if (event.registeredCount >= event.capacity) {
    return 'Cet événement est complet'
  }

  return null
}
