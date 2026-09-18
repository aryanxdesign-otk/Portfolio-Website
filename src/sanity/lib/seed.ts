/**
 * Seed content — Aryan's real copy, lifted from the Figma portfolio file.
 *
 * This is what renders before a Sanity project exists. `sanityFetch` uses
 * these as its `fallback` values, so the site is never a page of empty
 * states: it shows the real thing, and silently switches to live CMS data
 * the moment NEXT_PUBLIC_SANITY_PROJECT_ID is set.
 *
 * It doubles as the content to paste into the Studio on first run.
 */

export const seedSiteSettings = {
  name: "Aryan Chillal",
  tagline: "Senior Product Designer",
  availabilityStatus: "available" as const,
  availabilityNote: "Available for Q3'26",
  email: "aryanxdesign@gmail.com",
  socials: [
    { platform: "x", label: "X", url: "https://x.com/aryanxdesign" },
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/in/aryanchillal",
    },
  ],
  cvUrl: null,
  navLinks: [
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
  ],
  footerNote: null,
  defaultSeo: null,
};

export const seedHomePage = {
  heroHeadline: "Creating software with care and intention.",
  heroSubline:
    "I'm a Product Designer with 5+ years of experience. I've collaborated " +
    "with over 12 companies and built successful products. My most recent " +
    "company, Brahma.Fi, got acquired by Polymarket.",
  marqueeWords: null,
  workSectionHeading: "Projects",
  playgroundSectionHeading: "Lab",
  testimonialsSectionHeading: null,
  ctaHeading: "Lets craft incredible work together.",
  ctaText: null,
  seo: null,
  featured: [],
};

export const seedCaseStudies = [
  {
    _id: "seed-fireplace-pro",
    title: "Fireplace Pro",
    slug: "fireplace-pro",
    summary: "Pro trading terminal.",
    client: "Fireplace",
    roles: ["Product design"],
    year: 2026,
    accentColor: null,
    featured: true,
    order: 1,
    coverImage: null,
    thumbnailVideoUrl: null,
  },
  {
    _id: "seed-brahma-fi",
    title: "Brahma.Fi",
    slug: "brahma-fi",
    summary: "Prediction markets. Acquired by Polymarket.",
    client: "Brahma.Fi",
    roles: ["Product design"],
    year: 2025,
    accentColor: null,
    featured: true,
    order: 2,
    coverImage: null,
    thumbnailVideoUrl: null,
  },
  {
    _id: "seed-obvious",
    title: "Obvious",
    slug: "obvious",
    summary: "Security first by design.",
    client: "Obvious",
    roles: ["Product design"],
    year: 2025,
    accentColor: null,
    featured: true,
    order: 3,
    coverImage: null,
    thumbnailVideoUrl: null,
  },
];

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
];

export const seedAbout = {
  headline:
    "Designing novel experiences that feel delightful and solve real problems.",
  bio: null,
  skills: ["Senior Product Designer", "Vibe Coder", "Builder"],
  tools: [
    "Figma",
    "Framer",
    "Cursor",
    "ChatGPT",
    "Notion",
    "Webflow",
    "Linear",
  ],
  portrait: null,
  seo: null,
};

/**
 * Paragraphs of the long-form bio, kept as plain strings because the real
 * version lives in Sanity as Portable Text. Rendered only in seed mode.
 */
export const seedAboutParagraphs = [
  "I'm a Senior Product Designer with a love for craft. I've been building " +
    "since 5+ years. What started as a side hustle during college turned " +
    "into a passion and led me towards the startup economy.",
  "I have worked with over 12 founders, and my most recent company got " +
    "acquired by Polymarket. Crafting products 0 to 1 has been one of my " +
    "key areas of expertise.",
  "Hate towards bad design makes me more obsessed. I think obsession is " +
    "what makes good design great. Attention to detail helps me build " +
    "strong relationships with stakeholders, as they know I'll put the " +
    "same care into their project that they would.",
];
