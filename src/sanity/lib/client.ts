import { createClient, type SanityClient } from "next-sanity";

import { env, isSanityConfigured } from "@/lib/env";

/**
 * Sanity clients, created lazily.
 *
 * `createClient` throws immediately if projectId is empty, so constructing at
 * module scope would crash every route that transitively imports this file —
 * including before a Sanity project exists, which is a state this site
 * deliberately supports. Callers check `isSanityConfigured` first; these
 * return null rather than throwing when it is false.
 */

let cached: SanityClient | null = null;
let cachedDraft: SanityClient | null = null;

/**
 * Read-only client for published content.
 *
 * `useCdn: false` is deliberate. Caching is handled by Next's `use cache`
 * layer and invalidated precisely by the publish webhook — putting Sanity's
 * own CDN in front of that would add a second, slower cache we cannot
 * invalidate, which is exactly how "I published but the site is stale" bugs
 * happen.
 */
export function getClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  cached ??= createClient({
    projectId: env.sanity.projectId,
    dataset: env.sanity.dataset,
    apiVersion: env.sanity.apiVersion,
    useCdn: false,
    perspective: "published",
  });
  return cached;
}

/**
 * Client that can read drafts. Requires a read token, so it is server-only
 * and must never be imported into a client component.
 */
export function getDraftClient(): SanityClient | null {
  const base = getClient();
  if (!base || !env.sanity.readToken) return null;
  cachedDraft ??= base.withConfig({
    token: env.sanity.readToken,
    perspective: "drafts",
    useCdn: false,
    stega: false,
  });
  return cachedDraft;
}
