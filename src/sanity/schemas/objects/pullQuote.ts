import { defineField, defineType } from "sanity";

/** Large-type quote used to break up a long case study. */
export const pullQuote = defineType({
  name: "pullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Optional. e.g. “Head of Product, Acme”",
    }),
  ],
  preview: {
    select: { title: "quote", subtitle: "attribution" },
    prepare: ({ title, subtitle }) => ({
      title: title ? `“${title}”` : "Pull quote",
      subtitle: subtitle ? `— ${subtitle}` : "Pull quote",
    }),
  },
});
