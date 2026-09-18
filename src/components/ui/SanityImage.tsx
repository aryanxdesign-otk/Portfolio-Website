import NextImage from "next/image";

import { cn } from "@/lib/cn";
import {
  hotspotToObjectPosition,
  urlFor,
  type SanityImageWithMeta,
} from "@/sanity/lib/image";

/**
 * The one place Sanity images become pixels.
 *
 * Three things happen here that are easy to get wrong per-call-site:
 *
 * 1. `.auto("format")` — Sanity negotiates AVIF/WebP per browser from a
 *    single upload, so no manual exports.
 * 2. LQIP — Sanity ships a tiny base64 preview in the asset metadata; used
 *    as the blur placeholder so images resolve instead of popping in.
 * 3. Hotspot — the focal point set in the Studio drives the crop, so a
 *    square card never cuts through someone's face.
 */
export function SanityImage({
  image,
  className,
  sizes = "100vw",
  priority = false,
  fill = false,
  width,
  height,
  quality = 90,
  alt: altOverride,
}: {
  image: SanityImageWithMeta | null | undefined;
  className?: string;
  /** Tell the browser the rendered width per breakpoint, or it fetches the largest. */
  sizes?: string;
  priority?: boolean;
  /** Fill the parent (which must be positioned). Otherwise pass width/height. */
  fill?: boolean;
  width?: number;
  height?: number;
  quality?: number;
  alt?: string;
}) {
  if (!image?.asset) return null;

  const lqip = image.asset.metadata?.lqip ?? undefined;
  const dims = image.asset.metadata?.dimensions;

  // Alt text is required in the schema; the empty fallback marks an image as
  // decorative rather than leaving a screen reader to read out a filename.
  const alt = altOverride ?? image.alt ?? "";

  const intrinsicWidth = width ?? dims?.width ?? 1600;
  const intrinsicHeight =
    height ??
    (dims?.aspectRatio
      ? Math.round(intrinsicWidth / dims.aspectRatio)
      : Math.round((intrinsicWidth * 3) / 4));

  const src = urlFor(image as never)
    .width(fill ? 2000 : intrinsicWidth)
    .quality(quality)
    .auto("format")
    .fit("max")
    .url();

  const shared = {
    src,
    alt,
    sizes,
    priority,
    className: cn(fill && "object-cover", className),
    ...(lqip ? { placeholder: "blur" as const, blurDataURL: lqip } : {}),
  };

  if (fill) {
    return (
      <NextImage
        {...shared}
        fill
        style={{ objectPosition: hotspotToObjectPosition(image) }}
      />
    );
  }

  return (
    <NextImage {...shared} width={intrinsicWidth} height={intrinsicHeight} />
  );
}
