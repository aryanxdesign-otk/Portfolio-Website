import { defineField, defineType } from "sanity";

/** One row in the About page work history timeline. */
export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      options: { dateFormat: "MMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isCurrent",
      title: "Current role",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      options: { dateFormat: "MMM YYYY" },
      hidden: ({ parent }) => Boolean(parent?.isCurrent),
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            { isCurrent?: boolean; startDate?: string } | undefined;
          if (parent?.isCurrent) return true;
          if (!value)
            return "Set an end date, or mark this as your current role.";
          if (parent?.startDate && value < parent.startDate) {
            return "End date cannot be before the start date.";
          }
          return true;
        }),
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "description",
      title: "Description",
      type: "simpleRichText",
      description: "What you did there. A short paragraph reads best.",
    }),
    defineField({
      name: "logo",
      title: "Company logo",
      type: "image",
      description: "Optional. An SVG or transparent PNG works best.",
    }),
    defineField({
      name: "url",
      title: "Company website",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Most recent first",
      name: "startDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      role: "role",
      company: "company",
      start: "startDate",
      end: "endDate",
      current: "isCurrent",
      media: "logo.asset",
    },
    prepare: ({ role, company, start, end, current, media }) => {
      const year = (d?: string) => (d ? d.slice(0, 4) : "");
      return {
        title: `${role} · ${company}`,
        subtitle: `${year(start)} — ${current ? "Present" : year(end)}`,
        media,
      };
    },
  },
});
