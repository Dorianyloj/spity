import { healthResponseSchema } from './schemas'

describe('healthResponseSchema', () => {
  it('valide une réponse de santé versionnée', () => {
    expect(healthResponseSchema.parse({
      status: 'ok',
      version: '0.1.0',
      revision: '8be8a29445d9eaa07b6e703c45b0b4622f5464e4',
    })).toEqual({
      status: 'ok',
      version: '0.1.0',
      revision: '8be8a29445d9eaa07b6e703c45b0b4622f5464e4',
    })
  })

  it('refuse une version ou une révision non traçable', () => {
    expect(healthResponseSchema.safeParse({
      status: 'ok',
      version: 'latest',
      revision: 'short',
    }).success).toBe(false)
  })
})
