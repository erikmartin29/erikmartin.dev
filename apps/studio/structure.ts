import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== 'experience',
      ),
      S.documentTypeListItem('experience')
        .title('Experience')
        .child(
          S.documentTypeList('experience')
            .title('Experience')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
    ])
