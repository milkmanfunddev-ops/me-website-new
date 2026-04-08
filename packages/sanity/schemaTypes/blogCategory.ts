import { defineType, defineField } from "sanity";

export const blogCategory = defineType({
  name: "blogCategory",
  title: "Blog Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "A brief description of what this category covers.",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "color",
      description:
        "Brand color for this category, used for badges and accent elements.",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      description:
        'Lucide icon name to display alongside the category (e.g. "apple", "dumbbell", "heart-pulse").',
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
