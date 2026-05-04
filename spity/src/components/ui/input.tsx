import { forwardRef, InputHTMLAttributes, ReactNode } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
  icon?: ReactNode
  action?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, label, id, icon, action, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
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
            className={`
              spity-input
              ${icon ? 'pl-10' : ''}
              ${action ? 'pr-10' : ''}
              ${error ? 'border-destructive ring-destructive/20' : ''}
              ${className}
            `}
            {...props}
          />
          {action && (
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2">
              {action}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-destructive mt-1.5">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
