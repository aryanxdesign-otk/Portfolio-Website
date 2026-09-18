import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { env } from "@/lib/env";

const builder = createImageUrlBuilder({
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
});

/**
 * Build a Sanity CDN URL for an image.
 *
 * Chain transforms onto the result — Sanity applies them on the fly, so one
 * upload serves every size the site needs:
 *   urlFor(img).width(1600).fit("max").auto("format").url()
 *
 * `.auto("format")` is what negotiates AVIF/WebP per browser. Crops honour
 * the hotspot set in the Studio.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/** The shape every image query asks for. Keeps queries and props in step. */
export type SanityImageWithMeta = {
  asset?: {
    _ref?: string;
    url?: string | null;
    metadata?: {
      lqip?: string | null;
      dimensions?: {
        width?: number | null;
        height?: number | null;
        aspectRatio?: number | null;
      } | null;
    } | null;
  } | null;
  hotspot?: { x?: number; y?: number } | null;
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  } | null;
  alt?: string | null;
  caption?: string | null;
};

/**
 * Sanity's hotspot expressed as a CSS object-position, for the cases where an
 * image is rendered with `fill` and cropped by CSS rather than by the CDN.
 */
export function hotspotToObjectPosition(
  image: Pick<SanityImageWithMeta, "hotspot"> | null | undefined,
): string {
  const x = image?.hotspot?.x;
  const y = image?.hotspot?.y;
  if (typeof x !== "number" || typeof y !== "number") return "50% 50%";
  return `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
}
