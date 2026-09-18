import { defineField, defineType } from "sanity";

/** A single image in a case study body, with a layout width. */
export const imageBlock = defineType({
  name: "imageBlock",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      type: "captionedImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      description:
        "Inset sits within the text column. Full spans the content width. " +
        "Bleed runs edge to edge.",
      options: {
        list: [
          { title: "Inset — within text column", value: "inset" },
          { title: "Full — content width", value: "full" },
          { title: "Bleed — edge to edge", value: "bleed" },
        ],
        layout: "radio",
      },
      initialValue: "full",
    }),
    defineField({
      name: "background",
      title: "Pad with background colour",
      type: "boolean",
      description:
        "Adds padding and a tinted backdrop behind the image. Good for UI " +
        "screenshots that would otherwise sit flush against the page.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { media: "image.asset", title: "image.alt", subtitle: "width" },
    prepare: ({ media, title, subtitle }) => ({
      media,
      title: title || "Image",
      subtitle: `Image · ${subtitle ?? "full"}`,
    }),
  },
});
