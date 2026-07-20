'use client'

import Link from 'next/link'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="w-full max-w-xl space-y-5 rounded-lg border border-border bg-card p-6" role="alert">
        <div>
          <h1 className="text-2xl font-bold">La page n’a pas pu être chargée</h1>
          <p className="mt-2 text-muted-foreground">
            Une erreur inattendue est survenue. Vous pouvez relancer l’affichage ou revenir à l’accueil.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>
            <RotateCcw size={18} aria-hidden="true" />
            Réessayer
          </Button>
          <Link className="spity-btn spity-btn--secondary min-h-11 px-4 py-2.5 text-sm" href="/">
            Revenir à l’accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
