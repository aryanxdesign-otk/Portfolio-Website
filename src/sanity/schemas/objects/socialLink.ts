import { defineField, defineType } from "sanity";

/** One social/profile link in site settings. */
export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "X / Twitter", value: "x" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Instagram", value: "instagram" },
          { title: "Dribbble", value: "dribbble" },
          { title: "Behance", value: "behance" },
          { title: "Read.cv", value: "readcv" },
          { title: "GitHub", value: "github" },
          { title: "Layers", value: "layers" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Shown as the link text. Defaults to the platform name.",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https", "http"] }),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
