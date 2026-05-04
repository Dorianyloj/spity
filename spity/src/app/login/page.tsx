import type { Metadata } from 'next'
import AuthPanel from '@/features/auth/components/auth-panel'

export const metadata: Metadata = {
  title: 'Connexion - Spity',
  description: 'Se connecter à Spity.',
}

export default function LoginPage() {
  return <AuthPanel mode="login" />
}
