import type { HTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/class-names'

export interface InfoTileProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  label: string
  value?: ReactNode
}

export default function InfoTile({ children, className = '', icon: Icon, label, value, ...props }: InfoTileProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-white/[0.04] p-4 shadow-sm', className)} {...props}>
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        {Icon && <Icon className="shrink-0 text-primary" size={16} aria-hidden="true" />}
        <span className="min-w-0 truncate">{label}</span>
      </div>
      <div className="mt-2 text-sm text-foreground">{value ?? children}</div>
    </div>
  )
}
