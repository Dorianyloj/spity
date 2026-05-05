import { forwardRef, type HTMLAttributes, type MouseEventHandler } from 'react'
import Avatar from './avatar'
import { cn } from '@/lib/class-names'

export interface StoryAvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'> {
  src?: string
  alt?: string
  username: string
  fallback?: string
  seen?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const StoryAvatar = forwardRef<HTMLDivElement, StoryAvatarProps>(
  (
    {
      className = '',
      src,
      alt,
      username,
      fallback,
      seen = false,
      size = 'md',
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'w-14 h-14',
      md: 'w-16 h-16',
      lg: 'w-20 h-20',
    }

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center gap-1', className)}
        {...props}
      >
        <button
          type="button"
          onClick={onClick}
          className={cn(
            seen ? 'spity-story-ring--seen' : 'spity-story-ring',
            sizeClasses[size],
            'transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          )}
          aria-label={`${seen ? 'Revoir' : 'Voir'} la story de ${username}`}
        >
          <Avatar
            src={src}
            alt={alt || username}
            fallback={fallback || username}
            size={size}
            className="h-full w-full"
          />
        </button>
        <span className="max-w-20 truncate text-xs font-medium text-foreground">
          {username}
        </span>
      </div>
    )
  }
)

StoryAvatar.displayName = 'StoryAvatar'

export default StoryAvatar
