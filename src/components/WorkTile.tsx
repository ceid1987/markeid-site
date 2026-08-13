'use client'

import Image from 'next/image'
import { useCallback, useRef, useState } from 'react'
import type { Work } from '@/lib/types'
import { urlForImage } from '@/sanity/image'
import sanityImageLoader from '@/lib/sanityImageLoader'

/**
 * One film in the grid. The still is always shown; the silent loop fades in
 * over it on hover, along with the title and category.
 *
 * On touch there is no hover, so the title stays visible, a press-and-hold
 * plays the clip, and a tap opens the Vimeo player. Video is preload="none"
 * and only fetched once one of those gestures happens, so simply loading the
 * page costs nothing.
 */
const LONG_PRESS_MS = 350
export function WorkTile({
  work,
  index,
  onOpen,
}: {
  work: Work
  index: number
  onOpen: (index: number, rect: DOMRect) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const pressTimer = useRef<number | null>(null)
  const heldRef = useRef(false)
  const [hovered, setHovered] = useState(false)

  const hasVideo = Boolean(work.hoverVideoUrl)

  const enter = useCallback(() => {
    setHovered(true)
    const v = videoRef.current
    // play() rejects if the browser blocks it; nothing to do but ignore.
    void v?.play().catch(() => {})
  }, [])

  const leave = useCallback(() => {
    setHovered(false)
    const v = videoRef.current
    if (v) {
      v.pause()
      v.currentTime = 0
    }
  }, [])

  const touchStart = useCallback(() => {
    heldRef.current = false
    pressTimer.current = window.setTimeout(() => {
      heldRef.current = true
      enter()
    }, LONG_PRESS_MS)
  }, [enter])

  const touchEnd = useCallback(() => {
    if (pressTimer.current !== null) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
    if (heldRef.current) leave()
  }, [leave])

  return (
    <button
      type="button"
      className="group relative block w-full cursor-pointer touch-manipulation overflow-hidden bg-black select-none [-webkit-touch-callout:none]"
      // pointerType keeps the mouse and touch paths from crossing over
      onPointerEnter={(e) => e.pointerType === 'mouse' && enter()}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') leave()
        else touchEnd()
      }}
      onPointerDown={(e) => e.pointerType !== 'mouse' && touchStart()}
      onPointerUp={(e) => e.pointerType !== 'mouse' && touchEnd()}
      onPointerCancel={(e) => e.pointerType !== 'mouse' && touchEnd()}
      // long-press plays the clip; only a genuine tap should open the player
      onContextMenu={(e) => e.preventDefault()}
      onFocus={enter}
      onBlur={leave}
      onClick={(e) => {
        if (heldRef.current) {
          heldRef.current = false
          return
        }
        onOpen(index, e.currentTarget.getBoundingClientRect())
      }}
      aria-label={`Play ${work.title} — ${work.description}`}
    >
      <Image
        loader={sanityImageLoader}
        src={urlForImage(work.thumbnail).url()}
        alt={work.thumbnail?.alt ?? ''}
        width={720}
        height={405}
        sizes="(max-width: 479px) 100vw, 50vw"
        priority={index < 4}
        className="block h-full w-full object-cover saturate-110"
      />

      {hasVideo && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={urlForImage(work.thumbnail).width(20).blur(20).url()}
          // no transition here on purpose: the clip cuts in
          className={`absolute inset-0 block h-full w-full object-cover saturate-130 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={work.hoverVideoUrl} type="video/mp4" />
        </video>
      )}

      {/* Text overlay: see .work-title-overlay in globals.css */}
      <div
        className={`work-title-overlay pointer-events-none absolute inset-0 flex flex-col items-center justify-center ${
          hovered ? 'is-hovered' : ''
        }`}
      >
        <div className="flex flex-col items-center justify-center">
          <span className="font-body pb-[10px] text-2xl text-white max-md:text-base">
            {work.title}
          </span>
          <span className="font-body text-grid-text max-md:text-xs">{work.description}</span>
        </div>
      </div>
    </button>
  )
}
