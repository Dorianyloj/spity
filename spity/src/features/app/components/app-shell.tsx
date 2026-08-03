import { Calendar, Handshake, MapPin, MessageCircle, Search, UserRound } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import BrandMark from '@/components/brand/brand-mark'
import { Badge } from '@/components/ui'
import type { AuthUser } from '@/features/auth/schemas'
import LogoutButton from './logout-button'

type AppShellNavItem = 'feed' | 'matching' | 'partnerships' | 'places' | 'events' | 'profile'

type AppShellProps = {
  activeItem: AppShellNavItem
  children: ReactNode
  user: AuthUser
}

const navigationItems: Array<{
  key: AppShellNavItem
  label: string
  href: string
  icon: typeof MessageCircle
  role?: 'grimpeur' | 'club'
}> = [
  { key: 'feed', label: 'Feed', href: '/app', icon: MessageCircle },
  { key: 'matching', label: 'Partenaires', href: '/app/matching', icon: Search, role: 'grimpeur' },
  { key: 'partnerships', label: 'Demandes', href: '/app/partnerships', icon: Handshake, role: 'grimpeur' },
  { key: 'places', label: 'Lieux', href: '/app/places', icon: MapPin },
  { key: 'events', label: 'Événements', href: '/app/events', icon: Calendar },
  { key: 'profile', label: 'Profil', href: '/profile/me', icon: UserRound },
]

export default function AppShell({ activeItem, children, user }: AppShellProps) {
  const isClub = user.role === 'club'
  const showProfileShortcut = activeItem !== 'profile'
  const navActionClass = '!text-white/80 hover:!bg-white/10 hover:!text-white'

  return (
    <main className="min-h-dvh bg-zinc-800 pb-10 text-foreground">
      <header className="sticky top-0 z-40 border-b border-zinc-700 bg-zinc-900/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/app" className="flex items-center gap-3 pr-2 text-2xl font-extrabold text-white">
                <BrandMark className="bg-white/6 shadow-lg shadow-black/20 ring-1 ring-white/12" priority size={42} tone="dark" />
                Spity
              </Link>
              <Badge className="bg-white/10 text-white" variant="default">{isClub ? 'Club' : 'Grimpeur'}</Badge>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <LogoutButton className={navActionClass} compact />
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-1 lg:pb-0" aria-label="Navigation principale">
            {navigationItems.filter((item) => !item.role || item.role === user.role).map((item) => {
              const Icon = item.icon
              const isActive = item.key === activeItem

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {showProfileShortcut && (
              <Link href="/profile/me" className={`spity-btn spity-btn--ghost ${navActionClass}`}>
                <UserRound size={18} aria-hidden="true" />
                Profil
              </Link>
            )}
            <LogoutButton className={navActionClass} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-7">{children}</div>
    </main>
  )
}
