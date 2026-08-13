import type { Metadata } from 'next'
import { Libre_Baskerville, IM_Fell_Double_Pica_SC, Vollkorn } from 'next/font/google'
import './globals.css'
import { sanityFetch } from '@/sanity/fetch'
import { settingsQuery } from '@/sanity/queries'
import type { Settings } from '@/lib/types'

/**
 * Self-hosted through next/font. `display: swap` plus preloading avoids
 * layout shift.
 */
const libre = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-libre-baskerville',
  display: 'swap',
})

const imFell = IM_Fell_Double_Pica_SC({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-im-fell',
  display: 'swap',
})

const vollkorn = Vollkorn({
  subsets: ['latin'],
  variable: '--font-vollkorn',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await sanityFetch<Settings>({
    query: settingsQuery,
    tags: ['siteSettings'],
  }).catch(() => null)

  const name = s?.name ?? 'Mark Eid'
  return {
    metadataBase: new URL('https://markeid.com'),
    title: { default: `${name} — director | editor`, template: `%s — ${name}` },
    description:
      s?.seoDescription ??
      'Mark Eid is a Lebanese film director and editor working across documentary and fiction.',
    openGraph: {
      type: 'website',
      siteName: name,
      url: 'https://markeid.com',
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${libre.variable} ${imFell.variable} ${vollkorn.variable}`}>
      <body className="bg-bg text-fg">{children}</body>
    </html>
  )
}
