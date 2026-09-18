import { defineField, defineType } from "sanity";

/** Singleton — there is exactly one About page. */
export const about = defineType({
  name: "about",
  title: "About page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "skills", title: "Skills & tools" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "content",
      description: "The large opening line on the About page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "simpleRichText",
      group: "content",
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "captionedImage",
      group: "content",
    }),
    defineField({
      name: "skills",
      title: "Skills",
      type: "array",
      group: "skills",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. Product design, Design systems, User research",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      group: "skills",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. Figma, Framer, After Effects",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "headline", media: "portrait.asset" },
    prepare: ({ title, media }) => ({
      title: "About page",
      subtitle: title,
      media,
    }),
  },
});
