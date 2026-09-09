'use client'

import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { ButtonHTMLAttributes, ComponentProps } from 'react'
import { cn } from '@/lib/class-names'
import styles from './flow-button.module.css'

type CommonProps = {
  text?: string
  variant?: 'primary' | 'light' | 'outline'
  className?: string
}

export type FlowButtonProps = CommonProps &
  (
    | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> & {
        href?: never
        isLoading?: boolean
        loadingText?: string
      })
    | (Omit<ComponentProps<typeof Link>, 'children' | 'className' | 'href'> & {
        href: string
        isLoading?: never
        loadingText?: never
      })
  )

/** Animated primary action. Renders a real link for navigation, a button for actions. */
export function FlowButton({
  text = 'Continuer',
  variant = 'primary',
  className,
  isLoading = false,
  loadingText = 'Chargement…',
  ...props
}: FlowButtonProps) {
  const content = (
    <>
      <ArrowRight aria-hidden="true" className={cn(styles.arrow, styles.entering)} />
      <span className={styles.label}>
        {isLoading && <Loader2 aria-hidden="true" className={styles.spinner} />}
        {isLoading ? loadingText : text}
      </span>
      <ArrowRight aria-hidden="true" className={cn(styles.arrow, styles.leaving)} />
    </>
  )
  const classes = cn(styles.button, styles[variant], className)

  if (typeof props.href === 'string') {
    return (
      <Link {...props} data-slot="flow-button" className={classes}>
        {content}
      </Link>
    )
  }

  const { disabled, type = 'button', ...buttonProps } = props
  return (
    <button
      {...buttonProps}
      data-slot="flow-button"
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {content}
    </button>
  )
}
