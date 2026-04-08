import { defineType, defineField } from "sanity";

export const integrationPartner = defineType({
  name: "integrationPartner",
  title: "Integration Partner",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: 'Name of the integration partner (e.g. "Garmin", "Strava").',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Partner logo, ideally in SVG or high-res PNG format.",
      options: {
        accept: "image/*",
      },
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
      description: "Link to the partner's website or integration page.",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }),
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
      media: "logo",
      url: "url",
    },
    prepare({ title, media, url }) {
      return {
        title: title || "Unnamed Partner",
        subtitle: url,
        media,
      };
    },
  },
});
