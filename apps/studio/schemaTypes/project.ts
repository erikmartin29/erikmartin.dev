import { defineField, defineType, defineArrayMember } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
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
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short descriptive text shown under the title on the work grid',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'link',
      title: 'Live Link',
      type: 'url',
    }),
    defineField({
      name: 'github',
      title: 'GitHub Repo',
      type: 'url',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'thumbnailVideo',
      title: 'Thumbnail Video (loops, replaces image)',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm',
      },
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
    defineField({
      name: 'order',
      title: 'Sort Order',
      type: 'number',
    }),
  ],
})

