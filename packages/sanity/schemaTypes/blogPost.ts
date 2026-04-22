import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * blogPost — aligned with the deployed Mealvana Endurance schema.
 *
 * 17 fields grouped into editorial / media / seo / publishing fieldsets.
 * Body reuses the shared `blockContent` type (callout, videoEmbed,
 * nutritionFact, productRecommendation, plus standard blocks and images).
 *
 * Notes vs. previous local shape:
 *   - `heroImage` replaces `featuredImage` (required)
 *   - `readingTimeMinutes` replaces `readTime`
 *   - `tags` is now a predefined list, not a free-form array
 *   - `status` adds `in_review` and `archived` options
 *   - new fields: `subtitle`, `featured`, `relatedPosts`
 *   - SEO title max is 60 (was 70)
 *   - `categories` now requires at least one entry
 */

const TAG_OPTIONS = [
  { title: "Nutrition", value: "nutrition" },
  { title: "Hydration", value: "hydration" },
  { title: "Race Day", value: "race-day" },
  { title: "Recovery", value: "recovery" },
  { title: "Training", value: "training" },
  { title: "Gut Training", value: "gut-training" },
  { title: "Carb Loading", value: "carb-loading" },
  { title: "Running", value: "running" },
  { title: "Cycling", value: "cycling" },
  { title: "Swimming", value: "swimming" },
  { title: "Triathlon", value: "triathlon" },
  { title: "Ultra", value: "ultra" },
  { title: "Marathon", value: "marathon" },
  { title: "Science", value: "science" },
  { title: "Tips", value: "tips" },
  { title: "Product Review", value: "product-review" },
  { title: "Recipe", value: "recipe" },
  { title: "Interview", value: "interview" },
  { title: "News", value: "news" },
] as const;

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  groups: [],
  fieldsets: [
    { name: "editorial", title: "Editorial" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO & Sharing" },
    { name: "publishing", title: "Publishing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      fieldset: "editorial",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      fieldset: "editorial",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      fieldset: "editorial",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      fieldset: "editorial",
      description:
        "Short summary shown in post listings and social previews.",
      validation: (rule) =>
        rule.max(200).warning("Keep under 200 characters"),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      fieldset: "editorial",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      fieldset: "editorial",
      of: [
        defineArrayMember({
          type: "reference",
          title: "Reference to blog category",
          to: [{ type: "blogCategory" }],
        }),
      ],
      validation: (rule) =>
        rule.min(1).error("Add at least one category"),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      fieldset: "editorial",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [...TAG_OPTIONS],
      },
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      fieldset: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (rule) =>
            rule
              .required()
              .warning(
                "Alt text helps with accessibility and SEO",
              ),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Caption",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      fieldset: "seo",
      validation: (rule) =>
        rule.max(60).warning("Keep under 60 characters"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      fieldset: "seo",
      validation: (rule) =>
        rule.max(160).warning("Keep under 160 characters"),
    }),
    defineField({
      name: "ogImage",
      title: "Social Sharing Image",
      type: "image",
      fieldset: "seo",
      options: { hotspot: true },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      fieldset: "publishing",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In Review", value: "in_review" },
          { title: "Published", value: "published" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
      validation: (rule) =>
        rule
          .required()
          .valid(["draft", "in_review", "published", "archived"]),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      fieldset: "publishing",
    }),
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      fieldset: "publishing",
      initialValue: false,
    }),
    defineField({
      name: "readingTimeMinutes",
      title: "Reading Time (minutes)",
      type: "number",
      fieldset: "publishing",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      fieldset: "publishing",
      of: [
        defineArrayMember({
          type: "reference",
          title: "Reference to blog post",
          to: [{ type: "blogPost" }],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
  ],
  orderings: [
    {
      title: "Published Date, Newest First",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      authorName: "author.name",
      media: "heroImage",
      status: "status",
    },
    prepare({ title, authorName, media, status }) {
      const statusLabel =
        status === "published"
          ? ""
          : ` [${(status ?? "draft").toUpperCase()}]`;
      return {
        title: `${title ?? "Untitled"}${statusLabel}`,
        subtitle: authorName ? `by ${authorName}` : undefined,
        media,
      };
    },
  },
});
