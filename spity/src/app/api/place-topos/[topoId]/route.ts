import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { privateProfileResponse } from '@/features/profile/lib/http'
import { findCragTopo } from '@/features/places/lib/request-repository'
import { readPdf } from '@/features/media/lib/storage'
import { z } from 'zod'

export const runtime = 'nodejs'

type TopoFileRouteProps = {
  params: Promise<{ topoId: string }>
}

export async function GET(_request: Request, { params }: TopoFileRouteProps) {
  const profile = await getCurrentProfile()
  if (!profile) return privateProfileResponse({ error: 'Authentification requise.' }, 401)
  if (!profile.grimpeurProfile && !profile.clubProfile) {
    return privateProfileResponse({ error: 'Profil requis.' }, 403)
  }

  const id = z.uuid().safeParse((await params).topoId)
  if (!id.success) return privateProfileResponse({ error: 'Topo introuvable.' }, 404)

  const topo = await findCragTopo(id.data)
  if (!topo || topo.kind !== 'pdf') return privateProfileResponse({ error: 'Topo introuvable.' }, 404)

  try {
    const data = await readPdf(topo.id)
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(data.length),
        'Content-Disposition': `attachment; filename="topo-${topo.id}.pdf"`,
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Cache-Control': 'private, no-store',
        Vary: 'Cookie',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return privateProfileResponse({ error: 'Topo introuvable.' }, 404)
    }
    return privateProfileResponse({ error: 'Le fichier est momentanément indisponible. Réessaie dans un instant.' }, 503)
  }
}
