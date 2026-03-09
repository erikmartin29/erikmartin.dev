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
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Small (⅓ width)', value: 'small' },
                  { title: 'Medium (⅔ width)', value: 'medium' },
                  { title: 'Large (full width)', value: 'large' },
                ],
                layout: 'radio',
              },
              initialValue: 'large',
            }),
            defineField({
              name: 'alignment',
              title: 'Alignment',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Center', value: 'center' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            }),
          ],
        }),
        defineArrayMember({
          type: 'object',
          name: 'video',
          title: 'Video',
          fields: [
            defineField({
              name: 'asset',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/mp4,video/webm',
              },
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  { title: 'Small (⅓ width)', value: 'small' },
                  { title: 'Medium (⅔ width)', value: 'medium' },
                  { title: 'Large (full width)', value: 'large' },
                ],
                layout: 'radio',
              },
              initialValue: 'large',
            }),
            defineField({
              name: 'alignment',
              title: 'Alignment',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Center', value: 'center' },
                ],
                layout: 'radio',
              },
              initialValue: 'left',
            }),
            defineField({
              name: 'autoplay',
              title: 'Autoplay',
              type: 'boolean',
              initialValue: false,
              description: 'Start playing automatically when in view',
            }),
            defineField({
              name: 'muted',
              title: 'Mute Audio',
              type: 'boolean',
              initialValue: true,
              description: 'Mute audio (required for autoplay in most browsers)',
            }),
          ],
          preview: {
            select: { caption: 'caption' },
            prepare({ caption }) {
              return {
                title: 'Video',
                subtitle: caption ?? 'No caption',
              };
            },
          },
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

