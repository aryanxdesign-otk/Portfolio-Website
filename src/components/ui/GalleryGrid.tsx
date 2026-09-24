import { FadeIn } from "@/components/motion/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { cn } from "@/lib/cn";
import type { SanityImageWithMeta } from "@/sanity/lib/image";

type GalleryEntry = {
  _key: string;
  _type: string;
  width?: string | null;
  image?: SanityImageWithMeta | null;
  videoUrl?: string | null;
  poster?: SanityImageWithMeta | null;
  alt?: string | null;
  caption?: string | null;
  autoplay?: boolean | null;
};

/**
 * A curated gallery rather than a uniform grid.
 *
 * Half-width entries pair with the next one, full spans the column, and bleed
 * runs edge to edge. A single repeating cell size would flatten a curation
 * into a contact sheet — the varied rhythm is what makes it read as chosen.
 */
export function GalleryGrid({ items }: { items: GalleryEntry[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-14 flex flex-wrap gap-6">
      {items.map((item, index) => {
        const width =
          item.width ?? (item._type === "videoBlock" ? "full" : "full");

        const sizing = cn(
          width === "half" && "w-full sm:w-[calc(50%-0.75rem)]",
          width === "full" && "w-full",
          width === "bleed" &&
            "relative left-1/2 w-screen -translate-x-1/2 px-0",
        );

        const media =
          item._type === "videoBlock" && item.videoUrl ? (
            <VideoPlayer
              src={item.videoUrl}
              poster={item.poster?.asset?.url ?? undefined}
              autoplay={item.autoplay ?? true}
              ariaLabel={item.alt ?? undefined}
            />
          ) : item.image?.asset ? (
            <SanityImage
              image={item.image}
              priority={index === 0}
              sizes={
                width === "half"
                  ? "(max-width: 640px) 100vw, 50vw"
                  : "(max-width: 1024px) 100vw, 1100px"
              }
              className="w-full"
            />
          ) : null;

        if (!media) return null;

        const caption = item.caption ?? item.image?.caption;

        return (
          <FadeIn key={item._key} y={18} className={sizing}>
            <figure>
              <div
                className={cn(
                  "bg-bg-subtle overflow-hidden",
                  width !== "bleed" &&
                    "border-line rounded-(--radius-card) border",
                )}
              >
                {media}
              </div>
              {caption ? (
                <figcaption className="text-ink-muted mt-2.5 text-sm">
                  {caption}
                </figcaption>
              ) : null}
            </figure>
          </FadeIn>
        );
      })}
    </div>
  );
}
