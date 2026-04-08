import { defineType, defineField } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "General" },
          { title: "Nutrition", value: "Nutrition" },
          { title: "App", value: "App" },
          { title: "Billing", value: "Billing" },
          { title: "Training", value: "Training" },
        ],
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "orderRank",
      title: "Order Rank",
      type: "string",
      description:
        "Managed automatically by @sanity/orderable-document-list. Do not edit manually.",
      hidden: true,
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      description: "Toggle off to hide this FAQ from the public site.",
      initialValue: true,
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
      title: "question",
      subtitle: "category",
      isPublished: "isPublished",
    },
    prepare({ title, subtitle, isPublished }) {
      return {
        title: title || "Untitled FAQ",
        subtitle: `${subtitle ?? "Uncategorised"}${isPublished === false ? " (hidden)" : ""}`,
      };
    },
  },
});
