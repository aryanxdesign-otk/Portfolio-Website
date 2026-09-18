import { defineField, defineType } from "sanity";

/**
 * Explicit vertical breathing room. The renderer sets sensible rhythm on its
 * own; this exists for the moments where a section needs to land differently.
 */
export const spacer = defineType({
  name: "spacer",
  title: "Spacer",
  type: "object",
  fields: [
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "sm" },
          { title: "Medium", value: "md" },
          { title: "Large", value: "lg" },
        ],
        layout: "radio",
      },
      initialValue: "md",
    }),
    defineField({
      name: "rule",
      title: "Show a dividing line",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { size: "size", rule: "rule" },
    prepare: ({ size, rule }) => ({
      title: "Spacer",
      subtitle: `${size ?? "md"}${rule ? " · with rule" : ""}`,
    }),
  },
});
