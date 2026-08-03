import type { HTMLAttributes } from 'react'
import { makeDarkPanelBackground } from '@/lib/brand-assets'
import { cn } from '@/lib/class-names'

export interface MediaHeaderProps extends HTMLAttributes<HTMLDivElement> {
  imageUrl: string
}

export default function MediaHeader({ className = 'h-28', imageUrl, style, ...props }: MediaHeaderProps) {
  return (
    <div
      className={cn('overflow-hidden bg-cover bg-center', className)}
      style={{ backgroundImage: makeDarkPanelBackground(imageUrl), ...style }}
      aria-hidden="true"
      {...props}
    />
  )
}
