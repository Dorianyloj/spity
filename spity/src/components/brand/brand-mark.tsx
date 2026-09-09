import Image from 'next/image'
import { brandAssets } from '@/lib/brand-assets'
import { cn } from '@/lib/class-names'

type BrandMarkProps = {
  className?: string
  imageClassName?: string
  priority?: boolean
  size?: number
  tone?: 'dark' | 'light'
}

export default function BrandMark({
  className = '',
  imageClassName = '',
  priority = false,
  size = 40,
  tone = 'dark',
}: BrandMarkProps) {
  const imageSize = Math.round(size * 8 / 3)

  return (
    <span
      className={cn('relative block shrink-0 overflow-hidden', className)}
      style={{ height: size, width: size * 2 }}
    >
      <Image
        src={brandAssets.logoTransparent}
        alt=""
        width={imageSize}
        height={imageSize}
        className={cn('absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2', tone === 'dark' && 'brightness-0 invert', imageClassName)}
        priority={priority}
      />
    </span>
  )
}
