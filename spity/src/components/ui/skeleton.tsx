import { forwardRef, HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text'
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className = '', variant = 'rect', ...props }, ref) => {
    const variantClasses = {
      rect: 'rounded-lg',
      circle: 'rounded-full',
      text: 'rounded h-4',
    }

    return (
      <div
        ref={ref}
        className={`
          spity-skeleton
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
