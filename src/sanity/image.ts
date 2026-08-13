import { createImageUrlBuilder } from '@sanity/image-url'
import type { Image } from 'sanity'
import { dataset, projectId } from './env'

const builder = createImageUrlBuilder({ projectId, dataset })

/** Sanity's CDN handles resizing, so we bypass Vercel's image optimization quota. */
export const urlForImage = (source: Image) =>
  builder.image(source).auto('format').fit('max')
