import { forwardRef, HTMLAttributes } from 'react'
import { MapPin, Building2, Users } from 'lucide-react'

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
        className={`spity-tag spity-tag--${variant} ${className}`}
        {...props}
      >
        {icon && <Icon size={12} />}
        {children}
      </div>
    )
  }
)

Tag.displayName = 'Tag'

export default Tag
