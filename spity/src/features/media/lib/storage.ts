import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

export const mediaIdSchema = z.string().uuid()

const storagePath = (id: string, extension: 'webp' | 'pdf') => {
  // Neither the original filename nor a user-provided path is ever persisted.
  const safeId = mediaIdSchema.parse(id)
  // Runtime uploads are mounted separately, never bundled in the Next.js standalone output.
  const root = path.resolve(/*turbopackIgnore: true*/ process.env.MEDIA_STORAGE_DIR || path.join(process.cwd(), '.media'))
  if (root === path.parse(root).root) throw new Error('MEDIA_STORAGE_DIR must be a dedicated directory')
  const publicRoot = path.resolve(process.cwd(), 'public')
  const relativeToPublic = path.relative(publicRoot, root)
  if (relativeToPublic === '' || (!relativeToPublic.startsWith(`..${path.sep}`) && relativeToPublic !== '..' && !path.isAbsolute(relativeToPublic))) {
    throw new Error('MEDIA_STORAGE_DIR must be outside public/')
  }
  // The runtime media volume is outside the application bundle.
  return path.join(/*turbopackIgnore: true*/ root, `${safeId}.${extension}`)
}

export const writeImage = async (id: string, data: Buffer) => {
  const filePath = storagePath(id, 'webp')
  await mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 })
  try {
    await writeFile(filePath, data, { flag: 'wx', mode: 0o600 })
  } catch (error) {
    // A failed write can leave a partial file; never remove an existing object on EEXIST.
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      await unlink(filePath).catch(() => undefined)
    }
    throw error
  }
}

export const readImage = async (id: string) => readFile(storagePath(id, 'webp'))

export const removeImage = async (id: string) => {
  try {
    await unlink(storagePath(id, 'webp'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}

export const writePdf = async (id: string, data: Buffer) => {
  const filePath = storagePath(id, 'pdf')
  await mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 })
  try {
    await writeFile(filePath, data, { flag: 'wx', mode: 0o600 })
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      await unlink(filePath).catch(() => undefined)
    }
    throw error
  }
}

export const readPdf = async (id: string) => readFile(storagePath(id, 'pdf'))

export const removePdf = async (id: string) => {
  try {
    await unlink(storagePath(id, 'pdf'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}
