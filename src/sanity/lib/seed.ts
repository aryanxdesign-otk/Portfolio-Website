/**
 * Seed content — Aryan's real copy, transcribed from the Framer site.
 *
 * This is what renders before a Sanity project exists. `sanityFetch` uses
 * these as its `fallback` values, so the site is never a page of empty
 * states: it shows the real thing, and silently switches to live CMS data
 * the moment NEXT_PUBLIC_SANITY_PROJECT_ID is set.
 *
 * It doubles as the content to paste into the Studio on first run.
 *
 * Images are deliberately null throughout. Every component that takes one
 * falls back to a proportioned placeholder, so the layout is correct before
 * a single asset has been uploaded.
 */

/**
 * Builds one Portable Text paragraph from alternating [normal, bold, normal…]
 * runs.
 *
 * The intro paragraph and the bio both alternate weight mid-sentence, which
 * is the page's other typographic device after the two-tone headings. Writing
 * that out as raw Portable Text by hand is unreadable and easy to get wrong,
 * so runs are declared as tuples instead.
 */
function paragraph(
  key: string,
  runs: readonly (readonly [text: string, bold?: boolean])[],
) {
  return {
    _type: "block" as const,
    _key: key,
    style: "normal" as const,
    listItem: undefined,
    level: undefined,
    markDefs: [],
    children: runs.map(([text, bold], index) => ({
      _type: "span" as const,
      _key: `${key}-${index}`,
      text,
      marks: bold ? ["strong"] : [],
    })),
  };
}

export const seedSiteSettings = {
  name: "Aryan Chillal",
  tagline: "Senior Product Designer",
  availabilityStatus: "available" as const,
  availabilityNote: "Available for Q3'26",
  email: "aryanxdesign@gmail.com",
  socials: [
    {
      platform: "x",
      label: "X",
      url: "https://x.com/aryanxdesign",
      followerCount: 1214,
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/in/aryanchillal",
      followerCount: null,
    },
    {
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com/aryanxdesign",
      followerCount: null,
    },
  ],
  cvUrl: null,
  // Placeholder — swap for the real scheduling link.
  bookingUrl: null,
  bookingLabel: "Book Now",
  navLinks: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerNote: null,
  defaultSeo: null,
};

export const seedHomePage = {
  heroHeading: {
    lead: "Creating software",
    rest: "with care and intention.",
  },
  heroSubline: [
    paragraph("hero-intro", [
      ["I'm a Product Designer, with 5+ years of experience ", true],
      [
        "in this industry I've collaborated with over 12 companies and built " +
          "successful products. My most recent company ",
      ],
      ["Brahma.Fi got acquired by Polymarket.", true],
    ]),
  ],
  heroPrimaryCta: { label: "Get in touch", href: "/contact" },
  heroVideoUrl: null,

  clients: [
    { name: "Brahma", url: null, logo: null },
    { name: "Hexon Global", url: null, logo: null },
    { name: "induced", url: null, logo: null },
    { name: "Itheum", url: null, logo: null },
    { name: "Komet", url: null, logo: null },
    { name: "Polygon", url: null, logo: null },
    { name: "Fireplace", url: null, logo: null },
    { name: "Biconomy", url: null, logo: null },
  ],
  clientsLabel: "Trusted by",

  workSectionHeading: "Latest Projects",
  workAllLabel: "All projects",

  toolsHeading: {
    lead: "Tools & tech that",
    rest: "supercharges my workflow.",
  },
  toolsNote: "The tech stack that never let me down...",
  // Eight of the eleven chips on the live site. The remaining three were not
  // legible in the reference screenshots — add them in the Studio.
  tools: [
    { name: "Figma", url: "https://figma.com", icon: null },
    { name: "Framer", url: "https://framer.com", icon: null },
    { name: "Claude", url: "https://claude.ai", icon: null },
    { name: "ChatGPT", url: "https://chatgpt.com", icon: null },
    { name: "Notion", url: "https://notion.so", icon: null },
    { name: "Webflow", url: "https://webflow.com", icon: null },
    { name: "Spline", url: "https://spline.design", icon: null },
    { name: "v0", url: "https://v0.dev", icon: null },
  ],

  aboutHeading: {
    lead: "Designing novel experiences",
    rest: "that feel delightful & solve real problems.",
  },

  ctaHeading: {
    lead: "Lets craft",
    rest: "incredible work together.",
  },
  footerWordmark: "DESIGN",

  seo: null,
  featured: [],
};

export const seedCaseStudies = [
  {
    _id: "seed-fireplace-pro",
    title: "Fireplace Pro",
    slug: "fireplace-pro",
    summary: "A professional trading terminal for prediction markets.",
    client: "Fireplace",
    roles: ["Pro Trading Terminal", "Prediction Markets"],
    year: 2026,
    accentColor: null,
    featured: true,
    order: 1,
    coverImage: null,
    thumbnailVideoUrl: null,
  },
  {
    _id: "seed-swype",
    title: "Swype Mobile App",
    slug: "swype-mobile-app",
    summary: "Instant multi-currency transfers, designed end to end.",
    client: "Swype",
    roles: ["Product Design", "Prototyping"],
    year: 2026,
    accentColor: null,
    featured: true,
    order: 2,
    coverImage: null,
    thumbnailVideoUrl: null,
  },
  {
    _id: "seed-brahma-fi",
    title: "Brahma.Fi",
    slug: "brahma-fi",
    summary: "Multi-sig wallet with agentic workflows. Acquired by Polymarket.",
    client: "Brahma.Fi",
    roles: ["Multi-Sig Wallet", "Agentic Workflow"],
    year: 2025,
    accentColor: null,
    featured: true,
    order: 3,
    coverImage: null,
    thumbnailVideoUrl: null,
  },
  {
    _id: "seed-obvious",
    title: "Obvious Wallet",
    slug: "obvious-wallet",
    summary: "Security first by design — a mobile wallet people can trust.",
    client: "Obvious",
    roles: ["Product Design", "Mobile Experience"],
    year: 2025,
    accentColor: null,
    featured: true,
    order: 4,
    coverImage: null,
    thumbnailVideoUrl: null,
  },
];

/**
 * Work history.
 *
 * Only the Fireplace row is confirmed from the reference. The rest are
 * placeholders with approximate dates — correct them in the Studio before
 * this goes anywhere public.
 */
export const seedExperiences = [
  {
    _id: "seed-exp-fireplace",
    company: "Fireplace",
    role: "Lead Product Designer",
    startDate: "2026-01-01",
    endDate: null,
    isCurrent: true,
    location: null,
    description: null,
    url: null,
    logo: null,
  },
  {
    _id: "seed-exp-brahma",
    company: "Brahma.Fi",
    role: "Senior Product Designer",
    startDate: "2023-01-01",
    endDate: "2025-12-31",
    isCurrent: false,
    location: null,
    description: null,
    url: null,
    logo: null,
  },
  {
    _id: "seed-exp-obvious",
    company: "Obvious",
    role: "Product Designer",
    startDate: "2021-01-01",
    endDate: "2022-12-31",
    isCurrent: false,
    location: null,
    description: null,
    url: null,
    logo: null,
  },
];

export const seedAbout = {
  headline:
    "Designing novel experiences that feel delightful & solve real problems.",
  bio: [
    paragraph("bio-1", [
      [
        "I'm a Senior Product Designer with a love for craft I've been " +
          "building since 5+ years.",
        true,
      ],
      [
        " What started as a side hustle during college turned into passion " +
          "and led me towards startup economy.",
      ],
    ]),
    paragraph("bio-2", [
      [
        "I have worked with over 12 founders my most recent company got " +
          "acquired by Polymarket",
        true,
      ],
      [" – crafting products 0 → 1 has been one of my key area of expertise."],
    ]),
    paragraph("bio-3", [
      ["Hate towards bad design makes me more obsessed,", true],
      [
        " & I think obsession is what makes good design great. Attention to " +
          "detail helps me build strong relationships with stakeholders, as " +
          "they know I'll put the same care into their project that they would.",
      ],
    ]),
  ],
  skills: ["Senior Product Designer", "Vibe Coder", "Builder"],
  portrait: null,
  signature: null,
  seo: null,
};
