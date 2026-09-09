/** @jest-environment node */
import { db } from '@/db'
import { logger } from '@/lib/logger'
import { createMediaUpload, deleteOwnedMedia, findOwnedMedia, MAX_STORED_BYTES, MAX_STORED_IMAGES } from './media-repository'
import { removeImage, writeImage } from './storage'

jest.mock('@/db', () => ({ db: { transaction: jest.fn(), select: jest.fn(), delete: jest.fn() } }))
jest.mock('./storage', () => ({ writeImage: jest.fn(), removeImage: jest.fn() }))
jest.mock('@/lib/logger', () => ({ logger: { error: jest.fn() } }))

const owner = '7a5e43c4-27d9-46f7-a169-35ae0649d220'
const id = 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e'
const image = { data: Buffer.from('webp bytes'), width: 12, height: 8 }
const insertValues = jest.fn()
const lockedOwner = jest.fn()
const usageWhere = jest.fn()
const deleteWhere = jest.fn()
const foundLimit = jest.fn()
const attachedLimit = jest.fn()
function deletingTransaction(avatarUrl: string | null = null) {
  const select = jest.fn()
    .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: () => ({ for: async () => [{ id: owner, avatarUrl }] }) }) }) })
    .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: () => ({ for: foundLimit }) }) }) })
    .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: attachedLimit }) }) })
  jest.mocked(db.transaction).mockImplementation(async (callback) => callback({ select, delete: db.delete } as never))
  attachedLimit.mockResolvedValue([])
}

beforeEach(() => {
  jest.resetAllMocks()
  jest.mocked(writeImage).mockResolvedValue(undefined)
  jest.mocked(removeImage).mockResolvedValue(undefined)
  lockedOwner.mockResolvedValue([{ id: owner }])
  usageWhere.mockResolvedValue([{ total: 0, bytes: null }])
  insertValues.mockResolvedValue(undefined)
  const select = jest.fn()
    .mockReturnValueOnce({ from: () => ({ where: () => ({ limit: () => ({ for: lockedOwner }) }) }) })
    .mockReturnValueOnce({ from: () => ({ where: usageWhere }) })
  jest.mocked(db.transaction).mockImplementation(async (callback) => callback({
    select, insert: () => ({ values: insertValues }),
  } as unknown as Parameters<Parameters<typeof db.transaction>[0]>[0]))
  jest.mocked(db.select).mockReturnValue({ from: () => ({ where: () => ({ limit: foundLimit }) }) } as never)
  jest.mocked(db.delete).mockReturnValue({ where: deleteWhere } as never)
  foundLimit.mockResolvedValue([{ id, ownerId: owner }])
})

it('stores generated IDs, immutable dimensions, owner and private URL', async () => {
  const result = await createMediaUpload(owner, image)
  expect(result).toMatchObject({ visibility: 'private', mimeType: 'image/webp', width: 12, height: 8, byteSize: 10 })
  expect(result.url).toBe(`/api/media/${result.id}`)
  expect(writeImage).toHaveBeenCalledWith(result.id, image.data)
  expect(lockedOwner).toHaveBeenCalledWith('update')
  expect(insertValues).toHaveBeenCalledWith({ id: result.id, ownerId: owner, width: 12, height: 8, byteSize: 10 })
})

it.each([
  { total: MAX_STORED_IMAGES, bytes: '1' },
  { total: 1, bytes: String(MAX_STORED_BYTES) },
])('enforces persistent quotas and removes the rejected file: %j', async (usage) => {
  usageWhere.mockResolvedValue([usage])
  await expect(createMediaUpload(owner, image)).rejects.toMatchObject({ status: 409 })
  expect(insertValues).not.toHaveBeenCalled()
  expect(removeImage).toHaveBeenCalledWith(jest.mocked(writeImage).mock.calls[0][0])
})

it('cleans up after a vanished owner or a failed insert', async () => {
  lockedOwner.mockResolvedValue([])
  await expect(createMediaUpload(owner, image)).rejects.toMatchObject({ status: 401 })
  expect(removeImage).toHaveBeenCalledTimes(1)
})

it('cleans up when the transaction fails, and logs a failed cleanup without masking the error', async () => {
  const failure = new Error('database failure')
  jest.mocked(db.transaction).mockRejectedValue(failure)
  jest.mocked(removeImage).mockRejectedValue(new Error('disk failure'))
  await expect(createMediaUpload(owner, image)).rejects.toThrow(failure)
  expect(logger.error).toHaveBeenCalledWith('media.orphan_cleanup_failed', { mediaId: expect.any(String) })
})

it('does not insert metadata if the filesystem fails', async () => {
  jest.mocked(writeImage).mockRejectedValue(new Error('disk full'))
  await expect(createMediaUpload(owner, image)).rejects.toThrow('disk full')
  expect(db.transaction).not.toHaveBeenCalled()
})

it('finds an owned object and returns null for a missing or foreign one', async () => {
  expect(await findOwnedMedia(id, owner)).toMatchObject({ id, ownerId: owner })
  foundLimit.mockResolvedValue([])
  expect(await findOwnedMedia(id, owner)).toBeNull()
})

it('removes bytes and metadata only after the owner-scoped lookup succeeds', async () => {
  deletingTransaction()
  await deleteOwnedMedia(id, owner)
  expect(removeImage).toHaveBeenCalledWith(id)
  expect(db.delete).toHaveBeenCalledTimes(1)
  foundLimit.mockResolvedValue([])
  deletingTransaction()
  await expect(deleteOwnedMedia(id, owner)).rejects.toMatchObject({ status: 404 })
  expect(removeImage).toHaveBeenCalledTimes(1)
})

it('retains metadata for retry if file deletion fails', async () => {
  deletingTransaction()
  jest.mocked(removeImage).mockRejectedValue(new Error('disk unavailable'))
  await expect(deleteOwnedMedia(id, owner)).rejects.toThrow('disk unavailable')
  expect(db.delete).not.toHaveBeenCalled()
})

it('deletes the canonical storage ID even when the lookup used different casing', async () => {
  deletingTransaction()
  await deleteOwnedMedia(id.toUpperCase(), owner)
  expect(removeImage).toHaveBeenCalledWith(id)
})

it.each(['avatar', 'post'])('refuses to remove an image referenced by a %s', async (kind) => {
  deletingTransaction(kind === 'avatar' ? `/api/avatars/${id}` : null)
  if (kind === 'post') attachedLimit.mockResolvedValue([{ id: 'attachment' }])
  await expect(deleteOwnedMedia(id, owner)).rejects.toMatchObject({ status: 409 })
  expect(removeImage).not.toHaveBeenCalled()
  expect(db.delete).not.toHaveBeenCalled()
})
