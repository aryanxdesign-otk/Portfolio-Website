import { renderOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { getVisualProject } from "@/sanity/lib/content";

export const alt = "Visual & brand";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Per-item share card, so a shared link previews its own title. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getVisualProject(slug);

  return renderOgImage({
    title: item?.title ?? "Visual & brand",
    eyebrow: "Visual & brand",
  });
}
