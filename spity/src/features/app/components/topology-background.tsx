'use client'

import { useEffect, useRef } from 'react'

type TopologyEffect = { destroy: () => void }

export default function TopologyBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = backgroundRef.current
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    if (!element || reduceMotion) return

    let effect: TopologyEffect | undefined
    let disposed = false

    void Promise.all([
      import('p5'),
      import('vanta/dist/vanta.topology.min'),
    ]).then(([p5Module, topologyModule]) => {
      if (disposed) return

      effect = topologyModule.default({
        el: element,
        p5: p5Module.default,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0x8bb957,
        backgroundColor: 0x173236,
      })
    }).catch(() => {
      // The branded background color remains as a lightweight fallback.
    })

    return () => {
      disposed = true
      effect?.destroy()
    }
  }, [])

  return <div ref={backgroundRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[#173236] opacity-50" />
}
