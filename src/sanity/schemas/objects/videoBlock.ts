import { defineField, defineType } from "sanity";

/**
 * A video in a case study body. Uploaded as a file rather than an image asset.
 *
 * Keep loops short and compressed — they count against the Sanity asset quota
 * and against the visitor's bandwidth. If clips grow past ~10 seconds or you
 * want adaptive bitrate, swap this for sanity-plugin-mux-input; the schema
 * shape stays compatible enough that no content migration is needed.
 */
export const videoBlock = defineType({
  name: "videoBlock",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "Video file",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description: "MP4 or WebM. Aim to keep it under 10MB.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster frame",
      type: "image",
      options: { hotspot: true },
      description:
        "Shown before the video loads. Strongly recommended — without it the " +
        "space sits empty on slow connections.",
    }),
    defineField({
      name: "alt",
      title: "Description",
      type: "string",
      description: "What the video shows, for screen readers.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
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
      name: "autoplay",
      title: "Autoplay on scroll into view",
      type: "boolean",
      description:
        "Autoplaying videos are always muted and looped, and are suppressed " +
        "for visitors who prefer reduced motion.",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "alt", media: "poster.asset" },
    prepare: ({ title, media }) => ({
      media,
      title: title || "Video",
      subtitle: "Video",
    }),
  },
});
