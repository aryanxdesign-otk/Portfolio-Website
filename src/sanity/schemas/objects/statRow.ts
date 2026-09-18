import { defineField, defineType } from "sanity";

/** The outcomes strip — "+40% activation", "3 weeks to ship". */
export const statRow = defineType({
  name: "statRow",
  title: "Stat row",
  type: "object",
  fields: [
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      validation: (rule) => rule.required().min(2).max(4),
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              description: "e.g. “+40%”, “3 weeks”, “1.2M”",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g. “increase in activation”",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { stats: "stats" },
    prepare: ({ stats }) => ({
      title: "Stat row",
      subtitle: (stats ?? [])
        .map((s: { value?: string }) => s?.value)
        .filter(Boolean)
        .join("  ·  "),
    }),
  },
});
