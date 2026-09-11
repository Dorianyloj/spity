/** @jest-environment node */
import { randomUUID } from 'node:crypto'
import { mkdtemp, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { readImage, readPdf, removeImage, removePdf, writeImage, writePdf } from './storage'

let directory: string
const originalDirectory = process.env.MEDIA_STORAGE_DIR

beforeEach(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'spity-media-test-'))
  process.env.MEDIA_STORAGE_DIR = path.join(directory, 'images')
})
afterEach(async () => {
  if (originalDirectory === undefined) delete process.env.MEDIA_STORAGE_DIR
  else process.env.MEDIA_STORAGE_DIR = originalDirectory
  await rm(directory, { recursive: true, force: true })
})

it('persists bytes in the dedicated directory and deletes idempotently', async () => {
  const id = randomUUID()
  await writeImage(id, Buffer.from('image bytes'))
  expect(await readdir(path.join(directory, 'images'))).toEqual([`${id}.webp`])
  expect(await readImage(id)).toEqual(Buffer.from('image bytes'))
  await removeImage(id)
  await removeImage(id)
  await expect(readImage(id)).rejects.toMatchObject({ code: 'ENOENT' })
})

it('does not overwrite or remove an existing object on collision', async () => {
  const id = randomUUID()
  await writeImage(id, Buffer.from('original'))
  await expect(writeImage(id, Buffer.from('replacement'))).rejects.toMatchObject({ code: 'EEXIST' })
  expect(await readImage(id)).toEqual(Buffer.from('original'))
})

it('stores PDFs separately and never exposes their original filename', async () => {
  const id = randomUUID()
  await writePdf(id, Buffer.from('%PDF-1.7'))
  expect(await readdir(path.join(directory, 'images'))).toEqual([id + '.pdf'])
  expect(await readPdf(id)).toEqual(Buffer.from('%PDF-1.7'))
  await removePdf(id)
  await expect(readPdf(id)).rejects.toMatchObject({ code: 'ENOENT' })
})

it.each(['../../secret', '..\\secret', '/tmp/image.webp', 'id.png', ''])('rejects unsafe identifiers: %s', async (id) => {
  await expect(writeImage(id, Buffer.from('data'))).rejects.toThrow()
  await expect(readImage(id)).rejects.toThrow()
  await expect(removeImage(id)).rejects.toThrow()
  expect(await readdir(directory)).toEqual([])
})

it('refuses to use a filesystem root as storage', async () => {
  process.env.MEDIA_STORAGE_DIR = path.parse(directory).root
  await expect(writeImage(randomUUID(), Buffer.from('data'))).rejects.toThrow('dedicated directory')
})

it.each(['public', 'public/uploads'])('refuses public storage at %s', async (root) => {
  process.env.MEDIA_STORAGE_DIR = root
  await expect(writeImage(randomUUID(), Buffer.from('data'))).rejects.toThrow('outside public/')
})
