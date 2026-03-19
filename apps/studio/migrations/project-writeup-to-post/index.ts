import {
  at,
  createIfNotExists,
  defineMigration,
  patch,
  set,
  unset,
} from 'sanity/migrate'

const PROJECT_CATEGORY_ID = 'category-project'

export default defineMigration({
  title: 'Migrate project writeups to blog posts',
  documentTypes: ['project'],
  filter: 'defined(body) && count(body) > 0 && !defined(projectPost)',
  migrate: {
    document(project) {
      const slug = project.slug?.current ?? project._id
      const postId = `post-${slug}`

      const postDoc = {
        _id: postId,
        _type: 'post' as const,
        title: project.title,
        slug: project.slug ? { _type: 'slug' as const, current: project.slug.current } : undefined,
        body: project.body,
        categories: [{ _type: 'reference' as const, _ref: PROJECT_CATEGORY_ID }],
        publishedAt: project._createdAt ?? project._updatedAt ?? new Date().toISOString(),
      }

      return [
        createIfNotExists({
          _id: PROJECT_CATEGORY_ID,
          _type: 'category',
          title: 'Project',
        }),
        createIfNotExists(postDoc),
        patch(project._id, [
          at('projectPost', set({ _type: 'reference', _ref: postId })),
          at('body', unset()),
        ]),
      ]
    },
  },
})
