import Image, { type ImageProps } from 'next/image'
import { forwardRef } from 'react'
import { User } from 'lucide-react'
import { cn } from '@/lib/class-names'

export interface AvatarProps extends Omit<ImageProps, 'src' | 'alt' | 'width' | 'height' | 'fill'> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  ring?: boolean
  fallback?: string
  src?: string
  alt?: string
}

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      className = '',
      size = 'md',
      ring = false,
      src,
      alt = '',
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
        className={cn(
          'spity-avatar',
          sizeClasses[size],
          ring && 'spity-avatar--ring',
          !src && 'flex items-center justify-center bg-muted text-foreground',
          className
        )}
        role={!src && alt ? 'img' : undefined}
        aria-label={!src && alt ? alt : undefined}
      >
        {src ? (
          <Image
            ref={ref}
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 64px, 64px"
            className="object-cover"
            {...props}
          />
        ) : fallback ? (
          <span className="text-sm font-semibold text-foreground" aria-hidden={alt ? 'true' : undefined}>
            {fallback.trim().charAt(0).toUpperCase()}
          </span>
        ) : (
          <User className="text-muted-foreground" size={iconSizes[size]} aria-hidden={alt ? 'true' : undefined} />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
