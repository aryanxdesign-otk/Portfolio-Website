import { defineField, defineType } from "sanity";

/**
 * The site's signature heading: a muted opening clause followed by a solid
 * one — "Tools & tech that / supercharges my workflow."
 *
 * Two fields rather than one string with a marker character. A marker would
 * be invisible in the Studio preview and impossible to validate; two fields
 * make the split explicit, and an editor who fills in only `lead` still gets
 * a valid single-tone heading rather than a broken one.
 */
export const twoToneHeading = defineType({
  name: "twoToneHeading",
  title: "Heading",
  type: "object",
  options: { columns: 1 },
  fields: [
    defineField({
      name: "lead",
      title: "Opening clause (muted)",
      type: "string",
      description:
        "Set in grey. The setup — e.g. “Tools & tech that”. " +
        "Leave blank for a heading in a single weight.",
    }),
    defineField({
      name: "rest",
      title: "Closing clause (solid)",
      type: "string",
      description:
        "Set in black. The part that lands — e.g. “supercharges my workflow.”",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { lead: "lead", rest: "rest" },
    prepare: ({ lead, rest }) => ({
      title: [lead, rest].filter(Boolean).join(" "),
    }),
  },
});
