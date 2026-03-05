import { defineMigration, patch, set } from 'sanity/migrate'

export default defineMigration({
  title: 'Add dateDisplayType to experience documents for range/single date support',
  documentTypes: ['experience'],
  filter: '!defined(dateDisplayType)',
  migrate: {
    document(experience) {
      return [
        patch(experience._id, [
          set('dateDisplayType', 'range'),
        ]),
      ]
    },
  },
})
