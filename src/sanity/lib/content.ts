import "server-only";

import type {
  AboutQueryResult,
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
    fallback: null,
  });
}

export function getHomePage(): Promise<HomePageQueryResult> {
  return sanityFetch({
    query: q.homePageQuery,
    // Reads case studies through the featured reference, so it must be
    // invalidated when either the page or a case study changes.
    tags: ["homePage", "caseStudy"],
    fallback: null,
  });
}

export function getCaseStudies(): Promise<CaseStudiesQueryResult> {
  return sanityFetch({
    query: q.caseStudiesQuery,
    tags: ["caseStudy"],
    fallback: [],
  });
}

export function getCaseStudySlugs(): Promise<CaseStudySlugsQueryResult> {
  return sanityFetch({
    query: q.caseStudySlugsQuery,
    tags: ["caseStudy"],
    fallback: [],
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
    fallback: null,
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
    fallback: null,
  });
}

export function getExperiences(): Promise<ExperiencesQueryResult> {
  return sanityFetch({
    query: q.experiencesQuery,
    tags: ["experience"],
    fallback: [],
  });
}

export function getFeaturedTestimonials(): Promise<FeaturedTestimonialsQueryResult> {
  return sanityFetch({
    query: q.featuredTestimonialsQuery,
    tags: ["testimonial"],
    fallback: [],
  });
}

export function getPosts(): Promise<PostsQueryResult> {
  return sanityFetch({
    query: q.postsQuery,
    tags: ["post"],
    fallback: [],
  });
}

export function getPostSlugs(): Promise<PostSlugsQueryResult> {
  return sanityFetch({
    query: q.postSlugsQuery,
    tags: ["post"],
    fallback: [],
  });
}

export function getPost(slug: string): Promise<PostBySlugQueryResult> {
  return sanityFetch({
    query: q.postBySlugQuery,
    params: { slug },
    tags: ["post"],
    fallback: null,
  });
}

export function getSitemapEntries(): Promise<SitemapQueryResult> {
  return sanityFetch({
    query: q.sitemapQuery,
    tags: ["caseStudy", "post"],
    fallback: { caseStudies: [], posts: [] },
  });
}
