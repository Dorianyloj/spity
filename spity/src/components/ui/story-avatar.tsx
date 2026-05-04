import { forwardRef, HTMLAttributes, MouseEventHandler } from 'react'
import Avatar from './avatar'

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
        className={`flex flex-col items-center gap-1 ${className}`}
        {...props}
      >
        <button
          onClick={onClick}
          className={`
            ${seen ? 'spity-story-ring--seen' : 'spity-story-ring'}
            ${sizeClasses[size]}
            transition-transform hover:scale-105 active:scale-95
          `}
        >
          <Avatar
            src={src}
            alt={alt || username}
            fallback={fallback || username}
            size={size}
            className="w-full h-full"
          />
        </button>
        <span className="text-xs text-foreground max-w-[64px] truncate">
          {username}
        </span>
      </div>
    )
  }
)

StoryAvatar.displayName = 'StoryAvatar'

export default StoryAvatar
