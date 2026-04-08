import { defineType, defineArrayMember } from "sanity";

/**
 * blockContent — Maximally rich Portable Text schema for Mealvana Endurance CMS.
 *
 * Provides content creators with a comprehensive set of block types, marks,
 * annotations, and inline objects for authoring long-form nutrition / fitness
 * content, scientific citations, interactive elements, and more.
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
        { title: "Heading 1", value: "h1" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Heading 5", value: "h5" },
        { title: "Heading 6", value: "h6" },
        { title: "Block Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted List", value: "bullet" },
        { title: "Numbered List", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strikethrough", value: "strike-through" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          // External link
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
                    allowRelative: true,
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
              {
                name: "blank",
                type: "boolean",
                title: "Open in new tab",
                initialValue: false,
              },
            ],
          },
          // Internal cross-link to a blog post
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
                validation: (rule) => rule.required(),
              },
            ],
          },
          // Footnote (renders as superscript)
          {
            name: "footnote",
            type: "object",
            title: "Footnote",
            fields: [
              {
                name: "text",
                type: "text",
                title: "Footnote Text",
                validation: (rule) => rule.required(),
              },
            ],
          },
          // Highlight with colour
          {
            name: "highlight",
            type: "object",
            title: "Highlight",
            fields: [
              {
                name: "color",
                type: "color",
                title: "Highlight Color",
              },
            ],
          },
        ],
      },
    }),

    // ── Image block ───────────────────────────────────────────────────────
    defineArrayMember({
      type: "image",
      title: "Image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Descriptive text for screen readers and SEO.",
          validation: (rule) => rule.required(),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
        {
          name: "alignment",
          type: "string",
          title: "Alignment",
          options: {
            list: [
              { title: "Left", value: "left" },
              { title: "Center", value: "center" },
              { title: "Right", value: "right" },
              { title: "Full Width", value: "full" },
            ],
            layout: "radio",
          },
          initialValue: "center",
        },
      ],
    }),

    // ── Math Expression ───────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "mathBlock",
      title: "Math Expression",
      fields: [
        {
          name: "expression",
          type: "text",
          title: "LaTeX Expression",
          description: "Enter a valid LaTeX math expression.",
          validation: (rule) => rule.required(),
        },
        {
          name: "displayMode",
          type: "boolean",
          title: "Display Mode",
          description:
            "When enabled the expression renders as a centred block; otherwise it renders inline.",
          initialValue: false,
        },
      ],
      preview: {
        select: { expression: "expression" },
        prepare({ expression }) {
          return {
            title: expression || "Empty math expression",
            subtitle: "Math Expression",
          };
        },
      },
    }),

    // ── Code Block (via @sanity/code-input) ───────────────────────────────
    defineArrayMember({
      type: "object",
      name: "codeBlock",
      title: "Code Block",
      fields: [
        {
          name: "code",
          type: "code",
          title: "Code",
          options: {
            withFilename: true,
          },
        },
      ],
      preview: {
        select: {
          language: "code.language",
          filename: "code.filename",
          code: "code.code",
        },
        prepare({ language, filename, code }) {
          return {
            title: filename || language || "Code Block",
            subtitle: code
              ? `${language ?? "code"} — ${code.substring(0, 60)}...`
              : "Empty",
          };
        },
      },
    }),

    // ── Callout Block ─────────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "calloutBlock",
      title: "Callout",
      fields: [
        {
          name: "type",
          type: "string",
          title: "Callout Type",
          options: {
            list: [
              { title: "Info", value: "info" },
              { title: "Warning", value: "warning" },
              { title: "Tip", value: "tip" },
              { title: "Success", value: "success" },
            ],
            layout: "radio",
          },
          initialValue: "info",
          validation: (rule) => rule.required(),
        },
        {
          name: "title",
          type: "string",
          title: "Title",
          description: "Optional heading for the callout.",
        },
        {
          name: "body",
          type: "array",
          title: "Body",
          of: [{ type: "block" }],
          validation: (rule) => rule.required(),
        },
      ],
      preview: {
        select: { type: "type", title: "title" },
        prepare({ type, title }) {
          const icons: Record<string, string> = {
            info: "ℹ️",
            warning: "⚠️",
            tip: "💡",
            success: "✅",
          };
          return {
            title: title || `${(type ?? "info").charAt(0).toUpperCase()}${(type ?? "info").slice(1)} callout`,
            subtitle: `Callout — ${type ?? "info"}`,
            media: () => icons[type ?? "info"] ?? "ℹ️",
          };
        },
      },
    }),

    // ── Citation / Reference Block ────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "citationBlock",
      title: "Citation",
      fields: [
        {
          name: "text",
          type: "string",
          title: "Citation Text",
          description: "The full title or quoted text of the cited work.",
          validation: (rule) => rule.required(),
        },
        {
          name: "authors",
          type: "string",
          title: "Authors",
          description: 'Author list, e.g. "Smith J, Doe A, et al."',
        },
        {
          name: "journal",
          type: "string",
          title: "Journal / Publication",
        },
        {
          name: "year",
          type: "string",
          title: "Year",
        },
        {
          name: "url",
          type: "url",
          title: "URL",
          validation: (rule) =>
            rule.uri({ scheme: ["http", "https"] }),
        },
        {
          name: "pubmedId",
          type: "string",
          title: "PubMed ID",
          description: "PubMed identifier for the cited article.",
        },
        {
          name: "doi",
          type: "string",
          title: "DOI",
          description: "Digital Object Identifier.",
        },
      ],
      preview: {
        select: { text: "text", authors: "authors", year: "year" },
        prepare({ text, authors, year }) {
          return {
            title: text || "Untitled citation",
            subtitle: [authors, year].filter(Boolean).join(", "),
          };
        },
      },
    }),

    // ── Table Block (via @sanity/table) ───────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "tableBlock",
      title: "Table",
      fields: [
        {
          name: "rows",
          type: "table",
          title: "Table Rows",
        },
        {
          name: "hasHeaderRow",
          type: "boolean",
          title: "First Row Is Header",
          description:
            "Enable to render the first row as a header with distinct styling.",
          initialValue: true,
        },
      ],
      preview: {
        prepare() {
          return { title: "Table" };
        },
      },
    }),

    // ── YouTube Embed ─────────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "youtubeEmbed",
      title: "YouTube Video",
      fields: [
        {
          name: "url",
          type: "url",
          title: "YouTube URL",
          description: "Full YouTube video URL (e.g. https://www.youtube.com/watch?v=...).",
          validation: (rule) =>
            rule
              .required()
              .uri({ scheme: ["http", "https"] }),
        },
      ],
      preview: {
        select: { url: "url" },
        prepare({ url }) {
          return {
            title: url || "YouTube Video",
            subtitle: "YouTube Embed",
          };
        },
      },
    }),

    // ── Tweet Embed ───────────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "tweetEmbed",
      title: "Tweet Embed",
      fields: [
        {
          name: "tweetId",
          type: "string",
          title: "Tweet ID",
          description:
            "The numeric ID of the tweet (found at the end of the tweet URL).",
          validation: (rule) => rule.required(),
        },
      ],
      preview: {
        select: { tweetId: "tweetId" },
        prepare({ tweetId }) {
          return {
            title: tweetId ? `Tweet ${tweetId}` : "Tweet Embed",
            subtitle: "Tweet Embed",
          };
        },
      },
    }),

    // ── Image Gallery ─────────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "imageGallery",
      title: "Image Gallery",
      fields: [
        {
          name: "images",
          type: "array",
          title: "Images",
          of: [
            {
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "alt",
                  type: "string",
                  title: "Alternative Text",
                  validation: (rule) => rule.required(),
                },
                {
                  name: "caption",
                  type: "string",
                  title: "Caption",
                },
              ],
            },
          ],
          validation: (rule) => rule.required().min(1),
        },
        {
          name: "layout",
          type: "string",
          title: "Layout",
          options: {
            list: [
              { title: "Grid", value: "grid" },
              { title: "Carousel", value: "carousel" },
              { title: "Masonry", value: "masonry" },
            ],
            layout: "radio",
          },
          initialValue: "grid",
        },
      ],
      preview: {
        select: { images: "images", layout: "layout" },
        prepare({ images, layout }) {
          const count = images?.length ?? 0;
          return {
            title: `Gallery (${count} image${count === 1 ? "" : "s"})`,
            subtitle: `Layout: ${layout ?? "grid"}`,
          };
        },
      },
    }),

    // ── Accordion Block ───────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "accordionBlock",
      title: "Accordion",
      fields: [
        {
          name: "items",
          type: "array",
          title: "Accordion Items",
          of: [
            {
              type: "object",
              name: "accordionItem",
              title: "Item",
              fields: [
                {
                  name: "title",
                  type: "string",
                  title: "Title",
                  validation: (rule) => rule.required(),
                },
                {
                  name: "content",
                  type: "array",
                  title: "Content",
                  of: [{ type: "block" }],
                  validation: (rule) => rule.required(),
                },
              ],
              preview: {
                select: { title: "title" },
                prepare({ title }) {
                  return { title: title || "Untitled item" };
                },
              },
            },
          ],
          validation: (rule) => rule.required().min(1),
        },
      ],
      preview: {
        select: { items: "items" },
        prepare({ items }) {
          const count = items?.length ?? 0;
          return {
            title: `Accordion (${count} item${count === 1 ? "" : "s"})`,
          };
        },
      },
    }),

    // ── Button Block ──────────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "buttonBlock",
      title: "Button",
      fields: [
        {
          name: "label",
          type: "string",
          title: "Label",
          validation: (rule) => rule.required(),
        },
        {
          name: "href",
          type: "url",
          title: "URL",
          validation: (rule) =>
            rule
              .required()
              .uri({
                allowRelative: true,
                scheme: ["http", "https", "mailto", "tel"],
              }),
        },
        {
          name: "variant",
          type: "string",
          title: "Variant",
          options: {
            list: [
              { title: "Primary", value: "primary" },
              { title: "Secondary", value: "secondary" },
              { title: "Outline", value: "outline" },
            ],
            layout: "radio",
          },
          initialValue: "primary",
        },
      ],
      preview: {
        select: { label: "label", variant: "variant" },
        prepare({ label, variant }) {
          return {
            title: label || "Button",
            subtitle: `Variant: ${variant ?? "primary"}`,
          };
        },
      },
    }),

    // ── Divider Block ─────────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "dividerBlock",
      title: "Divider",
      fields: [
        {
          name: "style",
          type: "string",
          title: "Style",
          options: {
            list: [
              { title: "Line", value: "line" },
              { title: "Dots", value: "dots" },
              { title: "Space", value: "space" },
            ],
            layout: "radio",
          },
          initialValue: "line",
        },
      ],
      preview: {
        select: { style: "style" },
        prepare({ style }) {
          return {
            title: `Divider — ${style ?? "line"}`,
          };
        },
      },
    }),

    // ── Nutrition Fact Block ──────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "nutritionFactBlock",
      title: "Nutrition Fact",
      fields: [
        {
          name: "nutrient",
          type: "string",
          title: "Nutrient",
          description: 'Name of the nutrient (e.g. "Protein", "Vitamin D").',
          validation: (rule) => rule.required(),
        },
        {
          name: "amount",
          type: "string",
          title: "Amount",
          description: 'Numeric amount (e.g. "25").',
          validation: (rule) => rule.required(),
        },
        {
          name: "unit",
          type: "string",
          title: "Unit",
          description: 'Unit of measurement (e.g. "g", "mg", "mcg").',
          validation: (rule) => rule.required(),
        },
        {
          name: "dailyValue",
          type: "string",
          title: "% Daily Value",
          description: "Optional percentage of daily recommended value.",
        },
      ],
      preview: {
        select: {
          nutrient: "nutrient",
          amount: "amount",
          unit: "unit",
          dailyValue: "dailyValue",
        },
        prepare({ nutrient, amount, unit, dailyValue }) {
          const dv = dailyValue ? ` (${dailyValue}% DV)` : "";
          return {
            title: `${nutrient ?? "Nutrient"}: ${amount ?? "—"}${unit ?? ""}${dv}`,
            subtitle: "Nutrition Fact",
          };
        },
      },
    }),

    // ── Comparison Table ──────────────────────────────────────────────────
    defineArrayMember({
      type: "object",
      name: "comparisonTable",
      title: "Comparison Table",
      fields: [
        {
          name: "headers",
          type: "array",
          title: "Column Headers",
          of: [{ type: "string" }],
          validation: (rule) => rule.required().min(2),
        },
        {
          name: "rows",
          type: "array",
          title: "Rows",
          of: [
            {
              type: "object",
              name: "comparisonRow",
              title: "Row",
              fields: [
                {
                  name: "cells",
                  type: "array",
                  title: "Cells",
                  of: [{ type: "string" }],
                  validation: (rule) => rule.required().min(1),
                },
              ],
              preview: {
                select: { cells: "cells" },
                prepare({ cells }) {
                  return {
                    title: cells?.join(" | ") || "Empty row",
                  };
                },
              },
            },
          ],
          validation: (rule) => rule.required().min(1),
        },
      ],
      preview: {
        select: { headers: "headers", rows: "rows" },
        prepare({ headers, rows }) {
          const cols = headers?.length ?? 0;
          const rowCount = rows?.length ?? 0;
          return {
            title: `Comparison Table (${cols} cols x ${rowCount} rows)`,
          };
        },
      },
    }),
  ],
});
