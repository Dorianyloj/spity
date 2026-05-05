import type { HTMLAttributes, ReactNode } from 'react'
import Badge from './badge'
import { makeDarkPanelBackground } from '@/lib/brand-assets'

type AppHeroStat = {
  label: string
  value: ReactNode
}

export interface AppHeroProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  backgroundImage: string
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  stats?: AppHeroStat[]
  children?: ReactNode
}

export default function AppHero({
  backgroundImage,
  children,
  className = '',
  description,
  eyebrow,
  stats = [],
  style,
  title,
  ...props
}: AppHeroProps) {
  return (
    <section
      className={`overflow-hidden rounded-lg border border-white/10 bg-cover bg-center p-6 shadow-2xl shadow-black/20 md:p-8 ${className}`}
      style={{ backgroundImage: makeDarkPanelBackground(backgroundImage), ...style }}
      {...props}
    >
      {eyebrow && (
        <Badge className="bg-primary text-primary-foreground" variant="default">
          {eyebrow}
        </Badge>
      )}
      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <h1 className="text-4xl font-black text-white md:text-5xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-white/[0.78]">{description}</p>}
          {children && <div className="mt-6 flex flex-wrap gap-2">{children}</div>}
        </div>
        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/10 bg-[#173236]/68 p-3 backdrop-blur">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black text-primary">{stat.value}</p>
                <p className="text-xs font-semibold uppercase text-white/[0.62]">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
