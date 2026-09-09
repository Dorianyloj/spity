import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { privateProfileResponse, profileFailure, readProfileBody } from '@/features/profile/lib/http'
import { saveProfileSettings } from '@/features/profile/lib/workspace-repository'
import { profileMeResponseSchema } from '@/features/profile/schemas'
import { profileSettingsSchema } from '@/features/profile/workspace-schemas'

export async function PATCH(request: Request) {
  try {
    const current = await getCurrentProfile()
    if (!current) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
    const parsed = profileSettingsSchema.safeParse(await readProfileBody(request))
    if (!parsed.success) return privateProfileResponse({ error: 'Vérifie les informations du profil.', issues: parsed.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })) }, 422)
    await saveProfileSettings(current.user.id, parsed.data)
    const fresh = await getCurrentProfile()
    if (!fresh) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
    return privateProfileResponse(profileMeResponseSchema.parse({ ...fresh, onboardingComplete: Boolean(fresh.grimpeurProfile || fresh.clubProfile) }))
  } catch (error) { return profileFailure(error) }
}
