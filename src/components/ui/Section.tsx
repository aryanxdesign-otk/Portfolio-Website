import { cn } from "@/lib/cn";

import { Container } from "./Container";

/**
 * A page section with the standard vertical rhythm and an optional heading.
 *
 * Headings are real <h2>s with an id, so sections are linkable and the
 * document outline stays meaningful for screen readers.
 */
export function Section({
  children,
  className,
  heading,
  headingId,
  aside,
  containerSize = "default",
}: {
  children: React.ReactNode;
  className?: string;
  heading?: string | null;
  headingId?: string;
  /** Optional right-aligned element beside the heading, e.g. a "view all" link. */
  aside?: React.ReactNode;
  containerSize?: "default" | "prose" | "wide";
}) {
  return (
    <section
      className={cn("py-(--space-section)", className)}
      aria-labelledby={heading && headingId ? headingId : undefined}
    >
      <Container size={containerSize}>
        {heading ? (
          <div className="border-line mb-10 flex items-end justify-between gap-6 border-b pb-4 md:mb-14">
            <h2 id={headingId} className="text-xl font-medium tracking-tight">
              {heading}
            </h2>
            {aside ? <div className="shrink-0">{aside}</div> : null}
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
