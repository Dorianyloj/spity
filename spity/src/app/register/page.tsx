import type { Metadata } from 'next'
import AuthPanel from '@/features/auth/components/auth-panel'

export const metadata: Metadata = {
  title: 'Inscription - Spity',
  description: 'Créer un compte Spity.',
}

export default function RegisterPage() {
  return <AuthPanel mode="register" />
}
