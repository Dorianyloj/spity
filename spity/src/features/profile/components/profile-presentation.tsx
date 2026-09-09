import Image from 'next/image'
import { CalendarDays, Check, Clock, MapPin, Mountain, Pencil, Target, UsersRound, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Avatar, Badge, Button, Card } from '@/components/ui'
import { cn } from '@/lib/class-names'
import { demoClimbingAssets } from '@/lib/brand-assets'
import type { PublicProfile } from '../lib/public-profile-repository'
import { availabilityLabels, disciplineLabels, environmentLabels, partnerLevelLabels, partnerStyleLabels, type ProfileEditorKind } from '../lib/presentation'

export function ProfileCard({ title, icon: Icon, children, action, description, className }: { title: string; icon: LucideIcon; children: ReactNode; action?: ReactNode; description?: string; className?: string }) {
  return <Card hover={false} className={cn('min-w-0 p-5 sm:p-6', className)}><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-balance text-lg font-bold"><Icon size={20} aria-hidden="true" className="shrink-0 text-foreground" />{title}</h2>{description && <p className="mt-1 text-pretty text-xs text-muted-foreground">{description}</p>}</div>{action}</div>{children}</Card>
}
export function ProfileEmpty({ title, children, action }: { title: string; children: ReactNode; action: ReactNode }) {
  return <div className="py-5 text-center"><h3 className="text-balance font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-md text-pretty text-sm text-muted-foreground">{children}</p><div className="mt-4">{action}</div></div>
}
export function ProfileHero({ profile, action }: { profile: PublicProfile; action: ReactNode }) {
  const since = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(profile.createdAt))
  return <Card hover={false} className="overflow-hidden">
    <div className="relative h-32 sm:h-36"><Image fill sizes="(max-width: 1280px) 100vw, 1230px" src={demoClimbingAssets.verdonCliff} alt="" className="object-cover object-center" priority /></div>
    <div className="px-5 pb-6 sm:flex sm:gap-6 sm:px-7"><Avatar size="xl" src={profile.avatarUrl ?? undefined} fallback={profile.displayName} alt={`Photo de ${profile.displayName}`} className="relative -mt-9 size-24! shrink-0 border-4 border-card bg-secondary" />
      <div className="min-w-0 flex-1 pt-4"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0"><h2 className="wrap-anywhere text-balance text-2xl font-bold sm:text-3xl">{profile.displayName}</h2><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><MapPin size={16} aria-hidden="true" />{profile.location || 'Ville à préciser'}</span><span className="flex items-center gap-1.5"><Mountain size={16} aria-hidden="true" />{profile.climbingEnvironment ? environmentLabels[profile.climbingEnvironment] : 'Pratique à préciser'}</span></div></div><div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-col sm:items-end"><Badge variant={profile.partnerSearch?.enabled ? 'success' : 'default'}>{profile.partnerSearch?.enabled ? 'En recherche de partenaires' : 'Recherche en pause'}</Badge>{action}</div></div><p className="mt-4 max-w-3xl wrap-anywhere whitespace-pre-wrap text-pretty text-sm">{profile.bio || 'La présentation n’est pas encore renseignée.'}</p></div>
    </div><div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-muted/20 px-5 py-4 sm:px-7"><dl className="flex gap-5 sm:gap-8">{[[profile.postCount, 'publications'], [profile.disciplines.length, 'disciplines'], [profile.sharedEquipment.length, 'équipements partagés']].map(([value, label]) => <div key={label} className="flex max-w-24 flex-col sm:max-w-none sm:flex-row sm:items-baseline sm:gap-2"><dd className="text-xl font-bold tabular-nums">{value}</dd><dt className="text-xs text-muted-foreground">{label}</dt></div>)}</dl><p className="text-xs text-muted-foreground">Membre depuis {since}</p></div>
  </Card>
}
export function ProfileOverview({ profile, onEdit, fallbackAction, posts }: { profile: PublicProfile; onEdit?: (kind: ProfileEditorKind) => void; fallbackAction: ReactNode; posts: ReactNode }) {
  const edit = (kind: ProfileEditorKind, label = 'Modifier') => onEdit ? <Button variant="ghost" size="sm" aria-label={`${label} : ${kind === 'practice' ? 'pratique et objectifs' : 'disponibilités et partenaires'}`} onClick={() => onEdit(kind)}><Pencil size={15} aria-hidden="true" />{label}</Button> : undefined
  return <div className="space-y-6">
    <ProfileCard title="Ma pratique" icon={Mountain} action={edit('practice')}>
      {profile.disciplines.length ? <><div className="grid grid-cols-3 gap-2 sm:gap-3">{profile.disciplines.map((key) => <div key={key} className="min-w-0 rounded-lg border border-border bg-muted/20 p-3 sm:p-4"><h3 className="wrap-anywhere text-sm font-semibold">{disciplineLabels[key] ?? key}</h3><p className="mt-3 text-2xl font-semibold tabular-nums sm:text-3xl">{profile.niveaux[key] || '—'}</p><p className="mt-2 text-xs text-muted-foreground">Niveau déclaré</p></div>)}</div><p className="mt-4 text-pretty text-xs text-muted-foreground">Des repères pour grimper ensemble, pas un classement.</p></> : <ProfileEmpty title="À chacun sa pratique" action={onEdit ? edit('practice', 'Renseigner ma pratique') : fallbackAction}>Les disciplines et les niveaux ne sont pas encore renseignés.</ProfileEmpty>}
    </ProfileCard>
    <ProfileCard title="Quand grimper ensemble ?" icon={CalendarDays} action={edit('partners', 'Ajuster')} description="Des créneaux habituels, à confirmer avant chaque sortie.">
      {profile.availability.length ? <div className="grid grid-cols-3 gap-2">{Object.entries(availabilityLabels).map(([key, label]) => { const available = profile.availability.some((slot) => slot === key); const [day, time] = label.split(' · '); return <div key={key} className={cn('rounded-lg border border-border p-2 text-center text-xs sm:p-3', available ? 'bg-secondary' : 'bg-muted/20')}><p>{day}</p><p className="mt-1 font-semibold">{time}</p><span className="mt-2 flex items-center justify-center gap-1 text-muted-foreground">{available && <Check size={13} aria-hidden="true" className="hidden sm:block" />}{available ? 'Disponible' : 'Non indiqué'}</span></div> })}</div> : <ProfileEmpty title="Un créneau en commun ?" action={onEdit ? edit('partners', 'Ajouter mes disponibilités') : fallbackAction}>Les disponibilités ne sont pas encore renseignées.</ProfileEmpty>}
    </ProfileCard>
    <ProfileCard title="Mes envies de grimpe" icon={Target} action={edit('practice')} description="Ce qui me motive pour les prochaines sessions.">{profile.goals.length ? <ul className="flex flex-wrap gap-2">{profile.goals.map((goal) => <li key={goal} className="rounded-lg bg-secondary px-3 py-2 text-sm">{goal}</li>)}</ul> : <ProfileEmpty title="Qu’est-ce qui te donne envie ?" action={onEdit ? edit('practice', 'Choisir mes objectifs') : fallbackAction}>Les objectifs aident à trouver des partenaires qui partagent tes envies.</ProfileEmpty>}</ProfileCard>
    {posts}
  </div>
}
export function PartnerCard({ profile, action }: { profile: PublicProfile; action?: ReactNode }) {
  const partner = profile.partnerSearch
  return <ProfileCard title={partner?.enabled ? 'La prochaine cordée ?' : 'À ton rythme'} icon={UsersRound} className="bg-secondary!">
    <p className="text-pretty text-sm">{partner?.enabled ? 'Un peu de technique, de confiance et surtout le plaisir de grimper ensemble.' : 'La recherche est en pause. Le profil reste visible aux membres.'}</p>
    {partner && <div className="my-4 flex flex-wrap gap-2"><Badge variant="default">{partnerLevelLabels[partner.levelPreference]}</Badge><Badge variant="default">{partnerStyleLabels[partner.style]}</Badge></div>}
    {partner?.notes && <p className="wrap-anywhere whitespace-pre-wrap text-pretty text-sm">{partner.notes}</p>}
    {action && <div className="mt-5">{action}</div>}
  </ProfileCard>
}
export function ProfileSafety() {
  return <ProfileCard title="Pour une première sortie" icon={Clock}><p className="text-pretty text-sm text-muted-foreground">Échangez sur le lieu, les disponibilités, l’assurage et le matériel avant de vous retrouver.</p><p className="mt-3 text-pretty text-xs text-muted-foreground">Les niveaux et les états du matériel sont déclaratifs. Spity ne certifie pas les compétences d’assurage ou la sécurité d’un équipement.</p></ProfileCard>
}
export function ProfileCredits() {
  const linkClass = 'underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
  return <p className="mt-6 text-pretty text-xs text-white/75">Couverture décorative recadrée : <a className={linkClass} href="https://commons.wikimedia.org/wiki/File:Verdon-cliff-eperon-Sublime-vude-Trescaire.jpg" rel="noreferrer">Denis E. Corpet / Wikimedia Commons</a>, <a className={linkClass} href="https://creativecommons.org/licenses/by-sa/2.5/" rel="noreferrer">CC BY-SA 2.5</a>.</p>
}
