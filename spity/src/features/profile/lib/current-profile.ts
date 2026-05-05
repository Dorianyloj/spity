import { getCurrentUser } from '@/features/auth/lib/current-user'
import { findClubProfileByUserId, findGrimpeurProfileByUserId, findUserEquipmentByUserId } from './profile-repository'

export const getCurrentProfile = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const [grimpeurProfile, clubProfile, equipment] = await Promise.all([
    findGrimpeurProfileByUserId(user.id),
    findClubProfileByUserId(user.id),
    findUserEquipmentByUserId(user.id),
  ])

  return {
    user,
    grimpeurProfile,
    clubProfile,
    equipment,
  }
}
