'use client'

import Link from 'next/link'
import BrandMark from '@/components/brand/brand-mark'
import { brandAssets, makePanelBackground } from '@/lib/brand-assets'
import LoginForm from './login-form'
import RegistrationForm from './registration-form'

type AuthPanelProps = {
  mode: 'login' | 'register'
}

export default function AuthPanel({ mode }: AuthPanelProps) {
  const isLogin = mode === 'login'

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section
          className="relative hidden overflow-hidden bg-cover bg-center text-white lg:sticky lg:top-0 lg:block lg:h-screen"
          style={{
            backgroundImage: makePanelBackground(isLogin ? brandAssets.cragClose : brandAssets.indoor),
          }}
        >
          <div className="absolute inset-0 bg-[#173236]/20" />
          <div className="relative flex h-full flex-col p-10 xl:p-14">
            <Link href="/" aria-label="Accueil Spity" className="flex min-h-11 w-fit items-center rounded-lg">
              <BrandMark priority size={48} tone="dark" />
            </Link>

            <div className="flex flex-1 items-center py-12">
              <div className="max-w-xl space-y-6">
                <p className="text-4xl font-bold leading-tight xl:text-5xl">
                  {isLogin
                    ? 'Retrouvez votre communauté. Préparez votre prochaine session.'
                    : 'Trouvez vos partenaires et gardez vos sessions au même endroit.'}
                </p>
                <p className="max-w-md text-lg leading-relaxed text-white/80">
                  {isLogin
                    ? 'Vos partenaires, vos échanges et vos événements vous attendent sur Spity.'
                    : 'Profils grimpeurs, clubs, lieux et événements structurés pour une pratique plus simple.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center bg-background px-4 py-8 sm:px-8 lg:px-10 xl:px-16">
          <div className="mx-auto w-full max-w-2xl space-y-8">
            <div className="flex items-center justify-between gap-4 lg:justify-end">
              <Link
                href="/"
                aria-label="Accueil Spity"
                className="flex min-h-11 items-center rounded-lg lg:hidden"
              >
                <BrandMark size={48} tone="light" />
              </Link>
              <Link
                href={isLogin ? '/register' : '/login'}
                className="inline-flex min-h-11 items-center text-sm font-semibold text-[#376b31] underline-offset-4 hover:underline"
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </Link>
            </div>

            {isLogin ? <LoginForm /> : <RegistrationForm />}
          </div>
        </section>
      </div>
    </main>
  )
}
