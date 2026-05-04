import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Authentification - Spity',
  description: 'Créer un compte ou se connecter à Spity.',
}

export default function AuthPage() {
  redirect('/login')
}
