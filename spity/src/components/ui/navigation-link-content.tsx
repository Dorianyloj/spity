'use client'

import { LoaderCircle } from 'lucide-react'
import { useLinkStatus } from 'next/link'
import type { ReactNode } from 'react'

export default function NavigationLinkContent({ icon, label }: { icon?: ReactNode; label: string }) {
  const { pending } = useLinkStatus()

  return <>
    <span className="relative inline-flex size-[18px] shrink-0" aria-hidden="true">
      <span className={pending ? 'invisible' : undefined}>{icon}</span>
      {pending && <LoaderCircle size={18} className="absolute inset-0 motion-safe:animate-spin" />}
    </span>
    {label}
    <span role="status" className="sr-only">{pending ? 'Chargement de la page…' : ''}</span>
  </>
}
