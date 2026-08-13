import { WorkGrid } from '@/components/WorkGrid'
import { sanityFetch } from '@/sanity/fetch'
import { worksQuery } from '@/sanity/queries'
import type { Work } from '@/lib/types'

export default async function FilmsPage() {
  const works = await sanityFetch<Work[]>({ query: worksQuery, tags: ['work'] })

  return (
    <main className="w-full">
      <h1 className="sr-only">Films</h1>
      {works.length > 0 ? (
        <WorkGrid works={works} />
      ) : (
        <p className="font-body py-24 text-center text-white/60">
          No films yet.
        </p>
      )}
    </main>
  )
}
