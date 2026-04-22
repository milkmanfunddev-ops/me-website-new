import { defineType, defineArrayMember, defineField } from "sanity";

/**
 * blockContent — Shared Portable Text schema aligned with the deployed
 * Mealvana Endurance Sanity dataset.
 *
 * Shape mirrors what the production blogPost.body actually accepts:
 *   - standard block (with link + internalLink annotations, standard
 *     decorators including `highlight`, bullet/number lists, h2/h3/h4
 *     + blockquote styles)
 *   - image (with alt + caption + size variants)
 *   - callout (tone + heading + text)
 *   - videoEmbed (url + caption)
 *   - nutritionFact (heading + value + description + source)
 *   - productRecommendation (product reference + endorsement)
 *
 * Changing or adding types here will only affect newly authored content
 * in the local Studio. Existing content in the deployed dataset continues
 * to work because these types are already present there.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    // ── Standard rich-text block ──────────────────────────────────────────
    defineArrayMember({
      type: "block",
      title: "Block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted list", value: "bullet" },
        { title: "Numbered list", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strikethrough", value: "strike-through" },
          { title: "Code", value: "code" },
          { title: "Highlight", value: "highlight" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.required().uri({
                    scheme: ["http", "https", "mailto", "tel"],
                    allowRelative: false,
                  }),
              },
              {
                name: "openInNewTab",
                type: "boolean",
                title: "Open in new tab",
              },
            ],
          },
          {
            name: "internalLink",
            type: "object",
            title: "Internal Link",
            fields: [
              {
                name: "reference",
                type: "reference",
                title: "Reference",
                to: [{ type: "blogPost" }],
              },
            ],
          },
        ],
      },
    }),

    // ── Image ──────────────────────────────────────────────────────────────
    defineArrayMember({
      type: "image",
      title: "Image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Caption",
        }),
        defineField({
          name: "size",
          type: "string",
          title: "Size",
          options: {
            list: [
              { title: "Small (inline)", value: "small" },
              { title: "Medium", value: "medium" },
              { title: "Full Width", value: "full" },
            ],
            layout: "radio",
          },
        }),
      ],
    }),

    // ── Callout ────────────────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "callout",
      title: "Callout Box",
      fields: [
        defineField({
          name: "tone",
          type: "string",
          title: "Tone",
          options: {
            list: [
              { title: "Tip", value: "tip" },
              { title: "Warning", value: "warning" },
              { title: "Info", value: "info" },
              { title: "Science", value: "science" },
              { title: "Pro Tip", value: "pro-tip" },
            ],
            layout: "radio",
          },
        }),
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
        }),
        defineField({
          name: "text",
          type: "array",
          title: "Content",
          of: [
            {
              type: "block",
              styles: [
                { title: "Normal", value: "normal" },
                { title: "Heading 1", value: "h1" },
                { title: "Heading 2", value: "h2" },
                { title: "Heading 3", value: "h3" },
                { title: "Heading 4", value: "h4" },
                { title: "Heading 5", value: "h5" },
                { title: "Heading 6", value: "h6" },
                { title: "Quote", value: "blockquote" },
              ],
              lists: [
                { title: "Bulleted list", value: "bullet" },
                { title: "Numbered list", value: "number" },
              ],
              marks: {
                decorators: [
                  { title: "Strong", value: "strong" },
                  { title: "Italic", value: "em" },
                  { title: "Code", value: "code" },
                  { title: "Underline", value: "underline" },
                  { title: "Strike", value: "strike-through" },
                ],
                annotations: [
                  {
                    name: "link",
                    type: "object",
                    title: "Link",
                    fields: [
                      {
                        name: "href",
                        type: "url",
                        title: "Link",
                        validation: (rule) =>
                          rule.required().uri({
                            scheme: ["http", "https", "tel", "mailto"],
                            allowRelative: true,
                          }),
                      },
                    ],
                  },
                ],
              },
            },
          ],
        }),
      ],
      preview: {
        select: { tone: "tone", heading: "heading" },
        prepare({ tone, heading }) {
          return {
            title: heading || "Callout",
            subtitle: tone ? `Callout — ${tone}` : "Callout",
          };
        },
      },
    }),

    // ── Video Embed ────────────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "videoEmbed",
      title: "Video Embed",
      fields: [
        defineField({
          name: "url",
          type: "url",
          title: "Video URL",
          validation: (rule) =>
            rule.required().uri({ scheme: ["http", "https"] }),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Caption",
        }),
      ],
      preview: {
        select: { url: "url", caption: "caption" },
        prepare({ url, caption }) {
          return {
            title: caption || "Video Embed",
            subtitle: url,
          };
        },
      },
    }),

    // ── Nutrition Fact Card ────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "nutritionFact",
      title: "Nutrition Fact Card",
      fields: [
        defineField({
          name: "heading",
          type: "string",
          title: "Heading",
        }),
        defineField({
          name: "value",
          type: "string",
          title: "Value",
          description: 'e.g. "6–12 weeks", "60–90 g/hr".',
        }),
        defineField({
          name: "description",
          type: "text",
          title: "Description",
        }),
        defineField({
          name: "source",
          type: "string",
          title: "Source / Citation",
        }),
      ],
      preview: {
        select: { heading: "heading", value: "value" },
        prepare({ heading, value }) {
          return {
            title: heading || "Nutrition Fact",
            subtitle: value,
          };
        },
      },
    }),

    // ── Product Recommendation ─────────────────────────────────────────────
    // Note: `catalogProduct` is a deployed-only type (owned by the Flutter
    // side of the Sanity dataset). Referencing it here is schema-compatible
    // with production.
    defineArrayMember({
      type: "object",
      name: "productRecommendation",
      title: "Product Recommendation",
      fields: [
        defineField({
          name: "product",
          type: "reference",
          title: "Product",
          to: [{ type: "catalogProduct" }],
        }),
        defineField({
          name: "endorsement",
          type: "text",
          title: "Why We Recommend",
        }),
      ],
      preview: {
        select: { endorsement: "endorsement" },
        prepare({ endorsement }) {
          return {
            title: "Product Recommendation",
            subtitle: endorsement?.slice(0, 80),
          };
        },
      },
    }),
  ],
});
