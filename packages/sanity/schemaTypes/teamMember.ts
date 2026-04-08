import { defineType, defineField, defineArrayMember } from "sanity";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
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
      name: "role",
      title: "Role",
      type: "string",
      description: 'Job title or role (e.g. "Co-Founder & CTO").',
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "blockContent",
      description: "Rich-text biography.",
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
              description: 'e.g. "Twitter", "LinkedIn", "GitHub".',
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
    defineField({
      name: "orderRank",
      title: "Order Rank",
      type: "string",
      description:
        "Managed automatically by @sanity/orderable-document-list. Do not edit manually.",
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Manual Order",
      name: "orderRankAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "image",
    },
  },
});
