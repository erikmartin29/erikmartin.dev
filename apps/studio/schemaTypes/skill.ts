import { defineField, defineType } from 'sanity'

export const skillType = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Skill Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logoLight',
      title: 'Logo (Light Mode)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Logo to display in light mode',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo (Dark Mode)',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Logo to display in dark mode',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
      description: 'Optional link to the skill\'s website or documentation',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logoLight',
    },
  },
})

