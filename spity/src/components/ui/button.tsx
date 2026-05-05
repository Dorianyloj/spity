import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/class-names'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  loadingText?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    const variantClasses = {
      primary: 'spity-btn--primary',
      secondary: 'spity-btn--secondary',
      ghost: 'spity-btn--ghost',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    }

    const sizeClasses = {
      sm: 'min-h-9 px-3 py-1.5 text-xs',
      md: 'min-h-11 px-4 py-2.5 text-sm',
      lg: 'min-h-12 px-6 py-3 text-base',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'spity-btn focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          variantClasses[variant],
          sizeClasses[size],
          isDisabled && 'cursor-not-allowed opacity-60',
          className
        )}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        type={type}
        {...props}
      >
        {isLoading && <Loader2 className="shrink-0 animate-spin" size={16} aria-hidden="true" />}
        {isLoading && loadingText ? loadingText : children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
