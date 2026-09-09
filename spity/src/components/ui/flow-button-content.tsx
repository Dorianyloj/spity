import { ArrowRight, Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/class-names'
import styles from './flow-button.module.css'

export default function FlowButtonContent({
  children,
  isLoading = false,
}: {
  children: ReactNode
  isLoading?: boolean
}) {
  return (
    <>
      <ArrowRight aria-hidden="true" className={cn(styles.arrow, styles.entering)} />
      <span className={styles.label}>
        {isLoading && <Loader2 aria-hidden="true" className={styles.spinner} />}
        {children}
      </span>
      <ArrowRight aria-hidden="true" className={cn(styles.arrow, styles.leaving)} />
    </>
  )
}
