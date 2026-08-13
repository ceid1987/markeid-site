'use client'

import type { ImageLoaderProps } from 'next/image'

/**
 * Serves images straight from Sanity's CDN, which does the resizing itself.
 * This keeps us off Vercel's image-optimization quota entirely.
 */
export default function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src)
  url.searchParams.set('w', String(width))
  // 90 keeps fine detail in film stills; 80 was visibly softening them.
  url.searchParams.set('q', String(quality ?? 90))
  url.searchParams.set('auto', 'format')
  return url.href
}
