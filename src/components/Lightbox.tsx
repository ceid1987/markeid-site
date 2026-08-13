'use client'

import Player from '@vimeo/player'
import Image from 'next/image'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Work } from '@/lib/types'
import { vimeoEmbedSrc } from '@/lib/vimeo'
import { urlForImage } from '@/sanity/image'
import sanityImageLoader from '@/lib/sanityImageLoader'

/** Used until Vimeo tells us the film's real ratio. */
const FALLBACK_AR = 16 / 9
/** If Vimeo never reports ready, reveal the player anyway. */
const READY_TIMEOUT_MS = 4000
/** How long to wait for the real aspect ratio before giving up. */
const AR_TIMEOUT_MS = 600

/** Film id -> aspect ratio, learned from oEmbed. Module-level so it survives
 *  the lightbox unmounting between opens. */
const arCache = new Map<string, number>()

/**
 * Full-screen player. Opening a film expands it out of its grid tile; the
 * hover loop keeps playing on top until the Vimeo player is actually ready,
 * so the spinner is never the first thing on screen. The box takes the
 * film's true aspect ratio (from Vimeo's oEmbed endpoint), so no bars.
 * Below the player, the other films are a scrollable strip of stills.
 *
 * Escape closes, arrow keys move between films.
 */
export function Lightbox({
  works,
  index,
  originRect,
  onClose,
  onNavigate,
}: {
  works: Work[]
  index: number | null
  originRect: DOMRect | null
  onClose: () => void
  onNavigate: (index: number) => void
}) {
  const open = index !== null
  const work = open ? works[index] : null

  const boxRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const didExpand = useRef(false)

  const [ar, setAr] = useState(FALLBACK_AR)
  const [arKnown, setArKnown] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)

  const workId = work?._id
  const workVimeoUrl = work?.vimeoUrl

  // Reset per-film state the moment the film changes, during render, so the
  // effects below stay purely asynchronous.
  const [prevWorkId, setPrevWorkId] = useState(workId)
  if (workId !== prevWorkId) {
    setPrevWorkId(workId)
    setPlayerReady(false)
    const cached = workId ? arCache.get(workId) : undefined
    setAr(cached ?? FALLBACK_AR)
    setArKnown(Boolean(cached))
  }

  /* ---- keyboard ---- */
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open || index === null) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % works.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + works.length) % works.length)
    },
    [open, index, works.length, onClose, onNavigate],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prev
    }
  }, [open, handleKey])

  /* ---- real aspect ratio via Vimeo oEmbed ---- */
  useEffect(() => {
    if (!workId || !workVimeoUrl || arKnown) return

    const ctrl = new AbortController()
    const giveUp = window.setTimeout(() => setArKnown(true), AR_TIMEOUT_MS)

    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(workVimeoUrl)}`, {
      signal: ctrl.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { width?: number; height?: number } | null) => {
        window.clearTimeout(giveUp)
        if (d?.width && d?.height) {
          const value = d.width / d.height
          arCache.set(workId, value)
          setAr(value)
        }
        setArKnown(true)
      })
      .catch(() => setArKnown(true))

    return () => {
      ctrl.abort()
      window.clearTimeout(giveUp)
    }
  }, [workId, workVimeoUrl, arKnown])

  /* ---- expand out of the clicked tile ---- */
  useLayoutEffect(() => {
    if (!open) {
      didExpand.current = false
      return
    }
    if (didExpand.current || !originRect || !arKnown || !boxRef.current) return
    didExpand.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = boxRef.current.getBoundingClientRect()
    const sx = originRect.width / target.width
    const sy = originRect.height / target.height
    const dx = originRect.left + originRect.width / 2 - (target.left + target.width / 2)
    const dy = originRect.top + originRect.height / 2 - (target.top + target.height / 2)
    boxRef.current.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity: 0.6 },
        { transform: 'translate(0, 0) scale(1, 1)', opacity: 1 },
      ],
      { duration: 400, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' },
    )
  }, [open, originRect, arKnown])

  /* ---- hide the loop once the player is genuinely going ---- */
  useEffect(() => {
    if (!workId || !arKnown || !iframeRef.current) return
    const player = new Player(iframeRef.current)
    const done = () => setPlayerReady(true)
    player.on('loaded', done)
    player.on('play', done)
    const fallback = window.setTimeout(done, READY_TIMEOUT_MS)
    return () => {
      window.clearTimeout(fallback)
      player.off('loaded', done)
      player.off('play', done)
    }
  }, [workId, arKnown])

  if (!open || !work) return null

  const src = vimeoEmbedSrc(work.vimeoUrl)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="font-body absolute top-6 right-8 z-10 text-3xl leading-none text-white/80 transition-colors hover:text-accent"
      >
        &times;
      </button>

      {works.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous film"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index - 1 + works.length) % works.length)
            }}
            className="font-body absolute left-4 z-10 px-4 py-8 text-3xl text-white/70 transition-colors hover:text-accent"
          >
            &#8249;
          </button>
          <button
            type="button"
            aria-label="Next film"
            onClick={(e) => {
              e.stopPropagation()
              onNavigate((index + 1) % works.length)
            }}
            className="font-body absolute right-4 z-10 px-4 py-8 text-3xl text-white/70 transition-colors hover:text-accent"
          >
            &#8250;
          </button>
        </>
      )}

      {/* player, sized to the film's true ratio and capped by the viewport */}
      <div
        ref={boxRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-black"
        style={{
          aspectRatio: `${ar}`,
          width: `min(90vw, calc(72vh * ${ar}))`,
          visibility: arKnown ? 'visible' : 'hidden',
        }}
      >
        {src ? (
          <iframe
            key={work._id}
            ref={iframeRef}
            src={src}
            title={work.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0 bg-black"
          />
        ) : (
          <p className="font-body absolute inset-0 flex items-center justify-center text-white/70">
            This film&rsquo;s video link is not valid.
          </p>
        )}

        {/* the hover loop covers the player until it is ready */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 ${
            playerReady ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {work.hoverVideoUrl ? (
            <video
              src={work.hoverVideoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              loader={sanityImageLoader}
              src={urlForImage(work.thumbnail).url()}
              alt=""
              fill
              sizes="90vw"
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* the other films, as a strip of stills */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="mt-5 flex max-w-[90vw] gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {works.map((other, i) =>
          i === index ? null : (
            <button
              key={other._id}
              type="button"
              onClick={() => onNavigate(i)}
              className="group w-36 shrink-0 text-left"
            >
              <Image
                loader={sanityImageLoader}
                src={urlForImage(other.thumbnail).url()}
                alt=""
                width={320}
                height={180}
                sizes="144px"
                className="aspect-video w-full object-cover opacity-70 transition-opacity duration-200 group-hover:opacity-100"
              />
              <span className="font-body mt-1 block truncate text-xs text-white/70 transition-colors duration-200 group-hover:text-white">
                {other.title}
              </span>
            </button>
          ),
        )}
      </div>
    </div>
  )
}
