'use client'

import Link from 'next/link'
import { Eye, UserRound, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { partnershipResponseSchema } from '@/features/matching/schemas'
import type { PublicProfile } from '../lib/public-profile-repository'
import type { ProfileSection } from '../lib/presentation'
import ProfileDialog from './profile-dialog'
import ProfileEquipment from './profile-equipment'
import { apiData, failureMessage, FormError } from './profile-fields'
import { ProfilePosts } from './profile-posts'
import { PartnerCard, ProfileHero, ProfileOverview, ProfileSafety } from './profile-presentation'
import ProfileNavigation from './profile-navigation'

export default function MemberProfile({ profile, isOwner, canRequest, initialStatus, initialSection = 'overview' }: {
  profile: PublicProfile; isOwner: boolean; canRequest: boolean; initialStatus: 'pending' | 'accepted' | 'declined' | null; initialSection?: ProfileSection
}) {
  const [section, setSection] = useState<ProfileSection>(initialSection === 'settings' ? 'overview' : initialSection)
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState(initialStatus)
  const [feedback, setFeedback] = useState('')
  const basePath = `/app/profiles/${profile.userId}`
  const requests = <Link className="spity-btn spity-btn--secondary" href="/app/partnerships">Voir les demandes</Link>
  const action = isOwner ? <Link className="spity-btn spity-btn--secondary" href="/profile/me">Revenir à mon espace</Link>
    : status === 'pending' || status === 'accepted' ? <div className="space-y-2"><p className="text-sm">{status === 'accepted' ? 'Vous êtes partenaires.' : 'Une demande est déjà en attente.'}</p>{requests}</div>
      : canRequest && profile.partnerSearch?.enabled ? <Button onClick={() => { setError(null); setConfirm(true) }}><UsersRound size={16} aria-hidden="true" />Grimper ensemble</Button> : null
  async function send() {
    setBusy(true); setError(null)
    try {
      const response = partnershipResponseSchema.parse(await apiData(await fetch('/api/partnerships', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recipientId: profile.userId }) })))
      setStatus(response.request.status); setConfirm(false); setFeedback('Demande envoyée. Tu peux la retrouver dans tes demandes de partenaire.')
    } catch (error) { setError(failureMessage(error)) } finally { setBusy(false) }
  }
  const fallback = <Link className="spity-btn spity-btn--secondary" href={isOwner ? '/profile/me' : '/app/matching'}>{isOwner ? 'Compléter mon profil' : 'Voir les partenaires'}</Link>
  return <div className="mx-auto max-w-7xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-white"><div><h1 className="text-balance text-3xl font-bold">{isOwner ? 'Mon profil, côté membres' : 'Profil de grimpeur'}</h1><p className="mt-2 text-pretty text-sm text-white/75">{isOwner ? 'Voici les informations transmises aux autres membres.' : 'Une pratique, des envies et peut-être une prochaine cordée.'}</p></div>{isOwner && <div className="flex rounded-lg border border-white/30 bg-zinc-900 p-1 text-sm"><Link className="flex min-h-11 items-center gap-2 rounded-md px-3 focus-visible:outline-2 focus-visible:outline-primary" href="/profile/me"><UserRound size={16} aria-hidden="true" />Mon espace</Link><span className="flex min-h-11 items-center gap-2 rounded-md bg-card px-3 text-foreground"><Eye size={16} aria-hidden="true" />Vue membre</span></div>}</div>
    {isOwner && <p className="mb-4 rounded-lg bg-secondary p-4 text-pretty text-sm">Cette fiche est réservée aux membres connectés. L’e-mail, les réglages, les notes personnelles et le matériel non partagé ne font pas partie de la fiche membre.</p>}
    {feedback && <p className="mb-4 text-sm text-secondary" role="status">{feedback}</p>}
    <ProfileHero profile={profile} action={action} /><ProfileNavigation section={section} onSection={setSection} owner={false} />
    {section === 'overview' && <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><ProfileOverview profile={profile} fallbackAction={fallback} posts={<ProfilePosts profile={profile} basePath={basePath} summary onAll={() => setSection('posts')} />} /><aside className="space-y-6"><PartnerCard profile={profile} action={action} /><ProfileSafety /></aside></div>}
    {section === 'posts' && <div className="text-white"><ProfilePosts profile={profile} basePath={basePath} /></div>}
    {section === 'equipment' && <ProfileEquipment equipment={profile.sharedEquipment} />}
    <p className="mt-6 text-xs text-white/75">Couverture décorative : Denis E. Corpet / Wikimedia Commons, CC BY-SA 2.5.</p>
    {confirm && <ProfileDialog title="Grimper ensemble ?" description={`Envoyer une demande de partenaire à ${profile.displayName}.`} busy={busy} onClose={() => setConfirm(false)}><div className="space-y-4 p-5"><p className="text-pretty text-sm">La demande apparaîtra dans vos espaces « Demandes ». Elle ne réserve pas de créneau et ne confirme pas de sortie.</p><FormError message={error} /><div className="flex flex-wrap justify-end gap-3"><Button variant="secondary" disabled={busy} onClick={() => setConfirm(false)}>Annuler</Button><Button isLoading={busy} loadingText="Envoi…" onClick={send}>Envoyer la demande</Button></div></div></ProfileDialog>}
  </div>
}
