'use client'

import { useCallback, useEffect, useRef, useState, type SetStateAction } from 'react'
import type { z } from 'zod'
import { requestJson } from '@/lib/api-client'

type LiveResourceOptions<T> = {
  initialData: T
  url: string
  schema: z.ZodType<T>
  paused?: boolean
}

/** Refresh visible pages; discard reads started before a local mutation completes. */
export function useLiveResource<T>({ initialData, url, schema, paused = false }: LiveResourceOptions<T>) {
  const [data, setData] = useState(initialData)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const currentRead = useRef<AbortController | null>(null)

  const update = useCallback((next: SetStateAction<T>) => {
    currentRead.current?.abort()
    currentRead.current = null
    setIsRefreshing(false)
    setData(next)
  }, [])

  const refresh = useCallback(async () => {
    if (paused || currentRead.current) return
    const controller = new AbortController()
    currentRead.current = controller
    setIsRefreshing(true)
    setError(null)

    try {
      const fresh = await requestJson(url, schema, { signal: controller.signal })
      if (!controller.signal.aborted && currentRead.current === controller) setData(fresh)
    } catch (failure) {
      if (!controller.signal.aborted && currentRead.current === controller) {
        setError(failure instanceof Error ? failure.message : 'Actualisation impossible. Réessayez.')
      }
    } finally {
      if (currentRead.current === controller) {
        currentRead.current = null
        setIsRefreshing(false)
      }
    }
  }, [paused, schema, url])

  useEffect(() => {
    const refreshVisible = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    window.addEventListener('focus', refreshVisible)
    window.addEventListener('online', refreshVisible)
    document.addEventListener('visibilitychange', refreshVisible)
    const timer = window.setInterval(refreshVisible, 15_000)

    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', refreshVisible)
      window.removeEventListener('online', refreshVisible)
      document.removeEventListener('visibilitychange', refreshVisible)
      currentRead.current?.abort()
    }
  }, [refresh])

  return { data, update, refresh, isRefreshing, error }
}
