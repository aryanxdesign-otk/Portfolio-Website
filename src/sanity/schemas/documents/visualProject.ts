import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A visual or brand piece — a curation of images and video with a short piece
 * of writing, rather than a long-form article.
 */
export const visualProject = defineType({
  name: "visualProject",
  title: "Visual & brand",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "gallery", title: "Gallery" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      description: "The URL: /visual/your-slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "One line, shown under the title on the grid.",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "client",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "date",
      type: "date",
      group: "content",
      options: { dateFormat: "MMMM YYYY" },
    }),
    defineField({
      name: "projectType",
      title: "Type of project",
      type: "string",
      group: "content",
      description: "One short label for the grid, e.g. “Identity”.",
    }),
    defineField({
      name: "tags",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "writing",
      title: "Writing",
      type: "simpleRichText",
      group: "content",
      description: "A few lines about the work. Shown above the gallery.",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "captionedImage",
      group: "content",
      description: "Used on the grid. Set the hotspot so crops stay sensible.",
    }),

    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "gallery",
      description:
        "Images and video, in order. Width controls how each one sits on " +
        "the page.",
      of: [
        defineArrayMember({
          type: "object",
          name: "galleryImage",
          title: "Image",
          fields: [
            defineField({
              name: "image",
              type: "captionedImage",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "width",
              type: "string",
              options: {
                list: [
                  { title: "Full width", value: "full" },
                  { title: "Half — pairs up with the next", value: "half" },
                  { title: "Bleed — edge to edge", value: "bleed" },
                ],
                layout: "radio",
              },
              initialValue: "full",
            }),
          ],
          preview: {
            select: {
              media: "image.asset",
              title: "image.alt",
              subtitle: "width",
            },
            prepare: ({ media, title, subtitle }) => ({
              media,
              title: title || "Image",
              subtitle: `Image · ${subtitle ?? "full"}`,
            }),
          },
        }),
        defineArrayMember({ type: "videoBlock", title: "Video" }),
      ],
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "summary", media: "coverImage.asset" },
  },
});
