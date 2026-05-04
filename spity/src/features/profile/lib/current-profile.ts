import { getCurrentUser } from '@/features/auth/lib/current-user'
import { findClubProfileByUserId, findGrimpeurProfileByUserId } from './profile-repository'

export const getCurrentProfile = async () => {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const [grimpeurProfile, clubProfile] = await Promise.all([
    findGrimpeurProfileByUserId(user.id),
    findClubProfileByUserId(user.id),
  ])

  return {
    user,
    grimpeurProfile,
    clubProfile,
  }
}
