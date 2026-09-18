import { defineField, defineType } from "sanity";

/**
 * Singleton — the small editable bits that appear across every page.
 * Nav labels, contact details, availability status, default social image.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "contact", title: "Contact" },
    { name: "nav", title: "Navigation" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Your name",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "identity",
      description: "e.g. “Product designer based in Bengaluru”",
    }),
    defineField({
      name: "availabilityStatus",
      title: "Availability",
      type: "string",
      group: "identity",
      options: {
        list: [
          { title: "Available for work", value: "available" },
          { title: "Open to conversations", value: "open" },
          { title: "Not available", value: "unavailable" },
          { title: "Hide the status", value: "hidden" },
        ],
      },
      initialValue: "open",
    }),
    defineField({
      name: "availabilityNote",
      title: "Availability note",
      type: "string",
      group: "identity",
      description: "Optional detail, e.g. “from March 2027”.",
      hidden: ({ parent }) => parent?.availabilityStatus === "hidden",
    }),

    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "cvFile",
      title: "CV / résumé",
      type: "file",
      group: "contact",
      options: { accept: ".pdf" },
      description: "Optional PDF. A download link appears when one is set.",
    }),

    defineField({
      name: "navLinks",
      title: "Navigation links",
      type: "array",
      group: "nav",
      description:
        "Controls the main nav. Drag to reorder. Paths are relative, " +
        "e.g. /work, /about, /playground",
      of: [
        {
          type: "object",
          name: "navLink",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .custom((value) =>
                    typeof value === "string" && value.startsWith("/")
                      ? true
                      : "Must be a relative path starting with /",
                  ),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),
    defineField({
      name: "footerNote",
      title: "Footer note",
      type: "string",
      group: "nav",
      description: "Small print at the bottom of every page.",
    }),

    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
      description:
        "Used on any page that has not set its own. The social share image " +
        "here is the site-wide fallback.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
