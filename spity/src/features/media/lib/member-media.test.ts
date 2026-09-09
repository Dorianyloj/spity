/** @jest-environment node */
import { db } from '@/db'
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { serveMemberMedia } from './member-media'
import { readImage } from './storage'
import { ownerFixture, imageId } from '../../../../tests/fixtures/profile'
jest.mock('@/db', () => ({ db: { select: jest.fn() } }))
jest.mock('@/features/profile/lib/current-profile', () => ({ getCurrentProfile: jest.fn() }))
jest.mock('./storage', () => ({ ...jest.requireActual('./storage'), readImage: jest.fn() }))
jest.mock('@/lib/logger', () => ({ logger: { error: jest.fn() } }))
const limit = jest.fn()
beforeEach(() => {
  jest.resetAllMocks()
  const query = { from: () => query, innerJoin: () => query, where: () => query, limit }
  jest.mocked(db.select).mockReturnValue(query as never)
  jest.mocked(getCurrentProfile).mockResolvedValue(ownerFixture())
  limit.mockResolvedValue([{ id: imageId }])
  jest.mocked(readImage).mockResolvedValue(Buffer.from('webp'))
})
it.each(['avatar', 'post'] as const)('serves referenced %s media only with private headers', async (kind) => {
  const response = await serveMemberMedia(imageId.toUpperCase(), kind)
  expect(response.status).toBe(200)
  expect(response.headers.get('cache-control')).toBe('private, no-store')
  expect(response.headers.get('content-type')).toBe('image/webp')
  expect(readImage).toHaveBeenCalledWith(imageId)
})
it('requires a signed-in onboarded member', async () => {
  jest.mocked(getCurrentProfile).mockResolvedValue(null)
  expect((await serveMemberMedia(imageId, 'avatar')).status).toBe(401)
  jest.mocked(getCurrentProfile).mockResolvedValue({ ...ownerFixture(), grimpeurProfile: null })
  expect((await serveMemberMedia(imageId, 'avatar')).status).toBe(403)
  expect(readImage).not.toHaveBeenCalled()
})
it('does not read unreferenced or malformed media', async () => {
  expect((await serveMemberMedia('../bad', 'post')).status).toBe(404)
  limit.mockResolvedValue([])
  expect((await serveMemberMedia(imageId, 'post')).status).toBe(404)
  expect(readImage).not.toHaveBeenCalled()
})
it('returns safe errors for missing files and unexpected failures', async () => {
  jest.mocked(readImage).mockRejectedValueOnce(Object.assign(new Error('gone'), { code: 'ENOENT' }))
  expect((await serveMemberMedia(imageId, 'avatar')).status).toBe(404)
  jest.mocked(readImage).mockRejectedValueOnce(new Error('private disk path'))
  const response = await serveMemberMedia(imageId, 'avatar')
  expect(response.status).toBeGreaterThanOrEqual(500)
  expect(await response.text()).not.toContain('private disk path')
})
