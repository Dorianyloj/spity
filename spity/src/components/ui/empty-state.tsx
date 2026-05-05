import type { HTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/class-names'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  description?: ReactNode
  icon?: LucideIcon
  title: ReactNode
}

export default function EmptyState({ className = '', description, icon: Icon, title, ...props }: EmptyStateProps) {
  return (
    <div className={cn('rounded-lg border border-border bg-white/[0.04] p-4 text-sm shadow-sm', className)} {...props}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icon size={18} aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{title}</p>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
      </div>
    </div>
  )
}
