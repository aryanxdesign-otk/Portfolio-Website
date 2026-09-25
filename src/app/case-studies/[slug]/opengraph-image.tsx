import { renderOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { getCaseStudy } from "@/sanity/lib/content";

export const alt = "Case studies";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Per-item share card, so a shared link previews its own title. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getCaseStudy(slug);

  return renderOgImage({
    title: item?.title ?? "Case studies",
    eyebrow: "Case studies",
  });
}
