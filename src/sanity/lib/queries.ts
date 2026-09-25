import { defineQuery } from "next-sanity";

/**
 * GROQ queries, kept in one file so `sanity typegen` can find them all and
 * generate result types that stay honest against the schema.
 *
 * `defineQuery` is what marks a string for typegen — run `npm run typegen`
 * after changing any query here or any field in the schema.
 */

// Reusable projections ------------------------------------------------------

/** Everything the SanityImage component needs, including the LQIP blur. */
const IMAGE_FIELDS = /* groq */ `
  ...,
  asset->{
    _id,
    url,
    metadata { lqip, dimensions { width, height, aspectRatio } }
  }
`;

const SEO_FIELDS = /* groq */ `
  title,
  description,
  noIndex,
  ogImage { ${IMAGE_FIELDS} }
`;

/** The fields a case study card needs — deliberately not the whole body. */
const CASE_STUDY_CARD = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  summary,
  project,
  client,
  date,
  year,
  projectType,
  accentColor,
  featured,
  order,
  coverImage { ${IMAGE_FIELDS} },
  "thumbnailVideoUrl": thumbnailVideo.asset->url
`;

// Site-wide -----------------------------------------------------------------

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    name,
    tagline,
    availabilityStatus,
    availabilityNote,
    email,
    socials[] { platform, label, url },
    "cvUrl": cvFile.asset->url,
    bookingUrl,
    clients[] { name, url, logo { ${IMAGE_FIELDS} } },
    footerWordmark,
    footerHeadingLead,
    footerHeadingRest,
    navLinks[] { label, href },
    footerNote,
    defaultSeo { ${SEO_FIELDS} }
  }
`);

// Home ----------------------------------------------------------------------

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0] {
    heroHeadline,
    heroSubline,
    marqueeWords,
    workSectionHeading,
    playgroundSectionHeading,
    testimonialsSectionHeading,
    ctaHeading,
    ctaText,
    seo { ${SEO_FIELDS} },
    // Explicit order if set, otherwise everything flagged as featured.
    "featured": coalesce(
      featuredCaseStudies[]-> { ${CASE_STUDY_CARD} },
      *[_type == "caseStudy" && featured == true]
        | order(coalesce(order, 9999) asc, year desc) { ${CASE_STUDY_CARD} }
    )
  }
`);

// Case studies --------------------------------------------------------------

export const caseStudiesQuery = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)]
    | order(coalesce(order, 9999) asc, year desc) {
    ${CASE_STUDY_CARD}
  }
`);

export const caseStudySlugsQuery = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)].slug.current
`);

export const caseStudyBySlugQuery = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    ${CASE_STUDY_CARD},
    intro,
    scopeOfWork,
    timeline,
    externalUrl,
    seo { ${SEO_FIELDS} },
    body[] {
      ...,
      _type == "imageBlock" => { ..., image { ${IMAGE_FIELDS} } },
      _type == "imageGrid" => { ..., images[] { ${IMAGE_FIELDS} } },
      _type == "videoBlock" => {
        ...,
        "videoUrl": file.asset->url,
        poster { ${IMAGE_FIELDS} }
      },
      _type == "block" => {
        ...,
        markDefs[] { ... }
      }
    },
    "testimonials": *[_type == "testimonial" && relatedCaseStudy._ref == ^._id]
      | order(coalesce(order, 9999) asc) {
      _id, quote, authorName, role, company,
      avatar { ${IMAGE_FIELDS} }
    },
    // Neighbours for the "next project" link at the end of a case study.
    "next": *[_type == "caseStudy" && defined(slug.current) && _id != ^._id]
      | order(coalesce(order, 9999) asc, year desc)[0] {
      title, "slug": slug.current, coverImage { ${IMAGE_FIELDS} }
    }
  }
`);

// Playground ----------------------------------------------------------------

export const shotsQuery = defineQuery(`
  *[_type == "shot"] | order(coalesce(order, 9999) asc, date desc) {
    _id,
    title,
    mediaType,
    aspectRatio,
    date,
    externalLink,
    image { ${IMAGE_FIELDS} },
    "videoUrl": video.asset->url,
    videoPoster { ${IMAGE_FIELDS} }
  }
`);

// About ---------------------------------------------------------------------

export const aboutQuery = defineQuery(`
  *[_type == "about"][0] {
    headline,
    bio,
    skills,
    tools,
    portrait { ${IMAGE_FIELDS} },
    seo { ${SEO_FIELDS} }
  }
`);

export const experiencesQuery = defineQuery(`
  *[_type == "experience"] | order(startDate desc) {
    _id,
    company,
    role,
    startDate,
    endDate,
    isCurrent,
    location,
    description,
    url,
    logo { ${IMAGE_FIELDS} }
  }
`);

// Testimonials --------------------------------------------------------------

export const featuredTestimonialsQuery = defineQuery(`
  *[_type == "testimonial" && featured == true]
    | order(coalesce(order, 9999) asc) {
    _id, quote, authorName, role, company,
    avatar { ${IMAGE_FIELDS} }
  }
`);

// Blog ----------------------------------------------------------------------

export const postsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    tags,
    coverImage { ${IMAGE_FIELDS} }
  }
`);

export const postSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    tags,
    coverImage { ${IMAGE_FIELDS} },
    seo { ${SEO_FIELDS} },
    body[] {
      ...,
      _type == "imageBlock" => { ..., image { ${IMAGE_FIELDS} } },
      _type == "videoBlock" => {
        ...,
        "videoUrl": file.asset->url,
        poster { ${IMAGE_FIELDS} }
      }
    }
  }
`);

// Interactions ---------------------------------------------------------------

export const interactionsQuery = defineQuery(`
  *[_type == "interaction" && defined(slug.current)] | order(date desc) {
    _id, title, "slug": slug.current, summary, date, tags, componentKey
  }
`);

export const interactionSlugsQuery = defineQuery(`
  *[_type == "interaction" && defined(slug.current)].slug.current
`);

export const interactionBySlugQuery = defineQuery(`
  *[_type == "interaction" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, summary, date, tags,
    componentKey, sourceLabel, notes,
    seo { ${SEO_FIELDS} }
  }
`);

// Visual & brand --------------------------------------------------------------

export const visualProjectsQuery = defineQuery(`
  *[_type == "visualProject" && defined(slug.current)] | order(date desc) {
    _id, title, "slug": slug.current, summary, client, date, projectType, tags,
    coverImage { ${IMAGE_FIELDS} }
  }
`);

export const visualProjectSlugsQuery = defineQuery(`
  *[_type == "visualProject" && defined(slug.current)].slug.current
`);

export const visualProjectBySlugQuery = defineQuery(`
  *[_type == "visualProject" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, summary, client, date, projectType, tags,
    writing,
    coverImage { ${IMAGE_FIELDS} },
    seo { ${SEO_FIELDS} },
    gallery[] {
      ...,
      _type == "galleryImage" => { ..., image { ${IMAGE_FIELDS} } },
      _type == "videoBlock" => {
        ...,
        "videoUrl": file.asset->url,
        poster { ${IMAGE_FIELDS} }
      }
    }
  }
`);

/** Item counts per category, for the badges on the home page cards. */
export const categoryCountsQuery = defineQuery(`{
  "caseStudies": count(*[_type == "caseStudy" && defined(slug.current)]),
  "interactions": count(*[_type == "interaction" && defined(slug.current)]),
  "visual": count(*[_type == "visualProject" && defined(slug.current)])
}`);

/** Every URL the sitemap needs, in one round trip. */
export const sitemapQuery = defineQuery(`{
  "caseStudies": *[_type == "caseStudy" && defined(slug.current)] {
    "slug": slug.current, _updatedAt
  },
  "posts": *[_type == "post" && defined(slug.current)] {
    "slug": slug.current, _updatedAt
  },
  "interactions": *[_type == "interaction" && defined(slug.current)] {
    "slug": slug.current, _updatedAt
  },
  "visualProjects": *[_type == "visualProject" && defined(slug.current)] {
    "slug": slug.current, _updatedAt
  }
}`);
