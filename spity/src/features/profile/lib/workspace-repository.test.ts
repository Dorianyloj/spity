/** @jest-environment node */
import { db } from '@/db'
import { createProfilePost, saveProfileSettings } from './workspace-repository'

jest.mock('@/db', () => ({ db: { transaction: jest.fn() } }))
jest.mock('@/lib/logger', () => ({ logger: { error: jest.fn() } }))
const owner = '11111111-1111-4111-8111-111111111111'
const mediaId = '22222222-2222-4222-8222-222222222222'
const identity = { section: 'identity' as const, displayName: 'Camille', bio: 'Une bio', location: 'Lyon' }
const locked = jest.fn()
const set = jest.fn()
const values = jest.fn()
beforeEach(() => {
  jest.resetAllMocks()
  locked.mockResolvedValueOnce([{ id: owner, suspended: false, role: 'grimpeur' }]).mockResolvedValueOnce([{ id: 'profile' }]).mockResolvedValue([{ id: mediaId }])
  set.mockReturnValue({ where: jest.fn() })
  jest.mocked(db.transaction).mockImplementation(async (callback) => callback({
    select: () => ({ from: () => ({ where: () => ({ limit: () => ({ for: locked }) }) }) }),
    update: () => ({ set }), insert: () => ({ values }),
  } as never))
})
it('updates identity without overwriting the avatar or other sections', async () => {
  await saveProfileSettings(owner, identity)
  expect(set).toHaveBeenCalledTimes(1)
  expect(set).toHaveBeenCalledWith({ displayName: 'Camille', bio: 'Une bio', location: 'Lyon' })
  expect(locked).toHaveBeenNthCalledWith(1, 'update')
})
it.each([null, mediaId])('attaches an owned image or removes the avatar: %s', async (avatarMediaId) => {
  await saveProfileSettings(owner, { ...identity, avatarMediaId })
  expect(set).toHaveBeenCalledWith({ avatarUrl: avatarMediaId ? `/api/avatars/${mediaId}` : null })
})
it('stores only selected levels and deduplicated goals', async () => {
  await saveProfileSettings(owner, { section: 'practice', disciplines: ['bloc', 'bloc'], niveaux: { bloc: '6a', voie: '5b' }, goals: ['Progresser', 'Progresser'], climbingEnvironment: 'mixed' })
  expect(set).toHaveBeenCalledWith({ disciplines: ['bloc'], niveaux: { bloc: '6a' }, goals: ['Progresser'], climbingEnvironment: 'mixed' })
})
it('saves explicit equipment sharing and availability independently', async () => {
  const partnerSearch = { enabled: true, levelPreference: 'any' as const, style: 'relaxed' as const, notes: null, shareEquipment: true }
  await saveProfileSettings(owner, { section: 'partners', availability: ['weekday_evening', 'weekday_evening'], partnerSearch })
  expect(set).toHaveBeenCalledWith({ availability: ['weekday_evening'], partnerSearch })
})
it.each([
  [[], 401], [[{ suspended: true, role: 'grimpeur' }], 401], [[{ role: 'club' }], 403],
])('rejects a missing, suspended or non-climber user', async (rows, status) => {
  locked.mockReset().mockResolvedValueOnce(rows)
  await expect(saveProfileSettings(owner, identity)).rejects.toMatchObject({ status })
  expect(set).not.toHaveBeenCalled()
})
it('requires onboarding and image ownership before any write', async () => {
  locked.mockReset().mockResolvedValueOnce([{ role: 'grimpeur' }]).mockResolvedValueOnce([])
  await expect(saveProfileSettings(owner, identity)).rejects.toMatchObject({ status: 409 })
  locked.mockReset().mockResolvedValueOnce([{ role: 'grimpeur' }]).mockResolvedValueOnce([{ id: 'p' }]).mockResolvedValueOnce([])
  await expect(saveProfileSettings(owner, { ...identity, avatarMediaId: mediaId })).rejects.toMatchObject({ status: 404 })
  expect(set).not.toHaveBeenCalled()
})
it.each([undefined, mediaId])('creates an actual post with optional owned attachment', async (image) => {
  const id = await createProfilePost(owner, { content: 'Belle session', cotation: null, mediaId: image })
  expect(values).toHaveBeenCalledWith({ id, authorId: owner, contenu: 'Belle session', cotation: null, isHidden: false })
  expect(values).toHaveBeenCalledTimes(image ? 2 : 1)
  if (image) expect(values).toHaveBeenLastCalledWith({ id: expect.any(String), postId: id, url: `/api/post-media/${mediaId}` })
})
