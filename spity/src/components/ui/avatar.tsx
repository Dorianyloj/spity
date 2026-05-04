import { forwardRef, ImgHTMLAttributes } from 'react'
import { User } from 'lucide-react'

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  ring?: boolean
  fallback?: string
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      className = '',
      size = 'md',
      ring = false,
      src,
      alt = 'Avatar',
      fallback,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    }

    const iconSizes = {
      sm: 16,
      md: 20,
      lg: 24,
      xl: 32,
    }

    return (
      <div
        className={`
          spity-avatar
          ${sizeClasses[size]}
          ${ring ? 'spity-avatar--ring' : ''}
          ${!src ? 'bg-muted flex items-center justify-center' : ''}
          ${className}
        `}
      >
        {src ? (
          <img
            ref={ref}
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : fallback ? (
          <span className="text-foreground font-medium text-sm">
            {fallback.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User className="text-muted-foreground" size={iconSizes[size]} />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
