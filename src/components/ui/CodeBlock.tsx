import { CopyButton } from "./CopyButton";

/**
 * A highlighted source listing.
 *
 * The markup arrives already highlighted from the build (see
 * src/lib/highlight.ts), so this component ships no highlighter — only the
 * small copy button is interactive. The `shiki` CSS variables below are what
 * let one pass of highlighting serve both themes.
 */
export function CodeBlock({
  html,
  raw,
  filename,
}: {
  html: string;
  raw: string;
  filename?: string;
}) {
  return (
    <figure className="border-line bg-bg-subtle overflow-hidden rounded-(--radius-card) border">
      <figcaption className="border-line text-ink-muted flex items-center justify-between gap-4 border-b px-4 py-2.5 font-mono text-xs">
        <span className="truncate">{filename}</span>
        <CopyButton value={raw} />
      </figcaption>

      <div
        className="shiki-block overflow-x-auto p-4 text-[0.8125rem] leading-relaxed"
        // Highlighted at build time by Shiki; not user input.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
