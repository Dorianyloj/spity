import { forwardRef, type TextareaHTMLAttributes, useId } from 'react'
import { cn } from '@/lib/class-names'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, label, id, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? `textarea-${generatedId}`
    const errorId = error ? `${textareaId}-error` : undefined

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'spity-input min-h-28 resize-y leading-relaxed',
            error && 'border-destructive ring-2 ring-destructive/20',
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-xs font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
