import { defineField, defineType } from 'sanity'

export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  fields: [
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company URL',
      type: 'url',
      description: 'Optional link to the company website',
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'dateDisplayType',
      title: 'Date Display',
      type: 'string',
      options: {
        list: [
          { title: 'Range (e.g. 2020–2024)', value: 'range' },
          { title: 'Single year/date', value: 'single' },
        ],
        layout: 'radio',
      },
      initialValue: 'range',
      description:
        'Range shows start–end dates. Single shows only one date (use Start Date).',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
      hidden: ({ parent }) => parent?.dateDisplayType === 'single',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
      description: 'Leave blank if this is your current position',
      hidden: ({ parent }) => parent?.dateDisplayType === 'single',
    }),
    defineField({
      name: 'singleDate',
      title: 'Date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM',
      },
      description: 'The single year or date to display',
      hidden: ({ parent }) => parent?.dateDisplayType !== 'single',
    }),
  ],
  preview: {
    select: {
      title: 'jobTitle',
      subtitle: 'company',
      media: 'logo',
    },
  },
})
