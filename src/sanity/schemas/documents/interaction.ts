import { defineField, defineType } from "sanity";

import { INTERACTION_KEYS } from "@/interactions/keys";

/**
 * A coded front-end interaction.
 *
 * The demo itself is a real React component living in src/interactions — a CMS
 * cannot store executable code safely, and a recording of an interaction on a
 * page about interaction craft undersells the work. This document holds the
 * words around it and points at which component to mount.
 */
export const interaction = defineType({
  name: "interaction",
  title: "Interaction",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "code", title: "Code" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description: "The URL: /interactions/your-slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "One line, shown under the title on the grid.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "simpleRichText",
      group: "content",
      description:
        "A few lines on how it works, or why. Shown between the demo and " +
        "the code.",
    }),
    defineField({
      name: "date",
      type: "date",
      group: "content",
      options: { dateFormat: "MMMM YYYY" },
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. spring, gesture, SVG",
    }),

    defineField({
      name: "componentKey",
      title: "Component",
      type: "string",
      group: "code",
      description:
        "Which component in the code renders this demo. Adding a new one " +
        "means adding a folder under src/interactions and deploying.",
      options: {
        list: INTERACTION_KEYS.map((key) => ({ title: key, value: key })),
      },
      // Validated against the real registry, so a stale key is caught here
      // rather than shipping as a blank panel.
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || INTERACTION_KEYS.includes(value as never)
              ? true
              : `No component registered under "${value}".`,
          ),
    }),
    defineField({
      name: "sourceLabel",
      title: "Source file label",
      type: "string",
      group: "code",
      description:
        "Heading above the code block. Defaults to the component's filename.",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "summary" },
  },
});
