import { defineField, defineType, defineArrayMember } from 'sanity'

export const profileType = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
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
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'resume',
      title: 'Resume PDF',
      type: 'file',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'github', type: 'url', title: 'GitHub URL' }),
        defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn URL' }),
      ],
    }),
  ],
})
