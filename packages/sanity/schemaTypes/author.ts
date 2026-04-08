import { defineType, defineField, defineArrayMember } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "blockContent",
      description: "A rich-text biography for the author.",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: 'e.g. "Sports Dietitian", "Endurance Coach".',
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) =>
        rule.regex(
          /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
          { name: "email", invert: false }
        ),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          title: "Social Link",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              title: "Platform",
              description: 'e.g. "Twitter", "LinkedIn", "Instagram".',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              title: "URL",
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { platform: "platform", url: "url" },
            prepare({ platform, url }) {
              return {
                title: platform || "Social Link",
                subtitle: url,
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "avatar",
    },
  },
});
