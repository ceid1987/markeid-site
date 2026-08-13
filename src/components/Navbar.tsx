'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Settings } from '@/lib/types'

/**
 * Three-column masthead: FILMS, the name, ABOUT. Each sits centred in its own
 * column and aligned to the top of the row.
 *
 * The name sits at the top of the document and scrolls away with the page.
 * FILMS and ABOUT stay visible the whole time, so they live in a fixed
 * overlay that mirrors the header's geometry: same grid, same columns, and an
 * invisible copy of the name in the middle column to hold the row at the same
 * height. That keeps them at exactly the position they start in, vertically
 * centred against the name.
 */
export function Navbar({ settings }: { settings: Settings | null }) {
  const pathname = usePathname()
  const onAbout = pathname === '/about'

  const label =
    'font-body text-2xl text-fg transition-all duration-250 hover:text-accent hover:line-through max-md:text-xs'

  const name = settings?.name ?? 'MARK\u00A0EID'
  const tagline = settings?.tagline ?? 'director | editor'

  const title = (
    <span className="block text-center">
      <span className="font-display block text-[64px] leading-none tracking-[8px] transition-colors duration-240 group-hover:text-accent max-md:text-[32px] max-md:tracking-[4px] max-[479px]:text-[18px] max-[479px]:tracking-[2px]">
        {name}
      </span>
      <span className="font-body block text-base leading-none tracking-[15.5px] max-md:text-[10px] max-md:tracking-[6px] max-[479px]:text-[8px] max-[479px]:tracking-[3px]">
        {tagline}
      </span>
    </span>
  )

  const mastHeight = 'h-[20vh] max-[479px]:h-[15vh] max-[479px]:pt-[15px]'

  return (
    <>
      {/* in flow: the name, which scrolls away */}
      <header className={`flex items-center justify-center ${mastHeight}`}>
        <div className="grid w-full grid-cols-3 items-center justify-items-center">
          <div />
          <Link href="/about" className="group text-fg">
            {title}
          </Link>
          <div />
        </div>
      </header>

      {/* pinned: FILMS and ABOUT, always visible */}
      <div
        className={`pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-center ${mastHeight}`}
      >
        <div className="grid w-full grid-cols-3 items-center justify-items-center">
          <Link href="/" className="pointer-events-auto justify-self-start pl-[20%]">
            <span className={`${label} ${!onAbout ? 'line-through' : ''}`}>FILMS</span>
          </Link>

          {/* holds the row at the name's height so the links keep their position */}
          <div aria-hidden className="invisible">
            {title}
          </div>

          <Link href="/about" className="pointer-events-auto justify-self-end pr-[20%]">
            <span className={`${label} ${onAbout ? 'line-through' : ''}`}>ABOUT</span>
          </Link>
        </div>
      </div>
    </>
  )
}
