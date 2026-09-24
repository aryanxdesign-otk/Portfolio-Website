import Link from "next/link";

import { AbstractArt } from "@/components/ui/AbstractArt";
import { SanityImage } from "@/components/ui/SanityImage";
import { cn } from "@/lib/cn";
import type { SanityImageWithMeta } from "@/sanity/lib/image";

export type GridItem = {
  id: string;
  title: string;
  href: string;
  /** Small labels under the title — year, type of project. */
  tags: string[];
  cover?: SanityImageWithMeta | null;
  /** Used when a piece has no cover image yet. */
  artVariant?: "case-studies" | "micro-interactions" | "brand";
};

/**
 * The image-led grid shared by every collection.
 *
 * Titles and a couple of tags only — the image does the work, which is the
 * point of a visual index. Anything longer belongs on the detail page.
 */
export function CollectionGrid({
  items,
  columns = 2,
}: {
  items: GridItem[];
  /** Two reads as a portfolio, three as a catalogue. */
  columns?: 2 | 3;
}) {
  return (
    <ul
      className={cn(
        "grid gap-x-6 gap-y-12",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {items.map((item, index) => (
        <li key={item.id}>
          <Link
            href={item.href as never}
            className="focus-visible:outline-ink group block rounded-(--radius-card) focus-visible:outline-2 focus-visible:outline-offset-8"
          >
            <div className="bg-bg-subtle border-line aspect-[4/3] overflow-hidden rounded-(--radius-card) border transition-[transform,box-shadow] duration-500 ease-(--ease-out-expo) group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.28)]">
              {item.cover?.asset ? (
                <SanityImage
                  image={item.cover}
                  alt={item.title}
                  priority={index < 2}
                  sizes={
                    columns === 2
                      ? "(max-width: 640px) 100vw, 50vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <AbstractArt
                  variant={item.artVariant ?? "case-studies"}
                  className="aspect-auto h-full"
                />
              )}
            </div>

            <h3 className="text-ink mt-4 font-medium">{item.title}</h3>

            {item.tags.length > 0 ? (
              <p className="text-ink-faint mt-1 flex flex-wrap items-center gap-x-2 font-mono text-xs">
                {item.tags.map((tag, tagIndex) => (
                  <span key={tag} className="flex items-center gap-2">
                    {tag}
                    {tagIndex < item.tags.length - 1 ? (
                      <span aria-hidden="true">·</span>
                    ) : null}
                  </span>
                ))}
              </p>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
