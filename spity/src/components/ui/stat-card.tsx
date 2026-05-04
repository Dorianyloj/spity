import { forwardRef, HTMLAttributes } from 'react'
import { LucideIcon } from 'lucide-react'

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
      <div ref={ref} className={`spity-stat ${className}`} {...props}>
        {Icon && <Icon className="text-primary mb-2" size={20} />}
        <div className="spity-stat__value">{value}</div>
        <div className="spity-stat__label">{label}</div>
        {trend && (
          <div
            className={`text-xs font-medium mt-1 ${
              trend.isPositive ? 'text-success' : 'text-destructive'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    )
  }
)

StatCard.displayName = 'StatCard'

export default StatCard
