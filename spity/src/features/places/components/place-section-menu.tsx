import { Camera, CirclePlus, Flag, Route } from 'lucide-react'
import { cn } from '@/lib/class-names'

type PlaceSection = 'contribute' | 'routes' | 'photos' | 'reports'

type PlaceSectionMenuProps = {
  sections: Array<{
    href: string
    label: string
    section: PlaceSection
  }>
}

const icons = {
  contribute: CirclePlus,
  routes: Route,
  photos: Camera,
  reports: Flag,
} as const

export default function PlaceSectionMenu({ sections }: PlaceSectionMenuProps) {
  const gridColumns = sections.length === 4
    ? 'grid-cols-2 lg:grid-cols-4'
    : sections.length === 3
      ? 'grid-cols-3'
      : 'grid-cols-2'

  return (
    <nav aria-label="Sections de la fiche" className="rounded-lg border border-border bg-card p-2 shadow-sm">
      <ul className={cn('grid gap-1', gridColumns)}>
        {sections.map(({ href, label, section }) => {
          const Icon = icons[section]

          return (
            <li key={section}>
              <a
                className="flex min-h-12 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-foreground hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                href={href}
              >
                <Icon aria-hidden="true" className="size-4 text-primary" />
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
