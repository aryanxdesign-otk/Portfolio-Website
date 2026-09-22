import Link from "next/link";

import { AbstractArt } from "@/components/ui/AbstractArt";
import { SanityImage } from "@/components/ui/SanityImage";
import type { CategoryValue } from "@/sanity/categories";
import type { SanityImageWithMeta } from "@/sanity/lib/image";

/**
 * One block in a category grid.
 *
 * Uses the project's cover image when there is one and falls back to the
 * category's abstract artwork when there is not, so a grid is never a row of
 * empty rectangles while assets are still being gathered.
 */
export function ProjectBlock({
  title,
  summary,
  year,
  slug,
  cover,
  category,
  priority = false,
}: {
  title: string;
  summary?: string | null;
  year?: number | null;
  slug?: string | null;
  cover?: SanityImageWithMeta | null;
  category: CategoryValue;
  priority?: boolean;
}) {
  const art = cover?.asset ? (
    <SanityImage
      image={cover}
      alt={title}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="h-full w-full object-cover"
    />
  ) : (
    <AbstractArt variant={category} className="aspect-auto h-full" />
  );

  const body = (
    <>
      <div className="bg-bg-subtle border-line aspect-[4/3] overflow-hidden rounded-(--radius-card) border transition-[transform,box-shadow] duration-500 ease-(--ease-out-expo) group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.28)]">
        {art}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-ink font-medium">{title}</h3>
        {year ? (
          <span className="text-ink-faint shrink-0 font-mono text-xs tabular-nums">
            {year}
          </span>
        ) : null}
      </div>
      {summary ? (
        <p className="text-ink-muted mt-1 text-sm leading-relaxed">{summary}</p>
      ) : null}
    </>
  );

  if (!slug) {
    return <div className="group">{body}</div>;
  }

  return (
    <Link
      href={`/work/${slug}` as never}
      className="focus-visible:outline-ink group block rounded-(--radius-card) focus-visible:outline-2 focus-visible:outline-offset-8"
    >
      {body}
    </Link>
  );
}
