import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'

/**
 * Desk layout: Films is a drag-to-reorder list; the two singletons open
 * straight into their document rather than a list of one.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      orderableDocumentListDeskItem({
        type: 'work',
        title: 'Films',
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title('About page')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
