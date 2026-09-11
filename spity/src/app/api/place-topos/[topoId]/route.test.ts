/** @jest-environment node */
import { getCurrentProfile } from '@/features/profile/lib/current-profile'
import { findCragTopo } from '@/features/places/lib/request-repository'
import { readPdf } from '@/features/media/lib/storage'
import { GET } from './route'

jest.mock('@/features/profile/lib/current-profile', () => ({ getCurrentProfile: jest.fn() }))
jest.mock('@/features/places/lib/request-repository', () => ({ findCragTopo: jest.fn() }))
jest.mock('@/features/media/lib/storage', () => ({ readPdf: jest.fn() }))

const profile = {
  user: { id: '11111111-1111-4111-8111-111111111111', email: 'grimpeur@spity.test', role: 'grimpeur' as const, avatarUrl: null, emailVerified: true, isAdmin: false },
  grimpeurProfile: {}, clubProfile: null, equipment: [],
} as unknown as NonNullable<Awaited<ReturnType<typeof getCurrentProfile>>>

const id = '22222222-2222-4222-8222-222222222222'

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(getCurrentProfile).mockResolvedValue(profile)
  jest.mocked(findCragTopo).mockResolvedValue({
    id, falaiseId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e', authorId: profile.user.id, kind: 'pdf',
    title: 'Topo du grand mur', externalUrl: null, byteSize: 8, createdAt: new Date(),
  })
  jest.mocked(readPdf).mockResolvedValue(Buffer.from('%PDF-1.7'))
})

describe('GET /api/place-topos/[topoId]', () => {
  it('forces a safe private PDF download', async () => {
    const response = await GET(new Request('http://localhost/api/place-topos/' + id), { params: Promise.resolve({ topoId: id }) })
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/pdf')
    expect(response.headers.get('content-disposition')).toBe('attachment; filename="topo-' + id + '.pdf"')
    expect(response.headers.get('cache-control')).toBe('private, no-store')
  })

  it('does not serve a link or malformed identifier as a PDF', async () => {
    jest.mocked(findCragTopo).mockResolvedValueOnce({ id, falaiseId: 'eb7c2638-3114-41b6-8917-a5dc4bc1d22e', authorId: profile.user.id, kind: 'link', title: 'Topo', externalUrl: 'https://topo.example', byteSize: null, createdAt: new Date() })
    expect((await GET(new Request('http://localhost'), { params: Promise.resolve({ topoId: id }) })).status).toBe(404)
    expect((await GET(new Request('http://localhost'), { params: Promise.resolve({ topoId: 'invalid' }) })).status).toBe(404)
  })
})
