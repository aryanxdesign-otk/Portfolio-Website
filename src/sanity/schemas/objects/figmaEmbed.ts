import { defineField, defineType } from "sanity";

/** Live Figma prototype or file embed. */
export const figmaEmbed = defineType({
  name: "figmaEmbed",
  title: "Figma embed",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Figma file or prototype URL",
      type: "url",
      description:
        "Paste the share link. The file's sharing must be set to " +
        "“Anyone with the link can view”, or the embed renders blank.",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .custom((value) =>
            !value || /(^https:\/\/([\w.-]+\.)?figma\.com\/)/.test(value)
              ? true
              : "Must be a figma.com URL",
          ),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Describes the embed for screen readers.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect ratio",
      type: "string",
      options: {
        list: [
          { title: "16:9 — landscape", value: "16/9" },
          { title: "4:3", value: "4/3" },
          { title: "1:1 — square", value: "1/1" },
          { title: "9:16 — mobile prototype", value: "9/16" },
        ],
        layout: "radio",
      },
      initialValue: "16/9",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Figma embed",
      subtitle: `Figma · ${subtitle ?? ""}`,
    }),
  },
});
