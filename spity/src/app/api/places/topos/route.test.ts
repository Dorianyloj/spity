/** @jest-environment node */
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { createCragPdfTopo, createCragTopoLink } from '@/features/places/lib/request-repository'
import { readTopoPdfUpload } from '@/features/places/lib/topo-upload'
import { consumeRateLimit } from '@/lib/rate-limit'
import { POST } from './route'

jest.mock('@/features/profile/lib/current-profile', () => ({ getCurrentProfile: jest.fn() }))
jest.mock('@/features/places/lib/request-repository', () => ({ createCragPdfTopo: jest.fn(), createCragTopoLink: jest.fn() }))
jest.mock('@/features/places/lib/topo-upload', () => ({ readTopoPdfUpload: jest.fn() }))
jest.mock('@/lib/rate-limit', () => ({ consumeRateLimit: jest.fn() }))

const profile = {
  user: { id: '11111111-1111-4111-8111-111111111111', email: 'grimpeur@spity.test', role: 'grimpeur' as const, avatarUrl: null, emailVerified: true, isAdmin: false },
  grimpeurProfile: {}, clubProfile: null, equipment: [],
} as unknown as NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>>

const falaiseId = 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e'
const linkInput = { falaiseId, type: 'link' as const, title: 'Topo du grand mur', url: 'https://topo.example/grand-mur' }
const jsonRequest = (body: unknown) => new Request('http://localhost:3000/api/places/topos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000', Host: 'localhost:3000' },
  body: JSON.stringify(body),
})
const pdfRequest = () => new Request('http://localhost:3000/api/places/topos', {
  method: 'POST',
  headers: { 'Content-Type': 'multipart/form-data; boundary=test', Origin: 'http://localhost:3000', Host: 'localhost:3000' },
  body: 'ignored by the parser mock',
})

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(getCurrentProfile).mockResolvedValue(profile)
  jest.mocked(consumeRateLimit).mockReturnValue({ allowed: true, limit: 8, remaining: 7, resetAt: Date.now(), retryAfterSeconds: 0 })
  jest.mocked(createCragTopoLink).mockResolvedValue({ id: '22222222-2222-4222-8222-222222222222', kind: 'link' })
  jest.mocked(createCragPdfTopo).mockResolvedValue({ id: '33333333-3333-4333-8333-333333333333', kind: 'pdf' })
})

describe('POST /api/places/topos', () => {
  it('creates a validated external topo link', async () => {
    const response = await POST(jsonRequest(linkInput))
    expect(response.status).toBe(201)
    expect(createCragTopoLink).toHaveBeenCalledWith(profile.user.id, linkInput)
  })

  it('rejects unsupported links before writing anything', async () => {
    const response = await POST(jsonRequest({ ...linkInput, url: 'ftp://topo.example/file' }))
    expect(response.status).toBe(422)
    expect(createCragTopoLink).not.toHaveBeenCalled()
  })

  it('stores a validated PDF through the private upload flow', async () => {
    const file = new File([Buffer.from('%PDF-1.7')], 'topo.pdf', { type: 'application/pdf' })
    jest.mocked(readTopoPdfUpload).mockResolvedValue({ falaiseId, title: 'Topo du grand mur', file })

    const response = await POST(pdfRequest())
    expect(response.status).toBe(201)
    expect(createCragPdfTopo).toHaveBeenCalledWith(
      profile.user.id,
      { falaiseId, title: 'Topo du grand mur', type: 'pdf' },
      Buffer.from('%PDF-1.7')
    )
  })
})
