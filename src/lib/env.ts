/**
 * Environment access.
 *
 * Deliberately non-throwing at import time: the site must build and render
 * before a Sanity project exists (empty states instead of a crash), and it
 * must build on Vercel preview deploys where the read token is absent.
 * Call sites check `isSanityConfigured` and fall back to empty data.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const isSanityConfigured = projectId.length > 0;

export const env = {
  sanity: {
    projectId,
    dataset,
    // Pinned so a future Sanity API change can never alter responses silently.
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01",
    // Server-only. Absent from the browser bundle by design.
    readToken: process.env.SANITY_API_READ_TOKEN ?? "",
    revalidateSecret: process.env.SANITY_REVALIDATE_SECRET ?? "",
  },
  siteUrl: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  ).replace(/\/$/, ""),
} as const;

let warned = false;

/** Warns once per process when content is requested without a configured project. */
export function warnIfUnconfigured(): void {
  if (isSanityConfigured || warned) return;
  warned = true;
  console.warn(
    "[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set — rendering empty " +
      "content. Copy .env.example to .env.local and fill it in.",
  );
}
