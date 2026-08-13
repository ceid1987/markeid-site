import type { SchemaTypeDefinition } from 'sanity'
import { work } from './work'
import { aboutPage } from './aboutPage'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [work, aboutPage, siteSettings],
}
