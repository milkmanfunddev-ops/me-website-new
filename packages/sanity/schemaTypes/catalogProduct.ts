import { defineType, defineField } from "sanity";

/**
 * catalogProduct — Stub declaration.
 *
 * The full `catalogProduct` schema is owned and authored by the
 * Mealvana Endurance Flutter/nutrition side of the Sanity dataset
 * (see ../mealvana_endurance for the real shape). This local stub
 * exists only so that references from `productRecommendation` (in
 * `blockContent.ts`) can resolve inside the editorial Studio.
 *
 * DO NOT DEPLOY the local Studio schema to production without first
 * reconciling this stub with the Flutter-side authoritative schema —
 * deploying would otherwise overwrite the real type.
 */
export const catalogProduct = defineType({
  name: "catalogProduct",
  title: "Catalog Product (Stub)",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name" },
    prepare({ title }) {
      return {
        title: title ?? "Catalog Product",
        subtitle: "Stub — real schema lives on the Flutter side",
      };
    },
  },
});
