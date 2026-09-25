import { renderOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { getInteraction } from "@/sanity/lib/content";

export const alt = "Interactions";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Per-item share card, so a shared link previews its own title. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getInteraction(slug);

  return renderOgImage({
    title: item?.title ?? "Interactions",
    eyebrow: "Interactions",
  });
}
