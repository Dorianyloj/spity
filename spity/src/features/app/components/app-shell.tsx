import { Calendar, Handshake, MapPin, MessageCircle, Search, ShieldCheck, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { Header } from '@/components/ui/header-2'
import type { AuthUser } from '@/features/auth/schemas'
import LogoutButton from './logout-button'

type AppShellNavItem = 'feed' | 'matching' | 'partnerships' | 'places' | 'events' | 'profile' | 'admin'

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
  adminOnly?: boolean
}> = [
  { key: 'feed', label: 'Feed', href: '/app', icon: MessageCircle },
  { key: 'matching', label: 'Partenaires', href: '/app/matching', icon: Search, role: 'grimpeur' },
  { key: 'partnerships', label: 'Demandes', href: '/app/partnerships', icon: Handshake, role: 'grimpeur' },
  { key: 'places', label: 'Lieux', href: '/app/places', icon: MapPin },
  { key: 'events', label: 'Événements', href: '/app/events', icon: Calendar },
  { key: 'profile', label: 'Profil', href: '/profile/me', icon: UserRound },
  { key: 'admin', label: 'Administration', href: '/app/admin', icon: ShieldCheck, adminOnly: true },
]

export default function AppShell({ activeItem, children, user }: AppShellProps) {
  const links = navigationItems
    .filter((item) => (!item.role || item.role === user.role) && (!item.adminOnly || user.isAdmin === true))
    .map((item) => ({ label: item.label, href: item.href, active: item.key === activeItem, icon: <item.icon size={18} aria-hidden="true" /> }))
  return (
    <div className="min-h-dvh bg-zinc-800 pb-10 text-foreground">
      <Header homeHref="/app" links={links} accountLabel={user.role === 'club' ? 'Club' : 'Grimpeur'} actions={<LogoutButton compact className="rounded-xl transition-none" />} mobileActions={<LogoutButton className="justify-start rounded-xl border border-border transition-none" />} />
      <main className="mx-auto max-w-7xl px-4 py-7">{children}</main>
    </div>
  )
}
