import { forwardRef, type HTMLAttributes } from 'react'
import { MapPin, Building2, Users } from 'lucide-react'
import { cn } from '@/lib/class-names'

export interface TagProps extends HTMLAttributes<HTMLDivElement> {
  variant: 'gym' | 'outdoor' | 'club'
  icon?: boolean
}

const Tag = forwardRef<HTMLDivElement, TagProps>(
  ({ className = '', variant, icon = true, children, ...props }, ref) => {
    const icons = {
      gym: Building2,
      outdoor: MapPin,
      club: Users,
    }

    const Icon = icons[variant]

    return (
      <div
        ref={ref}
        className={cn('spity-tag', `spity-tag--${variant}`, className)}
        {...props}
      >
        {icon && <Icon size={12} aria-hidden="true" />}
        {children}
      </div>
    )
  }
)

Tag.displayName = 'Tag'

export default Tag
