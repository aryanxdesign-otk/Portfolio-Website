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
      name: "signature",
      title: "Signature",
      type: "image",
      group: "content",
      description:
        "Optional. A transparent PNG or SVG, signed in black — it closes the " +
        "about block on the home page.",
    }),
    defineField({
      name: "skills",
      title: "Roles",
      type: "array",
      group: "skills",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "The short line under your name, joined with a divider — " +
        "e.g. Senior Product Designer, Vibe Coder, Builder",
    }),
    // Tools live on the home page document, next to the section that renders
    // them, because each one now carries an icon rather than being a bare
    // string. Keeping a second list here would be a second source of truth.
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
