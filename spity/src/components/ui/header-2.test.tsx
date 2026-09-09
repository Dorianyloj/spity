import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Header } from './header-2'
import AppShell from '@/features/app/components/app-shell'
import { ownerFixture } from '../../../tests/fixtures/profile'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }))
jest.mock('next/link', () => {
  const React = jest.requireActual('react')
  return { __esModule: true, default: React.forwardRef(function MockLink({ href, onNavigate, ...props }: { href: string; onNavigate?: () => void }, ref: React.Ref<HTMLAnchorElement>) {
    return <a {...props} href={href} ref={ref} onClick={(event) => { event.preventDefault(); if (!event.metaKey && !event.ctrlKey) onNavigate?.() }} />
  }) }
})

let desktop = false
const mediaListeners = new Set<() => void>()
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.setAttribute('open', '') } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.removeAttribute('open') } })
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: () => ({ get matches() { return desktop }, addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener), removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener) }) })
})
beforeEach(() => {
  desktop = false
  mediaListeners.clear()
  document.body.style.overflow = ''
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
})

it('uses Spity branding, real public links and no duplicate mobile links while closed', async () => {
  const { container } = render(<Header />)
  expect(screen.getByRole('link', { name: 'Accueil Spity' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'Activités' })).toHaveAttribute('href', '/#activites')
  expect(screen.getByRole('link', { name: 'Connexion' })).toHaveAttribute('href', '/login')
  expect(screen.getByRole('link', { name: 'Créer un compte' })).toHaveAttribute('href', '/register')
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect((await axe(container)).violations).toEqual([])
})

it('opens a labelled native modal, locks scrolling and restores focus on Escape', async () => {
  document.body.style.overflow = 'auto'
  const { container } = render(<Header />)
  const trigger = screen.getByRole('button', { name: 'Ouvrir le menu' })
  trigger.focus(); fireEvent.click(trigger)
  const dialog = screen.getByRole('dialog', { name: 'À toi de grimper.' })
  expect(dialog).toHaveAttribute('id', trigger.getAttribute('aria-controls'))
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
  expect(screen.getByRole('button', { name: 'Fermer le menu' })).toHaveFocus()
  expect(document.body.style.overflow).toBe('hidden')
  expect((await axe(container)).violations).toEqual([])
  fireEvent(dialog, new Event('cancel', { cancelable: true }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(trigger).toHaveFocus()
  expect(document.body.style.overflow).toBe('auto')
})

it('closes the mobile menu after navigation or the close button', () => {
  render(<Header />)
  fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Activités' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
  fireEvent.click(screen.getByRole('button', { name: 'Fermer le menu' }))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('releases scroll locking and focuses the brand when switching to desktop', () => {
  const { unmount } = render(<Header />)
  fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
  act(() => { desktop = true; mediaListeners.forEach((listener) => listener()) })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Accueil Spity' })).toHaveFocus()
  expect(document.body.style.overflow).toBe('')
  expect(mediaListeners.size).toBe(0)
  desktop = false
  fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
  unmount()
  expect(document.body.style.overflow).toBe('')
  expect(mediaListeners.size).toBe(0)
})

it('updates the floating surface only after crossing the scroll threshold', () => {
  const { container, unmount } = render(<Header />)
  const header = container.querySelector('header')!
  expect(header).toHaveAttribute('data-scrolled', 'false')
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 20 })
  fireEvent.scroll(window)
  expect(header).toHaveAttribute('data-scrolled', 'true')
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
  fireEvent.scroll(window)
  expect(header).toHaveAttribute('data-scrolled', 'false')
  unmount()
})

it.each(['grimpeur', 'club'] as const)('preserves the %s navigation and active page without exposing administration', (role) => {
  const user = { ...ownerFixture().user, role }
  render(<AppShell user={user} activeItem="profile"><h1>Mon profil</h1></AppShell>)
  const nav = within(screen.getByRole('navigation', { name: 'Navigation principale' }))
  expect(nav.getByRole('link', { name: 'Profil' })).toHaveAttribute('aria-current', 'page')
  expect(nav.getAllByRole('link')).toHaveLength(role === 'club' ? 4 : 6)
  expect(nav.queryByRole('link', { name: 'Administration' })).not.toBeInTheDocument()
  expect(screen.getByRole('main')).toHaveTextContent('Mon profil')
})

it('retains administration and a readable logout action inside the mobile menu', () => {
  render(<AppShell user={{ ...ownerFixture().user, isAdmin: true }} activeItem="admin"><h1>Administration</h1></AppShell>)
  fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
  const menu = within(screen.getByRole('dialog'))
  expect(menu.getByRole('link', { name: 'Administration' })).toHaveAttribute('aria-current', 'page')
  expect(menu.getAllByRole('link')).toHaveLength(8)
  expect(menu.getByRole('button', { name: 'Déconnexion' })).toBeVisible()
  expect(menu.queryByRole('link', { name: 'Connexion' })).not.toBeInTheDocument()
})
