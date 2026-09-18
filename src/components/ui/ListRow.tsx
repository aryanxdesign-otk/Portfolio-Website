import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * The workhorse of a text-led portfolio: one row of a list, with a title, an
 * optional description, and a right-aligned piece of metadata (a year, a
 * role). Used for work, projects, writing and the lab.
 *
 * Renders as a link when href is set and as a plain row otherwise, so a
 * project without a case study page does not become a dead link.
 */
export function ListRow({
  title,
  description,
  meta,
  href,
  external = false,
}: {
  title: string;
  description?: string | null;
  meta?: string | null;
  href?: string | null;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-ink font-medium">
          {title}
          {external ? (
            <span
              aria-hidden="true"
              className="text-ink-faint group-hover:text-ink ml-1 inline-block transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px"
            >
              ↗
            </span>
          ) : null}
        </span>
        {meta ? (
          <span className="text-ink-faint shrink-0 font-mono text-xs tabular-nums">
            {meta}
          </span>
        ) : null}
      </span>
      {description ? (
        <span className="text-ink-muted mt-0.5 block text-sm leading-relaxed">
          {description}
        </span>
      ) : null}
    </>
  );

  const rowClass =
    "group border-line block border-b py-3.5 last:border-b-0 transition-colors";

  if (!href) {
    return <div className={rowClass}>{content}</div>;
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        // noreferrer as well as noopener: without it the destination can read
        // where the click came from.
        rel="noopener noreferrer"
        className={cn(rowClass, "hover:border-ink-faint")}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href as never}
      className={cn(rowClass, "hover:border-ink-faint")}
    >
      {content}
    </Link>
  );
}
