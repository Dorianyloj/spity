'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Eye, LockKeyhole, Mountain, Pencil, Settings2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'
import type { ProfileMeResponse } from '../schemas'
import type { PublicProfile } from '../lib/public-profile-repository'
import { ownerPresentation, profileCompletion, type ProfileEditorKind, type ProfileSection } from '../lib/presentation'
import ProfileEditor from './profile-editor'
import ProfileEquipment from './profile-equipment'
import { PartnerCard, ProfileCard, ProfileHero, ProfileOverview } from './profile-presentation'
import { ProfilePostComposer, ProfilePosts } from './profile-posts'
import ProfileNavigation from './profile-navigation'

export default function ProfileWorkspace({ initialProfile, publicProfile, initialSection = 'overview' }: { initialProfile: ProfileMeResponse; publicProfile: PublicProfile; initialSection?: ProfileSection }) {
  const [profile, setProfile] = useState(initialProfile)
  const [section, setSection] = useState(initialSection)
  const [editor, setEditor] = useState<ProfileEditorKind | null>(null)
  const [compose, setCompose] = useState(false)
  const [feedback, setFeedback] = useState('')
  const router = useRouter()
  const presentation = ownerPresentation(profile, publicProfile)
  const readiness = profileCompletion(profile)
  const memberHref = `/app/profiles/${profile.user.id}`
  const readinessCard = <ProfileCard title="Un profil qui te ressemble" icon={UserRound}><div className="mb-3 flex items-baseline justify-between gap-3"><p className="text-sm text-muted-foreground">{readiness.count} éléments sur {readiness.total}</p><strong className="text-2xl tabular-nums">{readiness.percent} %</strong></div><progress className="h-2 w-full overflow-hidden rounded-full accent-foreground" value={readiness.count} max={readiness.total} aria-label="Complétude du profil">{readiness.percent} %</progress><ul className="mt-5 space-y-3">{readiness.items.map((item) => <li key={item.label} className="flex items-center gap-2 text-xs text-muted-foreground">{item.done ? <><Check size={16} className="shrink-0" aria-hidden="true" />{item.label}<span className="sr-only"> : complété</span></> : <Button variant="ghost" size="sm" onClick={() => item.editor === 'equipment' ? setSection('equipment') : setEditor(item.editor)}>{item.label}</Button>}</li>)}</ul><p className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-pretty text-xs text-muted-foreground"><LockKeyhole size={16} className="shrink-0" aria-hidden="true" />Ce suivi est privé. Il ne représente ni ton niveau ni ta fiabilité.</p></ProfileCard>
  const posts = <ProfilePosts profile={presentation} basePath="/profile/me" summary onAll={() => setSection('posts')} onCompose={() => setCompose(true)} />
  return <div className="mx-auto max-w-7xl">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-white"><div><h1 className="text-balance text-3xl font-bold">Mon profil</h1><p className="mt-2 text-pretty text-sm text-white/75">Ta pratique, tes envies, ta prochaine cordée.</p></div><div className="flex rounded-lg border border-white/30 bg-zinc-900 p-1 text-sm"><span className="flex min-h-11 items-center gap-2 rounded-md bg-card px-3 text-foreground"><UserRound size={16} aria-hidden="true" />Mon espace</span><Link className="flex min-h-11 items-center gap-2 rounded-md px-3 focus-visible:outline-2 focus-visible:outline-primary" href={memberHref}><Eye size={16} aria-hidden="true" />Vue membre</Link></div></div>
    {feedback && <p role="status" className="mb-4 text-sm text-secondary">{feedback}</p>}
    <ProfileHero profile={presentation} action={<Button variant="secondary" onClick={() => setEditor('identity')}><Pencil size={16} aria-hidden="true" />Modifier mon profil</Button>} />
    <ProfileNavigation section={section} onSection={setSection} owner />
    {section === 'overview' && <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><ProfileOverview profile={presentation} onEdit={setEditor} fallbackAction={null} posts={posts} /><aside className="space-y-6" aria-label="Partenaires et complétude du profil"><PartnerCard profile={presentation} action={<Button variant="secondary" onClick={() => setEditor('partners')}><Settings2 size={16} aria-hidden="true" />Mes préférences de partenaire</Button>} />{readinessCard}</aside></div>}
    {section === 'posts' && <div className="text-white"><ProfilePosts profile={presentation} basePath="/profile/me" onCompose={() => setCompose(true)} /></div>}
    {section === 'equipment' && <ProfileEquipment equipment={profile.equipment} sharingEnabled={profile.grimpeurProfile?.partnerSearch.shareEquipment} onSharing={() => setEditor('partners')} onChange={(equipment) => { setProfile((current) => ({ ...current, equipment })); router.refresh() }} />}
    {section === 'settings' && <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"><div className="space-y-6"><ProfileCard title="Personnaliser mon profil" icon={Settings2}><div className="divide-y divide-border">{([['identity', 'Identité et présentation', 'Nom affiché, photo, ville et bio.'], ['practice', 'Pratique et objectifs', 'Disciplines, niveaux déclarés et envies de grimpe.'], ['partners', 'Disponibilités et partenaires', 'Créneaux, recherche et partage du matériel.']] as const).map(([kind, title, description]) => <div key={kind} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-pretty text-sm text-muted-foreground">{description}</p></div><Button variant="secondary" onClick={() => setEditor(kind)} aria-label={`Modifier : ${title}`}>Modifier</Button></div>)}</div></ProfileCard><ProfileCard title="Compte et sécurité" icon={LockKeyhole}><p className="text-pretty text-sm text-muted-foreground">Ces informations restent privées.</p><h3 className="mt-4 text-sm font-semibold">Adresse e-mail de connexion</h3><p className="mt-1 wrap-anywhere text-sm">{profile.user.email}</p><p className="mt-5 rounded-lg bg-secondary p-4 text-pretty text-xs">Le changement d’e-mail ou de mot de passe et la suppression du compte ne sont pas encore disponibles ici. Aucun réglage fictif n’est proposé.</p></ProfileCard></div><aside className="space-y-6"><ProfileCard title="Ce que les membres voient" icon={Eye}><ul className="list-disc space-y-3 pl-5 text-sm"><li>Ta présentation et ta pratique.</li><li>Tes envies, disponibilités et préférences.</li><li>Tes publications non masquées.</li><li>Le matériel disponible, seulement si tu actives son affichage.</li></ul><p className="my-4 text-pretty text-xs text-muted-foreground">L’e-mail, les notes du matériel et l’inventaire non partagé ne sont pas transmis à la fiche membre.</p><Link className="spity-btn spity-btn--secondary" href={memberHref}>Vérifier ma vue membre</Link></ProfileCard>{readinessCard}</aside></div>}
    <p className="mt-6 flex items-start gap-2 text-xs text-white/75"><Mountain size={15} aria-hidden="true" className="shrink-0" />Couverture décorative : Denis E. Corpet / Wikimedia Commons, CC BY-SA 2.5.</p>
    {editor && <ProfileEditor kind={editor} profile={profile} onClose={() => setEditor(null)} onSaved={(fresh) => { setProfile(fresh); setEditor(null); setFeedback('Profil mis à jour.'); router.refresh() }} />}
    {compose && <ProfilePostComposer onClose={() => setCompose(false)} onPublished={() => { setCompose(false); setSection('posts'); setFeedback('Publication créée.'); router.push('/profile/me?section=posts'); router.refresh() }} />}
  </div>
}
