import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ScrollArrow } from '@/components/ScrollArrow'
import { sanityFetch } from '@/sanity/fetch'
import { settingsQuery } from '@/sanity/queries'
import type { Settings } from '@/lib/types'

/**
 * Chrome for the public site only. The Studio sits outside this group so it
 * renders on its own, without the masthead and footer.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await sanityFetch<Settings>({
    query: settingsQuery,
    tags: ['siteSettings'],
  }).catch(() => null)

  return (
    <>
      <Navbar settings={settings} />
      {children}
      <Footer settings={settings} />
      <ScrollArrow />
    </>
  )
}
