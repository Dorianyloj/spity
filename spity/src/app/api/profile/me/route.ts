import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { profileMeResponse, profileUnauthorizedResponse } from '@/features/profile/lib/responses'

export async function GET() {
  const currentProfile = await getCurrentProfile()

  if (!currentProfile) {
    return profileUnauthorizedResponse()
  }

  return profileMeResponse(currentProfile.user, currentProfile.grimpeurProfile, currentProfile.clubProfile, currentProfile.equipment)
}
