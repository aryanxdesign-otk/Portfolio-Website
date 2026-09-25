import { renderOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { getSiteSettings } from "@/sanity/lib/content";

export const alt = "Aryan Chillal — Portfolio";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** The site-wide share card, used by any page without its own. */
export default async function Image() {
  const settings = await getSiteSettings();
  return renderOgImage({
    title: settings?.tagline ?? "Product Designer",
    eyebrow: settings?.availabilityNote ?? undefined,
    footer: settings?.name ?? "Portfolio",
  });
}
