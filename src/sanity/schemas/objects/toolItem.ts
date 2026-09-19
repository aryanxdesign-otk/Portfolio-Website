import { defineField, defineType } from "sanity";

/** One icon chip in the tools strip. */
export const toolItem = defineType({
  name: "toolItem",
  title: "Tool",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "Not shown on screen — it is the accessible label for the icon, so " +
        "write it as you would say it: “Figma”, “Claude”.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description:
        "A square monochrome mark, ideally SVG. The chip supplies the white " +
        "background, so the icon itself should be transparent.",
    }),
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      description: "Optional. Makes the chip clickable.",
    }),
  ],
  preview: {
    select: { title: "name", media: "icon.asset" },
  },
});
