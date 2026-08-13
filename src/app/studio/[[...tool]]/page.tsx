/**
 * Sanity Studio, served at /studio.
 * Mark logs in here with Google to edit the site.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
