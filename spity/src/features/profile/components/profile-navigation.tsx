'use client'
import { cn } from '@/lib/class-names'
import type { ProfileSection } from '../lib/presentation'

export default function ProfileNavigation({ section, onSection, owner }: { section: ProfileSection; onSection: (section: ProfileSection) => void; owner: boolean }) {
  const items: [ProfileSection, string][] = [['overview', owner ? 'Aperçu' : 'Profil'], ['posts', 'Publications'], ['equipment', owner ? 'Matériel' : 'Matériel partagé'], ...(owner ? [['settings', 'Réglages'] as [ProfileSection, string]] : [])]
  return <nav id="profile-sections" aria-label="Rubriques du profil" className="my-6 flex justify-between gap-2 border-b border-white/30 sm:justify-start sm:gap-6">{items.map(([key, label]) => <button id={section === key ? 'profile-section-active' : undefined} key={key} type="button" aria-pressed={section === key} onClick={() => onSection(key)} className={cn('min-h-12 border-b-2 px-1 pb-3 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:text-sm', section === key ? 'border-primary text-secondary' : 'border-transparent text-white/75')}>{label}</button>)}</nav>
}
