import type { ProfileMeResponse } from '@/features/profile/schemas'
import type { PublicProfile } from '@/features/profile/lib/public-profile-repository'
export const userId = '11111111-1111-4111-8111-111111111111'
export const imageId = '22222222-2222-4222-8222-222222222222'
export function ownerFixture(): ProfileMeResponse {
  return {
    user: { id: userId, email: 'private-owner@example.com', role: 'grimpeur', avatarUrl: null, emailVerified: true, isAdmin: false },
    grimpeurProfile: { id: imageId, userId, displayName: 'Camille', bio: 'Bloc et voie', location: 'Lyon', climbingEnvironment: 'mixed', availability: ['weekday_evening'], partnerSearch: { enabled: true, levelPreference: 'any', style: 'relaxed', notes: null }, goals: ['Progresser en voie'], disciplines: ['bloc', 'voie'], niveaux: { bloc: '6b', voie: '6a' }, materiel: ['corde'], karma: 8 },
    equipment: [{ id: '33333333-3333-4333-8333-333333333333', userId, category: 'corde', quantity: 1, brand: 'Beal', model: 'Joker', color: 'bleu', size: null, lengthMeters: 70, diameterMm: '9.1', condition: 'bon', availableForPartner: true, notes: 'SECRET-INVENTORY' }], clubProfile: null, onboardingComplete: true,
  }
}
export function publicFixture(): PublicProfile {
  return { userId, role: 'grimpeur', displayName: 'Camille', avatarUrl: null, bio: 'Bloc et voie', location: 'Lyon', climbingEnvironment: 'mixed', createdAt: new Date('2026-01-01T12:00:00Z'), disciplines: ['bloc', 'voie'], niveaux: { bloc: '6b', voie: '6a' }, goals: ['Progresser en voie'], karma: 8, ffmeNum: null, postCount: 2, page: 1, pageCount: 1, availability: ['weekday_evening'], partnerSearch: ownerFixture().grimpeurProfile!.partnerSearch, sharedEquipment: [], posts: [
    { id: imageId, content: 'Une belle session\nAvec des amis', imageUrl: null, cotation: '6b', createdAt: '2026-09-01T12:00:00Z' },
    { id: '44444444-4444-4444-8444-444444444444', content: 'Photo de falaise', imageUrl: `/api/post-media/${imageId}`, cotation: null, createdAt: '2026-09-02T12:00:00Z' },
  ] }
}
