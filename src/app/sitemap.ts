import type { MetadataRoute } from 'next'

const BASE = 'https://markeid.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: BASE, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
