import sharp from 'sharp'
import { MediaOperationError } from './errors'

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 64 * 1024
export const MAX_IMAGE_PIXELS = 24_000_000
const allowedFormats = new Map([
  ['image/jpeg', 'jpeg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
])

export type NormalizedImage = { data: Buffer; width: number; height: number }

// Bound the actual stream, not just the client-controlled Content-Length header.
export const readImageUpload = async (request: Request): Promise<File> => {
  const contentType = request.headers.get('content-type') ?? ''
  if (!/^multipart\/form-data\s*;/i.test(contentType)) {
    throw new MediaOperationError('Un formulaire multipart avec un fichier est requis', 415)
  }
  const declaredLength = request.headers.get('content-length')
  if (declaredLength && Number(declaredLength) > MAX_REQUEST_BYTES) {
    throw new MediaOperationError('La requête dépasse la taille autorisée', 413)
  }
  if (!request.body) {
    throw new MediaOperationError('Le fichier est manquant', 422)
  }

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > MAX_REQUEST_BYTES) {
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
    form = await new Response(Buffer.concat(chunks), {
      headers: { 'Content-Type': contentType },
    }).formData()
  } catch {
    throw new MediaOperationError('Le formulaire est invalide', 400)
  }
  const entries = [...form.entries()]
  const file = form.get('file')
  if (entries.length !== 1 || !file || typeof file === 'string') {
    throw new MediaOperationError('Un seul fichier dans le champ file est requis', 422)
  }
  return file
}

export const normalizeImage = async (file: File): Promise<NormalizedImage> => {
  if (file.size === 0) throw new MediaOperationError('Le fichier est vide', 422)
  if (file.size > MAX_IMAGE_BYTES) throw new MediaOperationError('L’image ne doit pas dépasser 5 Mio', 413)
  const expectedFormat = allowedFormats.get(file.type)
  if (!expectedFormat) throw new MediaOperationError('Formats acceptés : JPEG, PNG et WebP non animés', 415)

  try {
    const data = Buffer.from(await file.arrayBuffer())
    // Reject vector/other formats before a decoder sees them, regardless of the filename or MIME.
    const hasSignature = expectedFormat === 'jpeg'
      ? data.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))
      : expectedFormat === 'png'
        ? data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP'
    if (!hasSignature) throw new MediaOperationError('Le contenu ne correspond pas au format annoncé', 415)

    // Some PNG decoders only expose the first APNG frame in metadata.
    if (expectedFormat === 'png') {
      for (let offset = 8; offset + 12 <= data.length;) {
        const length = data.readUInt32BE(offset)
        if (length > data.length - offset - 12) break
        if (data.toString('ascii', offset + 4, offset + 8) === 'acTL') {
          throw new MediaOperationError('Les images PNG animées ne sont pas prises en charge', 415)
        }
        offset += length + 12
      }
    }

    const pipeline = sharp(data, { failOn: 'warning', limitInputPixels: MAX_IMAGE_PIXELS })
      .timeout({ seconds: 10 })
    const metadata = await pipeline.metadata()
    if (metadata.format !== expectedFormat || (metadata.pages ?? 1) !== 1) {
      throw new MediaOperationError('Format incohérent ou image animée non prise en charge', 415)
    }
    // Re-encoding strips EXIF/GPS and any trailing payload. Do not call keepMetadata().
    const result = await pipeline.rotate()
      .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true })
    if (result.data.byteLength > MAX_IMAGE_BYTES) throw new MediaOperationError('L’image convertie est trop volumineuse', 413)
    return { data: result.data, width: result.info.width, height: result.info.height }
  } catch (error) {
    if (error instanceof MediaOperationError) throw error
    throw new MediaOperationError('Image illisible, endommagée ou dépassant 24 mégapixels', 422)
  }
}
