import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { AboutProjects } from '@/components/AboutProjects'
import { sanityFetch } from '@/sanity/fetch'
import { aboutQuery } from '@/sanity/queries'
import { urlForImage } from '@/sanity/image'
import sanityImageLoader from '@/lib/sanityImageLoader'
import type { About } from '@/lib/types'

export const metadata: Metadata = { title: 'About' }

/**
 * Mirrors the original about page: portrait beside the biography, then the
 * featured projects as alternating rows that fade in on scroll. The intro
 * line and client list exist in the CMS but are not rendered — the original
 * site hides them too.
 */
export default async function AboutPage() {
  const about = await sanityFetch<About>({ query: aboutQuery, tags: ['aboutPage'] })

  if (!about) {
    return (
      <main className="font-body mx-auto max-w-4xl px-6 py-24 text-center text-white/60">
        The about page has not been filled in yet.
      </main>
    )
  }

  return (
    <main className="mt-[75px] flex w-full flex-col items-center overflow-hidden max-lg:mt-0">
      <h1 className="sr-only">About</h1>

      {/* portrait left, biography right */}
      <section className="mb-[7%] flex w-full items-center justify-center max-lg:flex-col max-lg:gap-[30px] max-lg:pt-[5vh]">
        {about.headshot && (
          <div className="ml-[12%] w-full max-w-[40vw] max-lg:ml-0 max-lg:max-w-[50vw] max-[479px]:max-w-[75vw]">
            <Image
              loader={sanityImageLoader}
              src={urlForImage(about.headshot).url()}
              alt={about.headshot.alt ?? ''}
              width={1600}
              height={2000}
              sizes="(max-width: 479px) 90vw, (max-width: 991px) 60vw, 50vw"
              priority
              className="h-auto w-full"
            />
          </div>
        )}

        <div className="flex w-1/2 items-center justify-center max-lg:w-full">
          <div className="font-body mr-[25%] w-[60%] space-y-[25px] pt-[142px] pb-[15px] text-[16px] leading-[25px] text-white max-lg:mr-0 max-lg:w-full max-lg:px-[10%] max-lg:pt-0 max-lg:text-[12px]">
            {about.bio && <PortableText value={about.bio} />}
          </div>
        </div>
      </section>

      <AboutProjects projects={about.featuredProjects ?? []} />
    </main>
  )
}
