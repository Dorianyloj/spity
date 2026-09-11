import { MediaOperationError } from '@/features/media/lib/errors'

export const MAX_TOPO_PDF_BYTES = 15 * 1024 * 1024
const MAX_TOPO_REQUEST_BYTES = MAX_TOPO_PDF_BYTES + 64 * 1024

export type TopoPdfUpload = {
  falaiseId: string
  title: string
  file: File
}

export const readTopoPdfUpload = async (request: Request): Promise<TopoPdfUpload> => {
  const contentType = request.headers.get('content-type') ?? ''
  if (!/^multipart\/form-data\s*;/i.test(contentType)) {
    throw new MediaOperationError('Un formulaire multipart avec un PDF est requis', 415)
  }
  const declaredLength = request.headers.get('content-length')
  if (declaredLength && Number(declaredLength) > MAX_TOPO_REQUEST_BYTES) {
    throw new MediaOperationError('La requête dépasse la taille autorisée', 413)
  }
  if (!request.body) throw new MediaOperationError('Le fichier est manquant', 422)

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_TOPO_REQUEST_BYTES) {
        void reader.cancel().catch(() => undefined)
        throw new MediaOperationError('La requête dépasse la taille autorisée', 413)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }

  let form: FormData
  try {
    form = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': contentType } }).formData()
  } catch {
    throw new MediaOperationError('Le formulaire est invalide', 400)
  }

  const entries = [...form.entries()]
  const file = form.get('file')
  const falaiseId = form.get('falaiseId')
  const title = form.get('title')
  const type = form.get('type')
  if (entries.length !== 4 || new Set(entries.map(([key]) => key)).size !== 4
    || entries.some(([key]) => !['file', 'falaiseId', 'title', 'type'].includes(key))
    || !file || typeof file === 'string' || typeof falaiseId !== 'string' || typeof title !== 'string' || type !== 'pdf') {
    throw new MediaOperationError('Les informations du topo sont invalides', 422)
  }
  if (file.size === 0) throw new MediaOperationError('Le PDF est vide', 422)
  if (file.size > MAX_TOPO_PDF_BYTES) throw new MediaOperationError('Le PDF ne doit pas dépasser 15 Mio', 413)
  if (file.type !== 'application/pdf') throw new MediaOperationError('Seuls les fichiers PDF sont acceptés', 415)
  const bytes = Buffer.from(await file.arrayBuffer())
  if (bytes.toString('ascii', 0, 5) !== '%PDF-') {
    throw new MediaOperationError('Le contenu ne correspond pas à un PDF', 415)
  }
  return { falaiseId, title, file }
}
