import { FadeIn } from "@/components/motion/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import type { SanityImageWithMeta } from "@/sanity/lib/image";

type Testimonial = {
  _id: string;
  quote: string | null;
  authorName: string | null;
  role: string | null;
  company: string | null;
  avatar: SanityImageWithMeta | null;
};

/**
 * Quotes from people worked with.
 *
 * Returns null when there are none, so an empty CMS leaves no orphaned band
 * on the home page rather than a heading over nothing.
 */
export function Testimonials({
  heading,
  items,
}: {
  heading?: string | null;
  items: Testimonial[];
}) {
  const quotes = items.filter((item) => item.quote);
  if (quotes.length === 0) return null;

  return (
    <section aria-labelledby="testimonials" className="pb-(--space-section)">
      <h2
        id="testimonials"
        className="text-ink-faint mb-8 font-mono text-xs tracking-widest uppercase"
      >
        {heading ?? "Kind words"}
      </h2>

      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {quotes.map((item, index) => (
          <FadeIn as="li" key={item._id} y={16} delay={(index % 2) * 0.08}>
            <figure>
              <blockquote className="text-ink-muted leading-[1.7] text-pretty">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-3">
                {item.avatar?.asset ? (
                  <SanityImage
                    image={item.avatar}
                    alt={item.authorName ?? ""}
                    width={36}
                    height={36}
                    sizes="36px"
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="bg-bg-inset text-ink-muted grid size-9 place-items-center rounded-full text-xs font-medium"
                  >
                    {item.authorName?.[0] ?? "—"}
                  </span>
                )}

                <span className="text-sm">
                  <span className="text-ink block font-medium">
                    {item.authorName}
                  </span>
                  <span className="text-ink-faint block">
                    {[item.role, item.company].filter(Boolean).join(", ")}
                  </span>
                </span>
              </figcaption>
            </figure>
          </FadeIn>
        ))}
      </ul>
    </section>
  );
}
