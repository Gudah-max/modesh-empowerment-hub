import { defineField, defineType } from 'sanity';

/**
 * A single "Updates & Opportunities" item.
 *
 * One document type covers all six public categories so there is only one thing
 * to learn in the Studio, and only one query on the website.
 */
export const update = defineType({
  name: 'update',
  title: 'Update',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The headline shown on the card and at the top of the page.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      description: 'Generated from the title. Click "Generate". Avoid changing it after publishing.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Training', value: 'Training' },
          { title: 'Classes', value: 'Classes' },
          { title: 'Events', value: 'Events' },
          { title: 'Announcements', value: 'Announcements' },
          { title: 'Success Stories', value: 'Success Stories' },
          { title: 'Community', value: 'Community' },
        ],
        layout: 'radio',
      },
      initialValue: 'Announcements',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      description:
        'One or two sentences. Shown on the cards and used by Google and WhatsApp previews.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Image description',
          type: 'string',
          description: 'Describe the picture for people using screen readers. Required.',
          validation: (rule) => rule.required().max(160),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Full details',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The main text. You can use headings, bold, lists and links.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
      type: 'datetime',
      description:
        'Set a future date and time to schedule this update — it stays hidden on the website until then.',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event / class date',
      type: 'datetime',
      description: 'Only for events and classes. Leave empty for general announcements.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Modesh Empowerment Hub, Manyatta, Kisumu".',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button text',
      type: 'string',
      description: 'e.g. "Apply Now", "Register", "Chat on WhatsApp". Leave empty to hide the button.',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Button link',
      type: 'url',
      description:
        'Where the button goes. Use a normal https:// link, an application form, or a prefilled WhatsApp link such as https://wa.me/254726844169?text=I%20would%20like%20to%20apply. You can also use mailto: or tel: links.',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: false }),
    }),
    defineField({
      name: 'expiresAt',
      title: 'Hide after',
      type: 'datetime',
      description:
        'Optional. After this date and time the update disappears from the website automatically — useful for application deadlines.',
    }),
    defineField({
      name: 'featured',
      title: 'Feature this update',
      type: 'boolean',
      description: 'Reserved for highlighting an update. Newest updates already appear on the homepage.',
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: 'Publish date, newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: { title: 'title', category: 'category', date: 'publishedAt', media: 'coverImage' },
    prepare({ title, category, date, media }) {
      const when = date ? new Date(date).toLocaleDateString('en-GB') : 'No date';
      return { title, subtitle: `${category ?? 'Uncategorised'} · ${when}`, media };
    },
  },
});
