import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

/**
 * Keeps crawlers out of the parts of the site that are not content.
 *
 * `/studio` is the CMS admin — indexing it puts a login page for this site's
 * content in search results, which is both untidy and an invitation. `/api`
 * is the revalidation webhook and has nothing to read.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/studio/", "/api/"],
    },
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}
