'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Image as SanityImage } from 'sanity'
import type { FeaturedProject } from '@/lib/types'
import { urlForImage } from '@/sanity/image'
import sanityImageLoader from '@/lib/sanityImageLoader'

/**
 * The featured-project sections of the About page, matching the original:
 * alternating poster/text rows that fade in as they scroll into view, and a
 * poster click that opens the film's stills as a full-screen gallery.
 */

/** Fades its section in once, the first time it enters the viewport. */
function useRevealOnScroll() {
  const ref = useRef<HTMLElement | null>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setSeen(true)
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  return { ref, seen }
}

type GalleryImage = { source: SanityImage; alt: string }

function ProjectSection({
  project,
  textFirst,
  onOpenGallery,
}: {
  project: FeaturedProject
  textFirst: boolean
  onOpenGallery: (images: GalleryImage[]) => void
}) {
  const { ref, seen } = useRevealOnScroll()

  const gallery: GalleryImage[] = [
    ...(project.poster ? [{ source: project.poster, alt: project.poster.alt ?? project.title }] : []),
    ...(project.stills ?? []).map((s) => ({ source: s, alt: s.alt ?? project.title })),
  ]

  return (
    <section
      ref={ref}
      className={`flex w-full items-start justify-center gap-[60px] px-[25%] pt-[150px] transition-opacity duration-[800ms] ease-out max-lg:px-[10%] max-lg:pt-[10%] max-md:flex-col max-md:gap-[30px] ${
        seen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {project.poster && (
        <button
          type="button"
          onClick={() => onOpenGallery(gallery)}
          aria-label={`View stills from ${project.title}`}
          className={`block w-full max-w-[45vh] shrink-0 cursor-pointer max-lg:max-w-[25vh] max-md:max-w-[30vw] max-[479px]:max-w-full ${
            textFirst ? 'md:order-2' : ''
          }`}
        >
          <Image
            loader={sanityImageLoader}
            src={urlForImage(project.poster).url()}
            alt={project.poster.alt ?? project.title}
            width={1600}
            height={2134}
            sizes="(max-width: 479px) 90vw, (max-width: 991px) 45vw, 40vw"
            className="h-auto w-full"
          />
        </button>
      )}

      <div className="text-left">
        <h2 className="font-body pt-[6px] text-[22px] font-normal text-white max-lg:text-[18px] max-md:text-[14px]">
          {project.title}
        </h2>

        {/* Weight and style follow the original exactly: only the format line
            is bold, the synopsis is normal, the cast is italic, and the
            release line is bold italic. */}
        <div className="font-body text-[14px] leading-[22px] font-normal tracking-[0.5px] text-white max-lg:text-[12px]">
          {project.kind && <p className="font-bold">{project.kind}</p>}
          {project.description && (
            <p className="mt-[22px] whitespace-pre-line">{project.description}</p>
          )}
          {project.starring && (
            <p className="mt-[22px] whitespace-pre-line italic">{project.starring}</p>
          )}
          {project.credits && <p className="mt-[22px] whitespace-pre-line">{project.credits}</p>}
          {project.platform && <p>{project.platform}</p>}
          {project.year && <p className="mt-[22px] font-bold italic">{project.year}</p>}
        </div>

        {project.watchUrl && (
          <a
            href={project.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body mt-[22px] inline-block rounded border border-white p-[10px] text-base text-white no-underline transition-all duration-200 hover:pl-[39px] hover:font-bold hover:text-accent hover:line-through max-lg:text-sm max-md:text-xs"
          >
            &#128065; Watch
          </a>
        )}
      </div>
    </section>
  )
}

export function AboutProjects({ projects }: { projects: FeaturedProject[] }) {
  const [gallery, setGallery] = useState<{ images: GalleryImage[]; index: number } | null>(null)

  const close = useCallback(() => setGallery(null), [])
  const step = useCallback((delta: number) => {
    setGallery((g) =>
      g ? { ...g, index: (g.index + delta + g.images.length) % g.images.length } : g,
    )
  }, [])

  useEffect(() => {
    if (!gallery) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [gallery, close, step])

  const current = gallery?.images[gallery.index]

  return (
    <>
      {projects.map((project, i) => (
        <ProjectSection
          key={project._key}
          project={project}
          // the original alternates: text left, poster left, text left, ...
          textFirst={i % 2 === 0}
          onOpenGallery={(images) => setGallery({ images, index: 0 })}
        />
      ))}

      {gallery && current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Stills"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="font-body absolute top-6 right-8 z-10 text-3xl leading-none text-white/80 transition-colors hover:text-accent"
          >
            &times;
          </button>

          {gallery.images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous still"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                className="font-body absolute left-4 z-10 px-4 py-8 text-3xl text-white/70 transition-colors hover:text-accent"
              >
                &#8249;
              </button>
              <button
                type="button"
                aria-label="Next still"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                className="font-body absolute right-4 z-10 px-4 py-8 text-3xl text-white/70 transition-colors hover:text-accent"
              >
                &#8250;
              </button>
            </>
          )}

          <div className="relative h-[82vh] w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <Image
              key={gallery.index}
              loader={sanityImageLoader}
              src={urlForImage(current.source).url()}
              alt={current.alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
