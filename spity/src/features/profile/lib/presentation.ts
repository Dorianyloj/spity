import type { GrimpeurProfile, ProfileMeResponse } from '../schemas'
import type { PublicProfile, SharedEquipment } from './public-profile-repository'

export const disciplineLabels: Record<string, string> = { bloc: 'Bloc', voie: 'Voie', trad: 'Trad', escalade: 'Escalade', 'via-ferrata': 'Via ferrata', 'grandes-voies': 'Grandes voies', speed: 'Speed' }
export const environmentLabels = { indoor: 'En salle', outdoor: 'En extérieur', mixed: 'Salle & extérieur' }
export const availabilityLabels = { weekday_morning: 'Semaine · matin', weekday_lunch: 'Semaine · midi', weekday_evening: 'Semaine · soir', weekend_morning: 'Week-end · matin', weekend_afternoon: 'Week-end · après-midi', weekend_evening: 'Week-end · soir' }
export const partnerLevelLabels = { same_or_close: 'Niveau proche du mien', stronger: 'Plus expérimenté', beginner_friendly: 'Débutants bienvenus', any: 'Tous les niveaux' }
export const partnerStyleLabels = { relaxed: 'Sans pression', performance: 'Performance', training: 'Entraînement', discovery: 'Découverte' }
export const goalOptions = ['Trouver des partenaires réguliers', 'Progresser en voie', 'Progresser en bloc', 'Sortir plus en falaise', 'Préparer une grande voie', 'Reprendre après une pause', 'Participer à des événements club', 'Partager du matériel']
export const gradeOptions = Array.from({ length: 6 }, (_, index) => index + 4).flatMap((grade) => ['a', 'b', 'c'].flatMap((letter) => [`${grade}${letter}`, `${grade}${letter}+`]))
export const categoryLabels = { chaussons: 'Chaussons', baudrier: 'Baudrier', corde: 'Corde', degaine: 'Dégaines', mousqueton: 'Mousqueton', assureur: 'Assureur', casque: 'Casque', crashpad: 'Crashpad', longe: 'Longe', sac: 'Sac', autre: 'Autre' }
export const conditionLabels = { neuf: 'Neuf', bon: 'Bon état', use: 'Usé', a_verifier: 'À vérifier' }
export type ProfileEditorKind = 'identity' | 'practice' | 'partners'
export type ProfileSection = 'overview' | 'posts' | 'equipment' | 'settings'
export const profileSection = (value?: string): ProfileSection => value === 'posts' || value === 'equipment' || value === 'settings' ? value : 'overview'

export function profileCompletion(profile: ProfileMeResponse) {
  const climber = profile.grimpeurProfile
  const items: { label: string; done: boolean; editor: ProfileEditorKind | 'equipment' }[] = [
    { label: 'Une photo pour se reconnaître', done: Boolean(profile.user.avatarUrl), editor: 'identity' },
    { label: 'Une présentation et une ville', done: Boolean(climber?.bio?.trim() && climber?.location?.trim()), editor: 'identity' },
    { label: 'Des disciplines et des niveaux', done: Boolean(climber?.disciplines.length && climber.disciplines.every((key) => climber.niveaux[key])), editor: 'practice' },
    { label: 'Des disponibilités renseignées', done: Boolean(climber?.availability.length), editor: 'partners' },
    { label: 'Des envies de grimpe', done: Boolean(climber?.goals.length), editor: 'practice' },
    { label: 'Un inventaire de matériel', done: profile.equipment.length > 0, editor: 'equipment' },
  ]
  const count = items.filter((item) => item.done).length
  return { items, count, total: items.length, percent: Math.round(count / items.length * 100) }
}
export function sharedEquipmentFromOwner(profile: ProfileMeResponse): SharedEquipment[] {
  if (profile.grimpeurProfile?.partnerSearch.shareEquipment !== true) return []
  return profile.equipment.filter((item) => item.availableForPartner).map(({ id, category, quantity, brand, model, color, size, lengthMeters, diameterMm, condition }) => ({ id, category, quantity, brand, model, color, size, lengthMeters, diameterMm, condition }))
}
// Used for the owner's live overview only. Other members always receive the server DTO.
export function ownerPresentation(profile: ProfileMeResponse, initial: PublicProfile): PublicProfile {
  const climber = profile.grimpeurProfile as GrimpeurProfile
  return { ...initial, displayName: climber.displayName || 'Grimpeur Spity', avatarUrl: profile.user.avatarUrl,
    bio: climber.bio, location: climber.location, disciplines: climber.disciplines, niveaux: climber.niveaux,
    climbingEnvironment: climber.climbingEnvironment, goals: climber.goals, availability: climber.availability,
    partnerSearch: climber.partnerSearch, sharedEquipment: sharedEquipmentFromOwner(profile) }
}
