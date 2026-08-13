import { defineArrayMember, defineField, defineType } from 'sanity'

/** Singleton: the /about page. */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({
      name: 'headshot',
      title: 'Portrait',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({
      name: 'intro',
      title: 'Intro line',
      type: 'text',
      rows: 3,
      description: 'The short summary at the top, next to the portrait.',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      description: 'The longer bio. Each paragraph is its own block.',
      of: [defineArrayMember({ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] })],
    }),
    defineField({
      name: 'clients',
      title: 'Clients',
      type: 'array',
      description: 'One client per entry, e.g. "L\u2019Oreal".',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured projects',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featuredProject',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({
              name: 'kind',
              title: 'Type',
              type: 'string',
              description: 'e.g. "Feature documentary" or "8-part series".',
            }),
            defineField({ name: 'description', type: 'text', rows: 4 }),
            defineField({
              name: 'starring',
              title: 'Starring',
              type: 'text',
              rows: 2,
              description: 'Cast list. Shown in italics.',
            }),
            defineField({
              name: 'credits',
              type: 'text',
              rows: 3,
              description: 'Creators, directors, editor. One per line.',
            }),
            defineField({
              name: 'platform',
              type: 'string',
              description: 'Where it can be watched, e.g. "Shahid (MBC Group)".',
            }),
            defineField({
              name: 'year',
              type: 'string',
              description: 'e.g. "Launched in December 2020" or "Release date: fall 2026".',
            }),
            defineField({
              name: 'poster',
              title: 'Poster image',
              type: 'image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
            }),
            defineField({
              name: 'watchUrl',
              title: 'Watch link',
              type: 'url',
              description: 'Adds a "Watch" button, e.g. the Shahid page.',
            }),
            defineField({
              name: 'stills',
              title: 'Stills',
              type: 'array',
              description: 'Optional gallery of frames from the film.',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: { hotspot: true },
                  fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
                }),
              ],
              options: { layout: 'grid' },
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'kind' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
})
