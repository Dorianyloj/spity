'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui'

type LogoutButtonProps = {
  className?: string
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const logout = async () => {
    setIsLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <Button className={className} variant="ghost" type="button" onClick={() => void logout()} isLoading={isLoading}>
      <LogOut size={18} />
      Déconnexion
    </Button>
  )
}
