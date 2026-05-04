import type { Metadata } from 'next'
import AuthPanel from '@/features/auth/components/auth-panel'

export const metadata: Metadata = {
  title: 'Authentification - Spity',
  description: 'Créer un compte ou se connecter à Spity.',
}

export default function AuthPage() {
  return <AuthPanel />
}
