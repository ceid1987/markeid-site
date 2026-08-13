import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN for published reads; drafts bypass it via the token below.
  useCdn: true,
  perspective: 'published',
})
