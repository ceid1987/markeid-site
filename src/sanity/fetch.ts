import { client } from './client'

/**
 * Tagged fetch. The /api/revalidate webhook busts these tags on publish,
 * so edits appear without a redeploy.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: Record<string, unknown>
  tags: string[]
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { tags, revalidate: 3600 },
  })
}
