import { defineField, defineType } from "sanity";

/**
 * Per-document SEO overrides. Every field is optional — the site falls back
 * to the document's own title/summary, then to siteSettings.
 */
export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "string",
      description:
        "Overrides the page title in search results and browser tabs. " +
        "Aim for under 60 characters. Leave blank to use the document title.",
      validation: (rule) =>
        rule.max(70).warning("Longer titles get truncated."),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      description:
        "The snippet shown under the title in search results. " +
        "Around 150 characters reads best.",
      validation: (rule) =>
        rule.max(180).warning("Longer descriptions get truncated."),
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
      description:
        "Shown when the page is shared on social media. 1200x630 is ideal. " +
        "Leave blank to auto-generate one from the page title.",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
