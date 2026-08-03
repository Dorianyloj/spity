import { forwardRef, type HTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/class-names'

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number
  label: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className = '', value, label, icon: Icon, trend, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('spity-stat', className)} {...props}>
        {Icon && <Icon className="mb-2 text-primary" size={20} aria-hidden="true" />}
        <div className="spity-stat__value">{value}</div>
        <div className="spity-stat__label">{label}</div>
        {trend && (
          <div
            className={cn('mt-1 text-xs font-semibold', trend.isPositive ? 'text-success' : 'text-destructive')}
            aria-label={`${trend.isPositive ? 'Hausse' : 'Baisse'} de ${Math.abs(trend.value)} pour cent`}
          >
            <span aria-hidden="true">{trend.isPositive ? '↑' : '↓'}</span> {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'

export default StatCard
