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
    { platform: "x", label: "1,214", url: "https://x.com/aryanxdesign" },
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/in/aryanchillal",
    },
    {
      platform: "instagram",
      label: "Instagram",
      url: "https://instagram.com/aryanxdesign",
    },
  ],
  cvUrl: null,
  bookingUrl: null,
  clients: [
    { name: "Itheum", url: null, logo: null },
    { name: "Komet", url: null, logo: null },
    { name: "Market", url: null, logo: null },
    { name: "Pillow", url: null, logo: null },
    { name: "Polygon", url: null, logo: null },
  ],
  footerWordmark: "DESIGN",
  footerHeadingLead: "Lets craft",
  footerHeadingRest: "incredible work together.",
  navLinks: [
    { label: "Case studies", href: "/case-studies" },
    { label: "Interactions", href: "/interactions" },
    { label: "Visual", href: "/visual" },
    { label: "Writing", href: "/writing" },
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
  testimonialsSectionHeading: "Kind words",
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
    summary: "Pro trading terminal for active traders.",
    date: "2026-02-01",
    projectType: "Trading terminal",
    tags: ["Product design", "Design systems"],
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
    date: "2025-06-01",
    projectType: "Prediction markets",
    tags: ["Product design", "0 to 1"],
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
    date: "2025-01-01",
    projectType: "Security",
    tags: ["Product design"],
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

/** Counts for the home page card badges while running on seed content. */
export const seedInteractions = [
  {
    _id: "seed-magnetic-button",
    title: "Magnetic button",
    slug: "magnetic-button",
    summary: "A button that leans toward the cursor and settles.",
    date: "2026-03-01",
    tags: ["spring", "pointer"],
    componentKey: "magnetic-button",
  },
  {
    _id: "seed-spring-toggle",
    title: "Spring toggle",
    slug: "spring-toggle",
    summary: "A toggle whose knob overshoots slightly before settling.",
    date: "2026-02-10",
    tags: ["spring", "layout"],
    componentKey: "spring-toggle",
  },
  {
    _id: "seed-elastic-tabs",
    title: "Elastic tabs",
    slug: "elastic-tabs",
    summary: "An indicator that travels between tabs instead of cutting.",
    date: "2026-01-20",
    tags: ["layoutId", "spring"],
    componentKey: "elastic-tabs",
  },
];

export const seedVisualProjects = [
  {
    _id: "seed-fireplace-identity",
    title: "Fireplace identity",
    slug: "fireplace-identity",
    summary:
      "Wordmark, type system and product surface for a trading terminal.",
    client: "Fireplace",
    date: "2026-02-01",
    projectType: "Identity",
    tags: ["Brand", "Type"],
    coverImage: null,
  },
  {
    _id: "seed-obvious-brand",
    title: "Obvious",
    slug: "obvious-brand",
    summary: "Security-first visual language for a self-custody wallet.",
    client: "Obvious",
    date: "2025-01-01",
    projectType: "Visual system",
    tags: ["Brand"],
    coverImage: null,
  },
];

export const seedCategoryCounts = {
  caseStudies: 3,
  interactions: 3,
  visual: 2,
};

export const seedPosts = [
  {
    _id: "seed-post-craft",
    title: "Obsession is what makes good design great",
    slug: "obsession-and-craft",
    publishedAt: "2026-03-12",
    excerpt:
      "Attention to detail is not perfectionism. It is the thing that makes stakeholders trust you with the next decision.",
    tags: ["Craft", "Process"],
    coverImage: null,
  },
  {
    _id: "seed-post-zero-to-one",
    title: "Designing 0 to 1, twelve times over",
    slug: "zero-to-one",
    publishedAt: "2026-01-28",
    excerpt:
      "What actually transfers between early-stage products, and what has to be relearned every time.",
    tags: ["Product", "Startups"],
    coverImage: null,
  },
];

export const seedTestimonials = [
  {
    _id: "seed-testimonial-1",
    quote:
      "Aryan shipped a trading terminal that our most demanding users adopted immediately. He asks the questions nobody else in the room is asking.",
    authorName: "Founder",
    role: "CEO",
    company: "Fireplace",
    avatar: null,
  },
  {
    _id: "seed-testimonial-2",
    quote:
      "He took us from a rough idea to a product that got acquired. The craft is obvious, but it is the judgement that made the difference.",
    authorName: "Co-founder",
    role: "Product",
    company: "Brahma.Fi",
    avatar: null,
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
