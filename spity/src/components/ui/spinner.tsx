import { forwardRef, type HTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/class-names'

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className = '', size = 'md', label, ...props }, ref) => {
    const sizeClasses = {
      sm: 16,
      md: 24,
      lg: 32,
    }

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-2 text-center', className)}
        role="status"
        aria-label={label || 'Chargement'}
        {...props}
      >
        <Loader2
          className="animate-spin text-primary"
          size={sizeClasses[size]}
          aria-hidden="true"
        />
        {label && (
          <p className="text-sm text-muted-foreground">{label}</p>
        )}
      </div>
    )
  }
)

Spinner.displayName = 'Spinner'

export default Spinner
