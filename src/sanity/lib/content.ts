import "server-only";

import type {
  AboutQueryResult,
  InteractionBySlugQueryResult,
  InteractionSlugsQueryResult,
  InteractionsQueryResult,
  VisualProjectBySlugQueryResult,
  VisualProjectSlugsQueryResult,
  VisualProjectsQueryResult,
  CategoryCountsQueryResult,
  CaseStudiesQueryResult,
  CaseStudyBySlugQueryResult,
  CaseStudySlugsQueryResult,
  ExperiencesQueryResult,
  FeaturedTestimonialsQueryResult,
  HomePageQueryResult,
  PostBySlugQueryResult,
  PostSlugsQueryResult,
  PostsQueryResult,
  ShotsQueryResult,
  SiteSettingsQueryResult,
  SitemapQueryResult,
} from "@/sanity/types.generated";

import { sanityFetch } from "./fetch";
import * as q from "./queries";
import {
  seedAbout,
  seedCaseStudies,
  seedCategoryCounts,
  seedInteractions,
  seedPosts,
  seedTestimonials,
  seedVisualProjects,
  seedExperiences,
  seedHomePage,
  seedSiteSettings,
} from "./seed";

/** Slugs of the seed projects, so routes exist before Sanity is configured. */
const seedSlugs = seedCaseStudies.map((project) => project.slug);

/**
 * The content API the rest of the app uses. Pages call these, never the
 * Sanity client directly — which keeps cache tags in one place and means an
 * unconfigured or failing CMS renders empty states instead of a stack trace.
 *
 * Each function declares the document types it reads. Those are the tags the
 * publish webhook invalidates.
 */

export function getSiteSettings(): Promise<SiteSettingsQueryResult> {
  return sanityFetch({
    query: q.siteSettingsQuery,
    tags: ["siteSettings"],
    fallback: seedSiteSettings as SiteSettingsQueryResult,
  });
}

export function getHomePage(): Promise<HomePageQueryResult> {
  return sanityFetch({
    query: q.homePageQuery,
    // Reads case studies through the featured reference, so it must be
    // invalidated when either the page or a case study changes.
    tags: ["homePage", "caseStudy"],
    fallback: seedHomePage as HomePageQueryResult,
  });
}

export function getCaseStudies(): Promise<CaseStudiesQueryResult> {
  return sanityFetch({
    query: q.caseStudiesQuery,
    tags: ["caseStudy"],
    fallback: seedCaseStudies as CaseStudiesQueryResult,
  });
}

export function getCaseStudySlugs(): Promise<CaseStudySlugsQueryResult> {
  return sanityFetch({
    query: q.caseStudySlugsQuery,
    tags: ["caseStudy"],
    fallback: seedSlugs,
  });
}

export function getCaseStudy(
  slug: string,
): Promise<CaseStudyBySlugQueryResult> {
  return sanityFetch({
    query: q.caseStudyBySlugQuery,
    params: { slug },
    // Pulls in related testimonials, so both types invalidate it.
    tags: ["caseStudy", "testimonial"],
    fallback: (seedCaseStudies.find((project) => project.slug === slug) ??
      null) as CaseStudyBySlugQueryResult,
  });
}

export function getShots(): Promise<ShotsQueryResult> {
  return sanityFetch({
    query: q.shotsQuery,
    tags: ["shot"],
    fallback: [],
  });
}

export function getAbout(): Promise<AboutQueryResult> {
  return sanityFetch({
    query: q.aboutQuery,
    tags: ["about"],
    fallback: seedAbout as AboutQueryResult,
  });
}

export function getExperiences(): Promise<ExperiencesQueryResult> {
  return sanityFetch({
    query: q.experiencesQuery,
    tags: ["experience"],
    fallback: seedExperiences as ExperiencesQueryResult,
  });
}

export function getFeaturedTestimonials(): Promise<FeaturedTestimonialsQueryResult> {
  return sanityFetch({
    query: q.featuredTestimonialsQuery,
    tags: ["testimonial"],
    fallback: seedTestimonials as FeaturedTestimonialsQueryResult,
  });
}

export function getPosts(): Promise<PostsQueryResult> {
  return sanityFetch({
    query: q.postsQuery,
    tags: ["post"],
    fallback: seedPosts as PostsQueryResult,
  });
}

export function getPostSlugs(): Promise<PostSlugsQueryResult> {
  return sanityFetch({
    query: q.postSlugsQuery,
    tags: ["post"],
    fallback: seedPosts.map((post) => post.slug),
  });
}

export function getPost(slug: string): Promise<PostBySlugQueryResult> {
  return sanityFetch({
    query: q.postBySlugQuery,
    params: { slug },
    tags: ["post"],
    fallback: (seedPosts.find((post) => post.slug === slug) ??
      null) as PostBySlugQueryResult,
  });
}

export function getInteractions(): Promise<InteractionsQueryResult> {
  return sanityFetch({
    query: q.interactionsQuery,
    tags: ["interaction"],
    fallback: seedInteractions as InteractionsQueryResult,
  });
}

export function getInteractionSlugs(): Promise<InteractionSlugsQueryResult> {
  return sanityFetch({
    query: q.interactionSlugsQuery,
    tags: ["interaction"],
    fallback: seedInteractions.map((item) => item.slug),
  });
}

export function getInteraction(
  slug: string,
): Promise<InteractionBySlugQueryResult> {
  return sanityFetch({
    query: q.interactionBySlugQuery,
    params: { slug },
    tags: ["interaction"],
    fallback: (seedInteractions.find((item) => item.slug === slug) ??
      null) as InteractionBySlugQueryResult,
  });
}

export function getVisualProjects(): Promise<VisualProjectsQueryResult> {
  return sanityFetch({
    query: q.visualProjectsQuery,
    tags: ["visualProject"],
    fallback: seedVisualProjects as VisualProjectsQueryResult,
  });
}

export function getVisualProjectSlugs(): Promise<VisualProjectSlugsQueryResult> {
  return sanityFetch({
    query: q.visualProjectSlugsQuery,
    tags: ["visualProject"],
    fallback: seedVisualProjects.map((item) => item.slug),
  });
}

export function getVisualProject(
  slug: string,
): Promise<VisualProjectBySlugQueryResult> {
  return sanityFetch({
    query: q.visualProjectBySlugQuery,
    params: { slug },
    tags: ["visualProject"],
    fallback: (seedVisualProjects.find((item) => item.slug === slug) ??
      null) as VisualProjectBySlugQueryResult,
  });
}

export function getCategoryCounts(): Promise<CategoryCountsQueryResult> {
  return sanityFetch({
    query: q.categoryCountsQuery,
    tags: ["caseStudy"],
    fallback: seedCategoryCounts,
  });
}

export function getSitemapEntries(): Promise<SitemapQueryResult> {
  return sanityFetch({
    query: q.sitemapQuery,
    tags: ["caseStudy", "post", "interaction", "visualProject"],
    // Derived from seed rather than empty: an unconfigured project would
    // otherwise publish a sitemap listing only the static routes, silently
    // hiding every detail page from crawlers.
    fallback: {
      caseStudies: seedCaseStudies.map((item) => ({ slug: item.slug })),
      posts: seedPosts.map((item) => ({ slug: item.slug })),
      interactions: seedInteractions.map((item) => ({ slug: item.slug })),
      visualProjects: seedVisualProjects.map((item) => ({ slug: item.slug })),
    } as SitemapQueryResult,
  });
}
