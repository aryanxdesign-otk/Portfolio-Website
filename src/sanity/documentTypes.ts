/**
 * Document type names, deliberately kept in a module with no imports.
 *
 * The revalidation route handler and the fetch wrapper need these names, but
 * importing them from the schema index would pull the entire `sanity` package
 * into the server bundle — where its dependencies resolve to react-server
 * builds and the build fails. Keeping the constants standalone keeps those
 * server paths light.
 */

/** Document types that exist exactly once. Used by the Studio structure. */
export const SINGLETON_TYPES = ["homePage", "about", "siteSettings"] as const;
export type SingletonType = (typeof SINGLETON_TYPES)[number];

/** Every document type. These double as the cache tags for revalidation. */
export const DOCUMENT_TYPES = [
  "caseStudy",
  "interaction",
  "visualProject",
  "post",
  "shot",
  "testimonial",
  "experience",
  "about",
  "homePage",
  "siteSettings",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
