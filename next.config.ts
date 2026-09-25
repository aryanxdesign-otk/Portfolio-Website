import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components is the Next 16 caching model. Content is fetched inside
  // `use cache` scopes tagged by document type (see src/sanity/lib/fetch.ts),
  // then invalidated on publish by the Sanity webhook at /api/revalidate.
  // The result: static HTML from the CDN that updates seconds after an edit,
  // with no rebuild and no redeploy.
  cacheComponents: true,
  // Upgrades the prerendered App Shell to a full route once params are known,
  // so case studies added after the last build still render instantly.
  partialPrefetching: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      // Sanity avatars on author/testimonial records.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    // Portfolio imagery is large and art-directed; these are the breakpoints
    // the SanityImage wrapper requests.
    formats: ["image/avif", "image/webp"],
  },

  typedRoutes: true,

  // The three collections replaced the old /work space. Permanent, so search
  // engines and anyone holding an old link land on the new home.
  async redirects() {
    return [
      { source: "/work", destination: "/case-studies", permanent: true },
      {
        source: "/work/:slug",
        destination: "/case-studies/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
