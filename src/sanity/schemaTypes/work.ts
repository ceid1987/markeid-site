import { defineField, defineType } from 'sanity'
import { orderRankField } from '@sanity/orderable-document-list'

/** One film in the Films grid. */
export const work = defineType({
  name: 'work',
  title: 'Film',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Shown over the thumbnail on hover, e.g. "LOCUS".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Category',
      type: 'string',
      description: 'The small line under the title, e.g. "Documentary".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'vimeoUrl',
      title: 'Vimeo URL',
      type: 'url',
      description: 'Full link, e.g. https://vimeo.com/373708878. Opens in the pop-up player.',
      validation: (r) =>
        r.required().uri({ scheme: ['https'] }).custom((v) =>
          !v || /vimeo\.com\/\d+/.test(v) ? true : 'Must be a vimeo.com link with a video ID',
        ),
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'The still image, always visible. 16:9 works best.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describes the image for screen readers.',
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'hoverVideo',
      title: 'Hover clip',
      type: 'file',
      description:
        'Short silent clip that plays when someone hovers this film. ' +
        'Export MP4 (H.264), around 3-5 seconds, 1280px wide, no audio. ' +
        'Anything close to that is fine.',
      options: { accept: 'video/mp4' },
    }),
    orderRankField({ type: 'work' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'thumbnail' },
  },
})
