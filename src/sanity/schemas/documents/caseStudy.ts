import { defineField, defineType } from "sanity";

import { CATEGORIES } from "@/sanity/categories";

/**
 * The centerpiece document. Everything else on the site orbits this.
 *
 * Fields are grouped so the editing form stays navigable — a case study has
 * a lot of metadata, and a flat list of twenty fields is miserable to work in.
 */
export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case study",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Details" },
    { name: "presentation", title: "Presentation" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "The URL for this case study: /work/your-slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      group: "content",
      description:
        "Which of the three home page cards this belongs under. Also drives " +
        "the filter on the work page.",
      options: {
        list: CATEGORIES.map((c) => ({ title: c.title, value: c.value })),
        layout: "radio",
      },
      initialValue: "case-studies",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "One or two sentences. Shown on cards in the work index and used as " +
        "the fallback meta description.",
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "caseStudyBody",
      group: "content",
    }),

    // --- Details -----------------------------------------------------------
    defineField({
      name: "client",
      title: "Client",
      type: "string",
      group: "meta",
      description: "Company or product name. Leave blank for personal work.",
    }),
    defineField({
      name: "roles",
      title: "Your role",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. Product design, Design systems, Prototyping",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "meta",
      validation: (rule) => rule.min(2000).max(2100).integer(),
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
      group: "meta",
      description: "e.g. “3 months”, “Ongoing”",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      group: "meta",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "externalUrl",
      title: "Live link",
      type: "url",
      group: "meta",
      description: "Optional link to the shipped product.",
    }),

    // --- Presentation ------------------------------------------------------
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "captionedImage",
      group: "presentation",
      description:
        "Used on cards and as the case study hero. Set the hotspot so crops " +
        "stay sensible at every aspect ratio.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "thumbnailVideo",
      title: "Card hover video",
      type: "file",
      group: "presentation",
      options: { accept: "video/mp4,video/webm" },
      description:
        "Optional short muted loop that plays when someone hovers this " +
        "project's card. Keep it under 3MB.",
    }),
    defineField({
      name: "accentColor",
      title: "Accent colour",
      type: "string",
      group: "presentation",
      description:
        "Hex colour used for accents on this case study's page. " +
        "Leave blank to use the site default.",
      validation: (rule) =>
        rule.regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: "hex colour",
        }),
    }),
    defineField({
      name: "featured",
      title: "Feature on the home page",
      type: "boolean",
      group: "presentation",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      group: "presentation",
      description:
        "Lower numbers appear first. Projects without an order fall back to " +
        "newest first.",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],

  orderings: [
    {
      title: "Manual order",
      name: "manualOrder",
      by: [
        { field: "order", direction: "asc" },
        { field: "year", direction: "desc" },
      ],
    },
    {
      title: "Newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      title: "title",
      client: "client",
      year: "year",
      featured: "featured",
      media: "coverImage.asset",
    },
    prepare: ({ title, client, year, featured, media }) => ({
      title: featured ? `★ ${title}` : title,
      subtitle: [client, year].filter(Boolean).join(" · "),
      media,
    }),
  },
});
