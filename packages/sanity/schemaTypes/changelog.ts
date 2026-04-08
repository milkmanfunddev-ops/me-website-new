import { defineType, defineField } from "sanity";

export const changelog = defineType({
  name: "changelog",
  title: "Changelog",
  type: "document",
  fields: [
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: 'Semantic version number (e.g. "2.4.0").',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        'Human-readable release name (e.g. "Hydration Overhaul").',
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      options: {
        list: [
          { title: "Latest", value: "Latest" },
          { title: "Major Update", value: "Major Update" },
          { title: "Bug Fix", value: "Bug Fix" },
          { title: "New Feature", value: "New Feature" },
        ],
        layout: "dropdown",
      },
    }),
    defineField({
      name: "whatsNew",
      title: "What's New",
      type: "array",
      of: [{ type: "block" }],
      description: "Highlight the headline features of this release.",
    }),
    defineField({
      name: "improvements",
      title: "Improvements",
      type: "array",
      of: [{ type: "block" }],
      description: "Enhancements and quality-of-life improvements.",
    }),
    defineField({
      name: "bugFixes",
      title: "Bug Fixes",
      type: "array",
      of: [{ type: "block" }],
      description: "Bugs squashed in this release.",
    }),
  ],
  orderings: [
    {
      title: "Version, Newest First",
      name: "versionDesc",
      by: [{ field: "version", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      version: "version",
      title: "title",
      label: "label",
      releaseDate: "releaseDate",
    },
    prepare({ version, title, label, releaseDate }) {
      const subtitle = [title, label, releaseDate]
        .filter(Boolean)
        .join(" — ");
      return {
        title: version ? `v${version}` : "Unreleased",
        subtitle: subtitle || undefined,
      };
    },
  },
});
