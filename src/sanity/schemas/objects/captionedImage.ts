import { defineField, defineType } from "sanity";

/**
 * Base image with the metadata every image on the site needs.
 * Reused by imageBlock and imageGrid rather than redeclaring the fields.
 *
 * `hotspot: true` is the important part: it lets you set a focal point once,
 * and every crop across the site (wide hero, square card, tall mobile)
 * respects it automatically instead of centre-cropping through someone's face.
 */
export const captionedImage = defineType({
  name: "captionedImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description:
        "Describes the image for screen readers and when images fail to load. " +
        "Describe what it shows, not that it is an image.",
      validation: (rule) =>
        rule
          .required()
          .error("Alt text is required — the site must stay accessible."),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional. Shown below the image.",
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt", subtitle: "caption" },
  },
});
