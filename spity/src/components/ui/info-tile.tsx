import type { HTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface InfoTileProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  label: string
  value?: ReactNode
}

export default function InfoTile({ children, className = '', icon: Icon, label, value, ...props }: InfoTileProps) {
  return (
    <div className={`rounded-lg border border-border bg-white/[0.03] p-4 ${className}`} {...props}>
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        {Icon && <Icon className="text-primary" size={16} />}
        {label}
      </div>
      <div className="mt-2 text-sm text-foreground">{value ?? children}</div>
    </div>
  )
}
