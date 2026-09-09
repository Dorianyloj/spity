'use client'

import { ArrowRight, Compass, Menu, Route, Users, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { brandAssets } from '@/lib/brand-assets'
import { cn } from '@/lib/class-names'
import Button from './button'
import { useScroll } from './use-scroll'

export type HeaderLink = {
  label: string
  href: string
  icon?: ReactNode
  active?: boolean
}

const publicLinks: HeaderLink[] = [
  { label: 'Activités', href: '/#activites', icon: <Compass size={18} aria-hidden="true" /> },
  { label: 'Topos', href: '/#galerie', icon: <Route size={18} aria-hidden="true" /> },
  { label: 'Communauté', href: '/#communaute', icon: <Users size={18} aria-hidden="true" /> },
]

function HeaderBrand({ light = false }: { light?: boolean }) {
  return <span className="relative block h-12 w-24 shrink-0 overflow-hidden">
    <Image src={brandAssets.logoTransparent} alt="" width={128} height={128} priority className={cn('absolute top-1/2 left-1/2 size-32 max-w-none -translate-x-1/2 -translate-y-1/2', light && 'brightness-0 invert')} />
  </span>
}

function PublicActions() {
  return <>
    <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">Connexion</Link>
    <Link href="/register" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[#a2ca75]">
      Créer un compte <ArrowRight size={16} aria-hidden="true" />
    </Link>
  </>
}

function NavigationLinks({ links, mobile = false, onNavigate }: { links: HeaderLink[]; mobile?: boolean; onNavigate?: () => void }) {
  return <ul className={cn('flex gap-1', mobile ? 'flex-col' : 'items-center')}>
    {links.map((link) => <li key={link.href}>
      <Link href={link.href} aria-current={link.active ? 'page' : undefined} onNavigate={onNavigate}
        className={cn('flex min-h-11 items-center rounded-xl text-sm font-semibold', mobile ? 'gap-3 px-4 py-3' : 'gap-2 px-3', link.active ? 'bg-foreground text-card' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
        {link.icon}{link.label}
        {mobile && <ArrowRight size={16} aria-hidden="true" className="ml-auto shrink-0" />}
      </Link>
    </li>)}
  </ul>
}

export function Header({ links = publicLinks, homeHref = '/', accountLabel, actions, mobileActions, overlay = false }: {
  links?: HeaderLink[]
  homeHref?: string
  accountLabel?: string
  actions?: ReactNode
  mobileActions?: ReactNode
  overlay?: boolean
}) {
  const [open, setOpen] = useState(false)
  const scrolled = useScroll(10)
  const id = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const brandRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current!
    const trigger = triggerRef.current
    const brand = brandRef.current
    const desktop = window.matchMedia('(min-width: 1280px)')
    const previousOverflow = document.body.style.overflow
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    dialog.showModal()
    closeRef.current?.focus({ preventScroll: true })
    document.body.style.overflow = 'hidden'
    desktop.addEventListener('change', closeOnDesktop)
    closeOnDesktop()
    return () => {
      desktop.removeEventListener('change', closeOnDesktop)
      dialog.close()
      document.body.style.overflow = previousOverflow
      const target = desktop.matches ? brand : trigger
      if (target?.isConnected) target.focus({ preventScroll: true })
    }
  }, [open])

  const close = () => setOpen(false)
  return <header data-spity-header data-scrolled={scrolled} className={cn('top-0 z-40 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6', overlay ? 'dark fixed inset-x-0' : 'sticky')}>
    <div className={cn('mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border p-2.5 text-foreground sm:px-4', scrolled ? 'border-border bg-card/95 shadow-lg backdrop-blur-lg' : overlay ? 'border-border bg-card/90 shadow-lg backdrop-blur-lg' : 'border-card/80 bg-card shadow-sm')}>
      <Link ref={brandRef} href={homeHref} aria-label="Accueil Spity" className="flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl pr-2">
        <HeaderBrand light={overlay} />
      </Link>
      <nav aria-label="Navigation principale" className="hidden xl:block"><NavigationLinks links={links} /></nav>
      <div className="hidden shrink-0 items-center gap-2 border-l border-border pl-4 xl:flex">
        {accountLabel && <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">{accountLabel}</span>}
        {actions ?? <PublicActions />}
      </div>
      <Button ref={triggerRef} variant="ghost" className="shrink-0 gap-2 rounded-xl border border-border px-3 transition-none xl:hidden" aria-label="Ouvrir le menu" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
        <span className="text-sm">Menu</span><Menu size={20} aria-hidden="true" />
      </Button>
    </div>
    {open && <dialog ref={dialogRef} id={id} aria-labelledby={`${id}-title`} onCancel={(event) => { event.preventDefault(); close() }}
      className="fixed inset-0 m-0 h-dvh max-h-dvh w-full max-w-none overflow-y-auto bg-card p-0 text-foreground backdrop:bg-black/50">
      <div className="mx-auto flex min-h-full max-w-xl flex-col pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
          <Link href={homeHref} onNavigate={close} aria-label="Accueil Spity" className="flex min-h-11 items-center rounded-xl"><HeaderBrand light={overlay} /></Link>
          <Button ref={closeRef} variant="ghost" aria-label="Fermer le menu" className="shrink-0 rounded-xl border border-border px-3 transition-none" onClick={close}><X size={20} aria-hidden="true" /></Button>
        </div>
        <div className="flex items-center justify-between gap-4 pt-7 pb-4">
          <h2 id={`${id}-title`} className="text-balance text-2xl font-bold">À toi de grimper.</h2>
          {accountLabel && <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">{accountLabel}</span>}
        </div>
        <nav aria-label="Navigation mobile"><NavigationLinks links={links} mobile onNavigate={close} /></nav>
        <div className="mt-auto pt-8">
          <div className="flex flex-col gap-3 border-t border-border pt-5">{mobileActions ?? actions ?? <PublicActions />}</div>
          <p className="mt-5 text-pretty text-center text-xs text-muted-foreground">Le prochain sommet commence ensemble.</p>
        </div>
      </div>
    </dialog>}
  </header>
}
