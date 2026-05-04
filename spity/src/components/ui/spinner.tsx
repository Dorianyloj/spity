import { forwardRef, HTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

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
        className={`flex flex-col items-center justify-center gap-2 ${className}`}
        role="status"
        aria-label={label || 'Chargement'}
        {...props}
      >
        <Loader2
          className="animate-spin text-primary"
          size={sizeClasses[size]}
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
