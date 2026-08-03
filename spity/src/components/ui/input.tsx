import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react'
import { cn } from '@/lib/class-names'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  icon?: ReactNode
  action?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, label, id, icon, action, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? `input-${generatedId}`
    const errorId = error ? `${inputId}-error` : undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'spity-input min-h-11',
              Boolean(icon) && 'pl-10',
              Boolean(action) && 'pr-11',
              error && 'border-destructive ring-2 ring-destructive/20',
              className
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={errorId}
            {...props}
          />
          {action && (
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2">
              {action}
            </span>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
