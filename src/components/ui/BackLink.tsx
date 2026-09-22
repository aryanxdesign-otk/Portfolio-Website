import Link from "next/link";

/**
 * Back navigation for a sub-page. A real link rather than history.back(),
 * so it behaves the same whether someone arrived from the home page or
 * straight from a shared URL.
 */
export function BackLink({
  href = "/",
  children = "Back",
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href as never}
      className="group text-ink-muted hover:text-ink inline-flex items-center gap-2 text-sm transition-colors"
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-(--ease-out-expo) group-hover:-translate-x-1"
      >
        ←
      </span>
      {children}
    </Link>
  );
}
