import { defineField, defineType } from "sanity";

/**
 * Singleton — the editorial content of the home page.
 *
 * Section headings live here rather than hardcoded in components, so the
 * copy can be tuned without a deploy.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "sections", title: "Sections" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Headline",
      type: "text",
      rows: 2,
      group: "hero",
      description: "The big opening statement.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubline",
      title: "Subline",
      type: "text",
      rows: 2,
      group: "hero",
    }),
    defineField({
      name: "marqueeWords",
      title: "Marquee words",
      type: "array",
      group: "hero",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Optional scrolling word strip. Leave empty to hide the marquee.",
    }),
    defineField({
      name: "featuredCaseStudies",
      title: "Featured work",
      type: "array",
      group: "sections",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
      description:
        "Drag to reorder. This exact order is what visitors see. " +
        "Leave empty to fall back to every case study marked as featured.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "workSectionHeading",
      title: "Work section heading",
      type: "string",
      group: "sections",
      initialValue: "Selected work",
    }),
    defineField({
      name: "playgroundSectionHeading",
      title: "Playground section heading",
      type: "string",
      group: "sections",
      initialValue: "Playground",
    }),
    defineField({
      name: "testimonialsSectionHeading",
      title: "Testimonials section heading",
      type: "string",
      group: "sections",
      initialValue: "Kind words",
    }),
    defineField({
      name: "ctaHeading",
      title: "Closing CTA heading",
      type: "string",
      group: "sections",
      initialValue: "Let's work together",
    }),
    defineField({
      name: "ctaText",
      title: "Closing CTA text",
      type: "text",
      rows: 2,
      group: "sections",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "heroHeadline" },
    prepare: ({ title }) => ({ title: "Home page", subtitle: title }),
  },
});
