import { defineField, defineType } from "sanity";

/** One wordmark in the scrolling client strip. */
export const clientLogo = defineType({
  name: "clientLogo",
  title: "Client",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description:
        "The accessible label for the logo, and the fallback shown if no " +
        "image is set.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description:
        "A transparent SVG or PNG. The strip renders it in grey, so a " +
        "single-colour mark works best.",
    }),
    defineField({
      name: "url",
      title: "Website",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "name", media: "logo.asset" },
  },
});
