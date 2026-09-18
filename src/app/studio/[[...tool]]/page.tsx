/**
 * The Sanity Studio, mounted at /studio.
 *
 * `force-dynamic` because the Studio is a live editing client — it must never
 * be prerendered or cached. It is excluded from the sitemap and disallowed in
 * robots.txt.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/../sanity.config";

export const dynamic = "force-dynamic";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
