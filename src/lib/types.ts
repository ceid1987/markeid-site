import type { Image } from 'sanity'
import type { PortableTextBlock } from 'next-sanity'

export type Work = {
  _id: string
  title: string
  description: string
  vimeoUrl: string
  thumbnail: Image & { alt?: string }
  hoverVideoUrl?: string
}

export type FeaturedProject = {
  _key: string
  title: string
  kind?: string
  description?: string
  starring?: string
  credits?: string
  platform?: string
  year?: string
  poster?: Image & { alt?: string }
  watchUrl?: string
  stills?: (Image & { _key: string; alt?: string })[]
}

export type About = {
  headshot?: Image & { alt?: string }
  intro?: string
  bio?: PortableTextBlock[]
  clients?: string[]
  featuredProjects?: FeaturedProject[]
}

export type Settings = {
  name?: string
  tagline?: string
  email?: string
  vimeoUrl?: string
  instagramUrl?: string
  seoDescription?: string
  ogImage?: Image
}
