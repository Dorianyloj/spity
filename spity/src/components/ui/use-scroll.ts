'use client'

import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

// A boolean snapshot only rerenders the header when the threshold is crossed.
export function useScroll(threshold = 10) {
  return useSyncExternalStore(subscribe, () => window.scrollY > threshold, () => false)
}
