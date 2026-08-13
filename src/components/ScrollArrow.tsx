'use client'

import { useEffect, useState } from 'react'

/**
 * Thin arrow pinned to the bottom of the viewport, hinting that the page
 * scrolls. It fades out the first time the visitor scrolls and stays gone for
 * the rest of the session.
 */
export function ScrollArrow() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let settled = false

    const onScroll = () => {
      if (settled || window.scrollY <= 0) return
      settled = true
      setHidden(true)
      window.removeEventListener('scroll', onScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    // Catch a page restored mid-scroll. Deferred to a frame so we are not
    // setting state synchronously while the effect runs.
    const frame = requestAnimationFrame(onScroll)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-[999] flex justify-center pb-[30px] transition-opacity duration-500 ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/arrow.png" alt="" className="w-[3%] max-md:w-[8%] max-[479px]:w-[15%]" />
    </div>
  )
}
