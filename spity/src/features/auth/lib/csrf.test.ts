import { hasValidOrigin, rejectInvalidOrigin } from './csrf'

jest.mock('./responses', () => ({
  authErrorResponse: (error: string, status: number) => ({
    status,
    json: async () => ({ error }),
  }),
}))

const createRequest = (origin?: string, host?: string, fetchSite?: string) => {
  const headers = new Headers()

  if (origin) {
    headers.set('origin', origin)
  }

  if (host) {
    headers.set('host', host)
  }

  if (fetchSite) {
    headers.set('sec-fetch-site', fetchSite)
  }

  return { headers } as Request
}

describe('hasValidOrigin', () => {
  it('accepts a request without an Origin header', () => {
    expect(hasValidOrigin(createRequest())).toBe(true)
  })

  it('accepts an origin matching the request host', () => {
    expect(hasValidOrigin(createRequest('https://spity.test', 'spity.test'))).toBe(true)
  })

  it('rejects a cross-site origin', () => {
    expect(hasValidOrigin(createRequest('https://attacker.test', 'spity.test'))).toBe(false)
  })

  it('rejects Fetch Metadata marked as cross-site even without an Origin header', () => {
    expect(hasValidOrigin(createRequest(undefined, 'spity.test', 'cross-site'))).toBe(false)
  })

  it('rejects an origin when the host is missing', () => {
    expect(hasValidOrigin(createRequest('https://spity.test'))).toBe(false)
  })

  it('rejects an invalid origin URL', () => {
    expect(hasValidOrigin(createRequest('not a url', 'spity.test'))).toBe(false)
  })
})

describe('rejectInvalidOrigin', () => {
  it('does not create a response for a same-origin request', () => {
    expect(rejectInvalidOrigin(createRequest('https://spity.test', 'spity.test'))).toBeNull()
  })

  it('returns a typed 403 response for a cross-site request', async () => {
    const response = rejectInvalidOrigin(createRequest('https://attacker.test', 'spity.test'))

    expect(response).not.toBeNull()
    expect(response?.status).toBe(403)
    await expect(response?.json()).resolves.toEqual({ error: 'Origine de requête invalide' })
  })
})
