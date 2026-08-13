import { groq } from 'next-sanity'

/** Films in the order Mark set by dragging in the Studio. */
export const worksQuery = groq`
  *[_type == "work"] | order(orderRank) {
    _id,
    title,
    description,
    vimeoUrl,
    thumbnail,
    "hoverVideoUrl": hoverVideo.asset->url
  }
`

export const aboutQuery = groq`
  *[_type == "aboutPage"][0] {
    headshot,
    intro,
    bio,
    clients,
    featuredProjects
  }
`

export const settingsQuery = groq`
  *[_type == "siteSettings"][0] {
    name, tagline, email, vimeoUrl, instagramUrl, seoDescription, ogImage
  }
`
