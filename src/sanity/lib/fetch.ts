import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { warnIfUnconfigured } from "@/lib/env";
import type { DocumentType } from "@/sanity/documentTypes";

import { getClient } from "./client";

/**
 * The single read path for published content.
 *
 * Every call runs inside a `use cache` scope tagged with the document types
 * the query touches. When you publish in the Studio, the webhook at
 * /api/revalidate invalidates those exact tags — so an edit reaches the live
 * site in seconds without a rebuild, and nothing unrelated is thrown away.
 *
 * `cacheLife("max")` because the webhook is the source of truth for freshness.
 * Time-based expiry is only the safety net for a webhook that never arrived.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  fallback,
}: {
  query: string;
  params?: Record<string, unknown>;
  /** Document types this query reads. Drives on-demand invalidation. */
  tags: readonly DocumentType[];
  /** Returned when Sanity is unconfigured or the query fails. */
  fallback: T;
}): Promise<T> {
  "use cache";
  cacheLife("max");
  for (const tag of tags) cacheTag(tag);

  const client = getClient();

  if (!client) {
    warnIfUnconfigured();
    return fallback;
  }

  try {
    return await client.fetch<T>(query, params);
  } catch (error) {
    // A CMS outage should degrade the page, not blank the whole site.
    console.error("[sanity] query failed", { tags, error });
    return fallback;
  }
}
