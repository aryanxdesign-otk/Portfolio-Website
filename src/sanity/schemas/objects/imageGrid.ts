import { defineField, defineType } from "sanity";

/** Two or three images side by side. */
export const imageGrid = defineType({
  name: "imageGrid",
  title: "Image grid",
  type: "object",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "captionedImage" }],
      validation: (rule) =>
        rule
          .required()
          .min(2)
          .max(3)
          .error(
            "A grid holds 2 or 3 images. Use a single Image block for one.",
          ),
    }),
    defineField({
      name: "gap",
      title: "Gap",
      type: "string",
      options: {
        list: [
          { title: "Tight", value: "tight" },
          { title: "Normal", value: "normal" },
          { title: "None — flush", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
  ],
  preview: {
    select: { images: "images", media: "images.0.asset" },
    prepare: ({ images, media }) => ({
      media,
      title: `Image grid`,
      subtitle: `${images?.length ?? 0} images`,
    }),
  },
});
