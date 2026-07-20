'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui'

type LogoutButtonProps = {
  className?: string
  compact?: boolean
}

export default function LogoutButton({ className = '', compact = false }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <Button
      aria-label={compact ? 'Se déconnecter' : undefined}
      className={`${compact ? 'h-11 w-11 p-0' : ''} ${className}`}
      title={compact ? 'Se déconnecter' : undefined}
      variant="ghost"
      type="button"
      onClick={() => void logout()}
      isLoading={isLoading}
    >
      <LogOut size={18} aria-hidden="true" />
      <span className={compact ? 'sr-only' : undefined}>Déconnexion</span>
    </Button>
  )
}
