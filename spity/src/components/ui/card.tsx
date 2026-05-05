import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/class-names'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'spity-card',
          !hover && '[&:hover]:transform-none [&:hover]:shadow-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1.5 p-5 sm:p-6', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-bold leading-tight sm:text-xl', className)}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

CardTitle.displayName = 'CardTitle'

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm leading-relaxed text-muted-foreground', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)

CardDescription.displayName = 'CardDescription'

export type CardContentProps = HTMLAttributes<HTMLDivElement>

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('p-5 pt-0 sm:p-6 sm:pt-0', className)} {...props}>
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

export type CardFooterProps = HTMLAttributes<HTMLDivElement>

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap items-center gap-2 p-5 pt-0 sm:p-6 sm:pt-0', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
