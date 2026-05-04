import { forwardRef, TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, label, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`
            spity-input
            min-h-[100px] resize-y
            ${error ? 'border-destructive ring-destructive/20' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive mt-1.5">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
