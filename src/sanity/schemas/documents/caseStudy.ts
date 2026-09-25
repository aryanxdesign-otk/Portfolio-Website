import { defineField, defineType } from "sanity";

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
      name: "project",
      title: "Project",
      type: "string",
      group: "content",
      description:
        "The product or engagement name, e.g. \u201cFireplace Pro\u201d. Shown in the " +
        "meta row and as the title on the work grid \u2014 the case study title " +
        "itself is the longer statement above.",
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
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 6,
      group: "content",
      description:
        "The opening paragraph, shown under the hero image. Sets up the " +
        "problem and what the work is. Longer than the summary, which is " +
        "only for the grid card.",
    }),
    defineField({
      name: "scopeOfWork",
      title: "Scope of work",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Rendered as pills under the intro, e.g. Product Design, Web " +
        "Design, Visual Design, UX Flows.",
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
      name: "date",
      title: "Date",
      type: "date",
      group: "meta",
      description: "Shown in the meta row on the case study page.",
      options: { dateFormat: "MMMM YYYY" },
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      group: "meta",
      description: "Shown as a tag on the grid. Defaults to the date's year.",
      validation: (rule) => rule.min(2000).max(2100).integer(),
    }),
    defineField({
      name: "projectType",
      title: "Type of project",
      type: "string",
      group: "meta",
      description:
        "One short label for the grid, e.g. \u201cTrading terminal\u201d.",
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
      group: "meta",
      description: "e.g. “3 months”, “Ongoing”",
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
