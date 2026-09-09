/** @jest-environment node */
import sharp from 'sharp'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import { createMediaUpload, deleteOwnedMedia, findOwnedMedia } from '@/features/media/lib/media-repository'
import { MediaOperationError } from '@/features/media/lib/errors'
import { readImage } from '@/features/media/lib/storage'
import { resetRateLimitStoreForTests } from '@/lib/rate-limit'
import { POST } from './route'
import { DELETE, GET } from './[mediaId]/route'

jest.mock('@/features/auth/lib/current-user', () => ({ getCurrentUser: jest.fn() }))
jest.mock('@/features/media/lib/media-repository', () => ({
  createMediaUpload: jest.fn(), deleteOwnedMedia: jest.fn(), findOwnedMedia: jest.fn(),
}))
jest.mock('@/features/media/lib/storage', () => ({ ...jest.requireActual('@/features/media/lib/storage'), readImage: jest.fn() }))

const ownerId = '7a5e43c4-27d9-46f7-a169-35ae0649d220'
const id = 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e'
const context = { params: Promise.resolve({ mediaId: id }) }
const base = 'http://localhost:3000'
const request = async (method = 'POST', origin = base) => {
  const form = new FormData()
  if (method === 'POST') {
    const data = await sharp({ create: { width: 12, height: 8, channels: 3, background: 'white' } }).png().toBuffer()
    form.append('file', new File([new Uint8Array(data)], 'test.png', { type: 'image/png' }))
  }
  return new Request(`${base}/api/media`, {
    method, headers: { Host: 'localhost:3000', Origin: origin }, body: method === 'POST' ? form : undefined,
  })
}

beforeEach(() => {
  jest.resetAllMocks()
  resetRateLimitStoreForTests()
  jest.mocked(getCurrentUser).mockResolvedValue({ id: ownerId, email: 'test@spity.test', role: 'grimpeur', avatarUrl: null, emailVerified: false })
  jest.mocked(createMediaUpload).mockResolvedValue({ id, url: `/api/media/${id}`, visibility: 'private', mimeType: 'image/webp', byteSize: 20, width: 12, height: 8 })
  jest.mocked(findOwnedMedia).mockResolvedValue({ id, ownerId, byteSize: 20, width: 12, height: 8, createdAt: new Date() })
  jest.mocked(readImage).mockResolvedValue(Buffer.from('webp data'))
})

it('imports a decoded image for the authenticated owner', async () => {
  const response = await POST(await request())
  expect(response.status).toBe(201)
  expect(await response.json()).toMatchObject({ media: { id, visibility: 'private', mimeType: 'image/webp' } })
  expect(createMediaUpload).toHaveBeenCalledWith(ownerId, expect.objectContaining({ width: 12, height: 8 }))
  expect(response.headers.get('cache-control')).toBe('no-store')
})

it('accepts the club role as well', async () => {
  jest.mocked(getCurrentUser).mockResolvedValue({ id: ownerId, email: 'club@spity.test', role: 'club', avatarUrl: null, emailVerified: false })
  expect((await POST(await request())).status).toBe(201)
})

it('rejects anonymous import, read and deletion', async () => {
  jest.mocked(getCurrentUser).mockResolvedValue(null)
  expect((await POST(await request())).status).toBe(401)
  expect((await GET(await request('GET'), context)).status).toBe(401)
  expect((await DELETE(await request('DELETE'), context)).status).toBe(401)
  expect(createMediaUpload).not.toHaveBeenCalled()
  expect(readImage).not.toHaveBeenCalled()
})

it('rejects cross-origin mutations before accessing the file or database', async () => {
  expect((await POST(await request('POST', 'https://attacker.test'))).status).toBe(403)
  expect((await DELETE(await request('DELETE', 'https://attacker.test'), context)).status).toBe(403)
  expect(getCurrentUser).not.toHaveBeenCalled()
})

it('returns validation and quota errors without storing an invalid file', async () => {
  const response = await POST(new Request(`${base}/api/media`, { method: 'POST', body: '{}' }))
  expect(response.status).toBe(415)
  expect(createMediaUpload).not.toHaveBeenCalled()
  jest.mocked(createMediaUpload).mockRejectedValue(new MediaOperationError('Quota atteint', 409))
  expect((await POST(await request())).status).toBe(409)
})

it('limits upload attempts by account even if client IP headers change', async () => {
  for (let index = 0; index < 10; index += 1) {
    const attempt = new Request(`${base}/api/media`, { method: 'POST', body: '{}', headers: { 'x-forwarded-for': `192.0.2.${index}` } })
    expect((await POST(attempt)).status).toBe(415)
  }
  const response = await POST(await request())
  expect(response.status).toBe(429)
  expect(Number(response.headers.get('retry-after'))).toBeGreaterThan(0)
  expect(createMediaUpload).not.toHaveBeenCalled()
})

it('serves private bytes with cache and content protections', async () => {
  const response = await GET(await request('GET'), context)
  expect(response.status).toBe(200)
  expect(await response.text()).toBe('webp data')
  expect(findOwnedMedia).toHaveBeenCalledWith(id, ownerId)
  expect(response.headers.get('content-type')).toBe('image/webp')
  expect(response.headers.get('cache-control')).toBe('private, no-store')
  expect(response.headers.get('vary')).toBe('Cookie')
  expect(response.headers.get('x-content-type-options')).toBe('nosniff')
  expect(response.headers.get('cross-origin-resource-policy')).toBe('same-origin')
})

it('does not read a missing or another user’s image', async () => {
  jest.mocked(findOwnedMedia).mockResolvedValue(null)
  expect((await GET(await request('GET'), context)).status).toBe(404)
  expect(readImage).not.toHaveBeenCalled()
})

it('rejects path traversal without a database lookup', async () => {
  const invalidContext = { params: Promise.resolve({ mediaId: '../../secret' }) }
  expect((await GET(await request('GET'), invalidContext)).status).toBe(404)
  expect((await DELETE(await request('DELETE'), invalidContext)).status).toBe(404)
  expect(findOwnedMedia).not.toHaveBeenCalled()
  expect(deleteOwnedMedia).not.toHaveBeenCalled()
})

it('returns 404 for missing bytes and does not expose storage failures', async () => {
  jest.mocked(readImage).mockRejectedValue(Object.assign(new Error('private path'), { code: 'ENOENT' }))
  expect((await GET(await request('GET'), context)).status).toBe(404)
  jest.mocked(readImage).mockRejectedValue(new Error('secret path / database details'))
  const response = await GET(await request('GET'), context)
  expect(response.status).toBe(503)
  expect(await response.text()).not.toContain('secret')
})

it('deletes through the owner-scoped repository, and refuses foreign images', async () => {
  expect((await DELETE(await request('DELETE'), context)).status).toBe(204)
  expect(deleteOwnedMedia).toHaveBeenCalledWith(id, ownerId)
  jest.mocked(deleteOwnedMedia).mockRejectedValue(new MediaOperationError('Image introuvable', 404))
  expect((await DELETE(await request('DELETE'), context)).status).toBe(404)
})

it('hides database failures during import and deletion', async () => {
  jest.mocked(createMediaUpload).mockRejectedValue(new Error('database credentials'))
  const response = await POST(await request())
  expect(response.status).toBe(503)
  expect(await response.text()).not.toContain('credentials')
  jest.mocked(deleteOwnedMedia).mockRejectedValue(new Error('database credentials'))
  expect((await DELETE(await request('DELETE'), context)).status).toBe(503)
})
