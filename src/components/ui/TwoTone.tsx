import { cn } from "@/lib/cn";

export type TwoToneHeading = {
  lead?: string | null;
  rest?: string | null;
} | null;

/**
 * The site's signature heading: a muted opening clause, then a solid one.
 *
 * Both clauses are rendered inside a single heading element so the accessible
 * name is the whole sentence — splitting them across two elements would put
 * "Tools & tech that" and "supercharges my workflow." in the document outline
 * as separate headings, which is not what anyone means by it.
 *
 * The space between the clauses lives on the lead span rather than between
 * the two spans, so it can't be collapsed away by JSX whitespace handling.
 */
export function TwoTone({
  heading,
  as: Tag = "h2",
  id,
  tone = "default",
  stack = false,
  className,
}: {
  heading: TwoToneHeading;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  /** `inverse` for the black footer band, where the two tones swap around. */
  tone?: "default" | "inverse";
  /**
   * Break the line between the two clauses.
   *
   * Most of these headings break exactly where the tone changes, which no
   * width can produce on its own: the closing clause is longer than the
   * opening one, so any column wide enough to hold it on one line is also
   * wide enough to pull the first word of it up onto the line above. Where a
   * heading is meant to wrap naturally instead — the tools one does — leave
   * this off.
   */
  stack?: boolean;
  className?: string;
}) {
  if (!heading?.rest && !heading?.lead) return null;

  // In the footer the solid clause comes first and the muted one second —
  // the emphasis inverts along with the colours.
  const leadTone = tone === "inverse" ? "text-ink-inverse" : "text-ink-muted";
  const restTone = tone === "inverse" ? "text-ink-inverse-muted" : "text-ink";

  return (
    <Tag
      id={id}
      className={cn(
        "text-display tracking-display max-w-[16ch] font-medium",
        className,
      )}
    >
      {heading.lead ? (
        <span className={cn(leadTone, stack && "block")}>
          {stack ? heading.lead : `${heading.lead} `}
        </span>
      ) : null}
      {heading.rest ? (
        <span className={cn(restTone, stack && "block")}>{heading.rest}</span>
      ) : null}
    </Tag>
  );
}
