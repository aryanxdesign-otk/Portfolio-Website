import { defineField, defineType } from "sanity";

/**
 * Playground item — loose work with no detail page. Either an image or a
 * short video, shown in a grid.
 */
export const shot = defineType({
  name: "shot",
  title: "Playground shot",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mediaType",
      title: "Media type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "captionedImage",
      hidden: ({ parent }) => parent?.mediaType !== "image",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === "image" && !value) {
            return "An image is required when media type is Image.";
          }
          return true;
        }),
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => parent?.mediaType !== "video",
      description: "Short muted loop. Keep it under 5MB.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { mediaType?: string } | undefined;
          if (parent?.mediaType === "video" && !value) {
            return "A video is required when media type is Video.";
          }
          return true;
        }),
    }),
    defineField({
      name: "videoPoster",
      title: "Video poster frame",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect ratio",
      type: "string",
      description: "Controls how much space this takes in the grid.",
      options: {
        list: [
          { title: "Square 1:1", value: "1/1" },
          { title: "Landscape 4:3", value: "4/3" },
          { title: "Wide 16:9", value: "16/9" },
          { title: "Portrait 3:4", value: "3/4" },
          { title: "Tall 9:16", value: "9/16" },
        ],
      },
      initialValue: "1/1",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({
      name: "externalLink",
      title: "External link",
      type: "url",
      description: "Optional. Links out to Dribbble, X, a live demo, etc.",
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers first. Falls back to newest first.",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manualOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "date", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      type: "mediaType",
      media: "image.asset",
      poster: "videoPoster.asset",
    },
    prepare: ({ title, date, type, media, poster }) => ({
      title,
      subtitle: [type, date].filter(Boolean).join(" · "),
      media: media ?? poster,
    }),
  },
});
