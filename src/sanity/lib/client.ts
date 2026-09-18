import { createClient } from "next-sanity";

import { env } from "@/lib/env";

/**
 * Read-only client for published content.
 *
 * `useCdn: false` is deliberate. Caching is handled by Next's `use cache`
 * layer and invalidated precisely by the publish webhook — putting Sanity's
 * own CDN in front of that would add a second, slower cache we cannot
 * invalidate, which is exactly how "I published but the site is stale" bugs
 * happen.
 */
export const client = createClient({
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
  apiVersion: env.sanity.apiVersion,
  useCdn: false,
  perspective: "published",
});

/**
 * Client that can read drafts. Requires a read token, so it is server-only
 * and must never be imported into a client component.
 */
export const draftClient = client.withConfig({
  token: env.sanity.readToken,
  perspective: "drafts",
  useCdn: false,
  stega: false,
});
