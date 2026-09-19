import { defineField, defineType } from "sanity";

/**
 * Singleton — the editorial content of the home page.
 *
 * Every heading on this page is a `twoToneHeading`, because the muted-then-
 * solid split is the page's main typographic device and hardcoding either
 * half in a component would put copy back in the codebase.
 */
export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "clients", title: "Clients" },
    { name: "work", title: "Work" },
    { name: "tools", title: "Tools" },
    { name: "about", title: "About block" },
    { name: "cta", title: "Closing" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // --- Hero --------------------------------------------------------------
    defineField({
      name: "heroHeading",
      title: "Headline",
      type: "twoToneHeading",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubline",
      title: "Intro paragraph",
      type: "simpleRichText",
      group: "hero",
      description:
        "Bold the phrases that should land — the weight alternates between " +
        "bold and grey as you read, which is what gives this paragraph its " +
        "rhythm. Everything unbolded is set in grey.",
    }),
    defineField({
      name: "heroPrimaryCta",
      title: "Primary button",
      type: "object",
      group: "hero",
      fields: [
        defineField({
          name: "label",
          type: "string",
          initialValue: "Get in touch",
        }),
        defineField({
          name: "href",
          type: "string",
          description: "A path like /contact, or a mailto: link.",
        }),
      ],
      options: { columns: 2 },
    }),
    defineField({
      name: "heroVideoUrl",
      title: "Showreel link",
      type: "url",
      group: "hero",
      description:
        "Optional. When set, a “Watch Video” button appears next to the " +
        "primary one.",
    }),

    // --- Clients -----------------------------------------------------------
    defineField({
      name: "clients",
      title: "Client logos",
      type: "array",
      group: "clients",
      of: [{ type: "clientLogo" }],
      description:
        "Shown as a scrolling strip under the hero, and again above the " +
        "footer. Drag to reorder.",
    }),
    defineField({
      name: "clientsLabel",
      title: "Label for the second strip",
      type: "string",
      group: "clients",
      initialValue: "Trusted by",
    }),

    // --- Work --------------------------------------------------------------
    defineField({
      name: "workSectionHeading",
      title: "Section heading",
      type: "string",
      group: "work",
      initialValue: "Latest Projects",
    }),
    defineField({
      name: "featuredCaseStudies",
      title: "Featured work",
      type: "array",
      group: "work",
      of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
      description:
        "Drag to reorder. This exact order is what visitors see. " +
        "Leave empty to fall back to every case study marked as featured. " +
        "The grid is built for four — more will still render, but the " +
        "thumbnails that fly in from the hero are the first four.",
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "workAllLabel",
      title: "“See all” link label",
      type: "string",
      group: "work",
      initialValue: "All projects",
    }),

    // --- Tools -------------------------------------------------------------
    defineField({
      name: "toolsHeading",
      title: "Section heading",
      type: "twoToneHeading",
      group: "tools",
    }),
    defineField({
      name: "toolsNote",
      title: "Note",
      type: "string",
      group: "tools",
      description: "The small line above the icons.",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      group: "tools",
      of: [{ type: "toolItem" }],
    }),

    // --- About block -------------------------------------------------------
    defineField({
      name: "aboutHeading",
      title: "Section heading",
      type: "twoToneHeading",
      group: "about",
    }),

    // --- Closing -----------------------------------------------------------
    defineField({
      name: "ctaHeading",
      title: "Closing heading",
      type: "twoToneHeading",
      group: "cta",
      description: "The large line at the top of the footer.",
    }),
    defineField({
      name: "footerWordmark",
      title: "Footer wordmark",
      type: "string",
      group: "cta",
      description:
        "The oversized word that bleeds off the bottom of the page. One " +
        "word reads best.",
      initialValue: "DESIGN",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { lead: "heroHeading.lead", rest: "heroHeading.rest" },
    prepare: ({ lead, rest }) => ({
      title: "Home page",
      subtitle: [lead, rest].filter(Boolean).join(" "),
    }),
  },
});
