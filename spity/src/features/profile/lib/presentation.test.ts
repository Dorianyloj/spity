import { ownerFixture, publicFixture } from '../../../../tests/fixtures/profile'
import { ownerPresentation, profileCompletion, profileSection, sharedEquipmentFromOwner } from './presentation'
it('counts only actual completed profile fields, never reputation', () => {
  const profile = ownerFixture()
  expect(profileCompletion(profile)).toMatchObject({ count: 5, total: 6, percent: 83 })
  profile.user.avatarUrl = '/api/avatars/photo'
  expect(profileCompletion(profile).percent).toBe(100)
  profile.grimpeurProfile = null; profile.equipment = []; profile.user.avatarUrl = null
  expect(profileCompletion(profile).count).toBe(0)
})
it('requires explicit sharing and strips personal fields from owner previews', () => {
  const owner = ownerFixture()
  expect(sharedEquipmentFromOwner(owner)).toEqual([])
  owner.grimpeurProfile!.partnerSearch.shareEquipment = true
  const publicEquipment = sharedEquipmentFromOwner(owner)
  expect(publicEquipment).toHaveLength(1)
  expect(publicEquipment[0]).not.toHaveProperty('notes')
  expect(publicEquipment[0]).not.toHaveProperty('userId')
  owner.equipment[0].availableForPartner = false
  expect(sharedEquipmentFromOwner(owner)).toEqual([])
  owner.grimpeurProfile!.displayName = null
  expect(ownerPresentation(owner, publicFixture()).displayName).toBe('Grimpeur Spity')
})
it('accepts only known sections', () => {
  expect(['posts', 'equipment', 'settings', 'oops', undefined].map(profileSection)).toEqual(['posts', 'equipment', 'settings', 'overview', 'overview'])
})
