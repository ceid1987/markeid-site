/** Pulls the numeric ID (and optional privacy hash) out of a Vimeo URL. */
export function parseVimeo(url: string): { id: string; hash?: string } | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:[/?]h=|\/)?([0-9a-f]{10,})?/i)
  if (!m) return null
  return { id: m[1], hash: m[2] }
}

export function vimeoEmbedSrc(url: string): string | null {
  const p = parseVimeo(url)
  if (!p) return null
  const params = new URLSearchParams({
    autoplay: '1',
    title: '0',
    byline: '0',
    portrait: '0',
    // black bars instead of the page showing through if ratios ever mismatch
    transparent: '0',
  })
  if (p.hash) params.set('h', p.hash)
  return `https://player.vimeo.com/video/${p.id}?${params.toString()}`
}
