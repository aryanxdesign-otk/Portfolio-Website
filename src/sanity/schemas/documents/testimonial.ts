import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "company", title: "Company", type: "string" }),
    defineField({
      name: "avatar",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "relatedCaseStudy",
      title: "Related case study",
      type: "reference",
      to: [{ type: "caseStudy" }],
      description:
        "Optional. Links this quote to the project it is about, so it can be " +
        "shown on that case study's page.",
    }),
    defineField({
      name: "featured",
      title: "Show on the home page",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "manualOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      name: "authorName",
      role: "role",
      company: "company",
      quote: "quote",
      media: "avatar.asset",
    },
    prepare: ({ name, role, company, quote, media }) => ({
      title: name,
      subtitle:
        [role, company].filter(Boolean).join(", ") || quote?.slice(0, 60),
      media,
    }),
  },
});
