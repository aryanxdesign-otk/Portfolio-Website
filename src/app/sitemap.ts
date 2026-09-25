import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { getSitemapEntries } from "@/sanity/lib/content";

/**
 * Every public URL on the site.
 *
 * Detail pages carry `_updatedAt` from Sanity as `lastModified`, so a crawler
 * re-reads a case study when it actually changes rather than on a guess.
 * /studio is absent by design — see robots.ts.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  const base = env.siteUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/case-studies`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/interactions`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/visual`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/writing`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/lab`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const detail = (
    items: { slug: string | null; _updatedAt?: string }[],
    prefix: string,
    priority: number,
  ): MetadataRoute.Sitemap =>
    items
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${base}${prefix}/${item.slug}`,
        lastModified: item._updatedAt ? new Date(item._updatedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority,
      }));

  return [
    ...staticRoutes,
    ...detail(entries.caseStudies ?? [], "/case-studies", 0.8),
    ...detail(entries.interactions ?? [], "/interactions", 0.8),
    ...detail(entries.visualProjects ?? [], "/visual", 0.8),
    ...detail(entries.posts ?? [], "/writing", 0.6),
  ];
}
