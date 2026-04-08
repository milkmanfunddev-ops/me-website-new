import { defineType, defineField } from "sanity";

export const legalDoc = defineType({
  name: "legalDoc",
  title: "Legal Document",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        'e.g. "Privacy Policy", "Terms of Service", "Cookie Policy".',
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
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      description:
        "The date this document was last revised. Displayed prominently on the page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      lastUpdated: "lastUpdated",
    },
    prepare({ title, lastUpdated }) {
      return {
        title: title || "Untitled Legal Document",
        subtitle: lastUpdated
          ? `Last updated: ${lastUpdated}`
          : "No update date set",
      };
    },
  },
});
