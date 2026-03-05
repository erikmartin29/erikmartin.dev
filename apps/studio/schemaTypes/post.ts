import { defineField, defineType, defineArrayMember } from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'code',
          title: 'Code Snippet',
          fields: [
            defineField({
              name: 'language',
              title: 'Language',
              type: 'string',
            }),
            defineField({
              name: 'filename',
              title: 'Filename',
              type: 'string',
            }),
            defineField({
              name: 'code',
              title: 'Code',
              type: 'text',
            }),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'customComponent',
          title: 'Custom Component',
          fields: [
            defineField({
              name: 'componentName',
              title: 'Component Name',
              type: 'string',
            }),
            defineField({
              name: 'props',
              title: 'Props (JSON)',
              type: 'text',
            }),
          ],
        }),
      ],
    }),
  ],
})

