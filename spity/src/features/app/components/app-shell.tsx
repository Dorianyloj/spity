import { Calendar, MapPin, MessageCircle, Search, UserRound } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui'
import type { AuthUser } from '@/features/auth/schemas'
import LogoutButton from './logout-button'

type AppShellNavItem = 'feed' | 'discover' | 'places' | 'events' | 'profile'

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
}> = [
  { key: 'feed', label: 'Feed', href: '/app', icon: MessageCircle },
  { key: 'discover', label: 'Découvrir', href: '/app', icon: Search },
  { key: 'places', label: 'Lieux', href: '/app', icon: MapPin },
  { key: 'events', label: 'Événements', href: '/app', icon: Calendar },
  { key: 'profile', label: 'Profil', href: '/profile/me', icon: UserRound },
]

export default function AppShell({ activeItem, children, user }: AppShellProps) {
  const isClub = user.role === 'club'
  const showProfileShortcut = activeItem !== 'profile'
  const navActionClass = '!text-secondary-foreground/80 hover:!bg-white/10 hover:!text-white'

  return (
    <main className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-secondary text-secondary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/app" className="flex items-center gap-2 pr-2 text-2xl font-extrabold text-secondary-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                  S
                </span>
                spity
              </Link>
              <Badge className="bg-white/10 text-secondary-foreground" variant="default">{isClub ? 'Club' : 'Grimpeur'}</Badge>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <LogoutButton className={navActionClass} />
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-1 lg:pb-0" aria-label="Navigation principale">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = item.key === activeItem

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-secondary-foreground/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {showProfileShortcut && (
              <Link href="/profile/me" className={`spity-btn spity-btn--ghost ${navActionClass}`}>
                <UserRound size={18} />
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
