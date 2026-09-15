import { act, renderHook, waitFor } from '@testing-library/react'
import { z } from 'zod'
import { useLiveResource } from './use-live-resource'

const schema = z.object({ count: z.number() })
const fetchMock = jest.fn<Promise<Response>, [RequestInfo | URL, RequestInit?]>()
const response = (count: number) => ({ ok: true, json: async () => ({ count }) }) as Response

describe('useLiveResource', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as typeof fetch
  })

  it('refreshes when returning to a page without remounting it', async () => {
    fetchMock.mockResolvedValue(response(2))
    const { result } = renderHook(() => useLiveResource({ initialData: { count: 1 }, url: '/api/events', schema }))
    expect(fetchMock).not.toHaveBeenCalled()
    act(() => window.dispatchEvent(new Event('focus')))
    await waitFor(() => expect(result.current.data.count).toBe(2))
    expect(fetchMock).toHaveBeenCalledWith('/api/events', expect.objectContaining({ cache: 'no-store', signal: expect.any(AbortSignal) }))
  })

  it('does not let an older read overwrite a completed mutation', async () => {
    let complete: (value: Response) => void = () => { throw new Error('Read not started') }
    fetchMock.mockReturnValue(new Promise((resolve) => { complete = resolve }))
    const { result } = renderHook(() => useLiveResource({ initialData: { count: 1 }, url: '/api/events', schema }))
    act(() => { void result.current.refresh() })
    act(() => result.current.update({ count: 3 }))
    await act(async () => { complete(response(1)) })
    expect(result.current.data.count).toBe(3)
    expect(result.current.isRefreshing).toBe(false)
  })

  it('retains the last valid data on a failed refresh and allows retrying', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(response(2))
    const { result } = renderHook(() => useLiveResource({ initialData: { count: 1 }, url: '/api/events', schema }))
    await act(() => result.current.refresh())
    expect(result.current.data.count).toBe(1)
    expect(result.current.error).toContain('Connexion interrompue')
    expect(result.current.isRefreshing).toBe(false)
    await act(() => result.current.refresh())
    expect(result.current.data.count).toBe(2)
    expect(result.current.error).toBeNull()
  })

  it('does not refresh while a form or mutation is active', async () => {
    fetchMock.mockResolvedValue(response(2))
    const { result, rerender } = renderHook(({ paused }) => useLiveResource({ initialData: { count: 1 }, url: '/api/events', schema, paused }), { initialProps: { paused: true } })
    await act(() => result.current.refresh())
    act(() => window.dispatchEvent(new Event('focus')))
    expect(fetchMock).not.toHaveBeenCalled()
    rerender({ paused: false })
    await act(() => result.current.refresh())
    expect(result.current.data.count).toBe(2)
  })

  it('refreshes visible pages periodically and stops after unmounting', async () => {
    jest.useFakeTimers()
    try {
      fetchMock.mockResolvedValue(response(2))
      const { result, unmount } = renderHook(() => useLiveResource({ initialData: { count: 1 }, url: '/api/events', schema }))
      await act(async () => { jest.advanceTimersByTime(15_000) })
      expect(result.current.data.count).toBe(2)
      unmount()
      await act(async () => { jest.advanceTimersByTime(15_000) })
      expect(fetchMock).toHaveBeenCalledTimes(1)
    } finally {
      jest.useRealTimers()
    }
  })
})
