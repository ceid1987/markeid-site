import { defineField, defineType } from 'sanity'

/** Singleton: things that appear on every page. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Shown large in the header.',
      initialValue: 'MARK EID',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'The line under the name.',
      initialValue: 'director | editor',
    }),
    defineField({ name: 'email', title: 'Contact email', type: 'string' }),
    defineField({ name: 'vimeoUrl', title: 'Vimeo profile', type: 'url' }),
    defineField({ name: 'instagramUrl', title: 'Instagram profile', type: 'url' }),
    defineField({
      name: 'seoDescription',
      title: 'Search description',
      type: 'text',
      rows: 3,
      description: 'Shown in Google results and link previews.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: 'Used when the site is shared. 1200x630 works best.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
