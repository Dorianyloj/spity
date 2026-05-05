import Image from 'next/image'
import { brandAssets } from '@/lib/brand-assets'

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
  const src = tone === 'dark' ? brandAssets.logoWhite : brandAssets.logoTransparent

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg ${className}`}
      style={{ height: size, width: size }}
    >
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={`h-full w-full object-contain ${imageClassName}`}
        priority={priority}
      />
    </span>
  )
}
