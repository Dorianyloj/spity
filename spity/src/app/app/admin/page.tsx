import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/features/auth/lib/current-user'
import AppShell from '@/features/app/components/app-shell'
import AdminDashboard from '@/features/admin/components/dashboard'
import AdminManagement from '@/features/admin/components/management'
import { adminQuerySchema, adminHref } from '@/features/admin/schemas'

export const metadata: Metadata = { title: 'Administration — Spity', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!user.isAdmin) notFound()
  const query = adminQuerySchema.parse(await searchParams)
  const views = { dashboard: 'Vue d’ensemble', accounts: 'Comptes', posts: 'Publications', places: 'Lieux', history: 'Historique' } as const
  return <AppShell activeItem="admin" user={user}>
    <div className="mb-6"><p className="text-sm font-semibold text-primary">ESPACE ADMINISTRATEUR</p><h1 className="mt-2 text-balance text-3xl font-bold text-white sm:text-4xl">Administration</h1><p className="mt-3 text-pretty text-zinc-300">Suivez la communauté et veillez au bon fonctionnement de Spity.</p></div>
    <nav aria-label="Administration" className="mb-6 flex flex-wrap gap-2 border-b border-zinc-600 pb-4">{Object.entries(views).map(([view, label]) => <Link key={view} href={adminHref({ view: view as keyof typeof views, days: query.days })} aria-current={view === query.view ? 'page' : undefined} className={`rounded-lg px-4 py-3 text-sm font-semibold ${view === query.view ? 'bg-primary text-primary-foreground' : 'text-zinc-200 hover:bg-zinc-700'}`}>{label}</Link>)}</nav>
    {query.view === 'dashboard' ? <AdminDashboard days={query.days} /> : <AdminManagement query={query} />}
  </AppShell>
}
