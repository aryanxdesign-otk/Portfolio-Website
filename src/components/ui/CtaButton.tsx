import { cn } from "@/lib/cn";

/**
 * The single accent button on the page. The arrow lifts diagonally on hover
 * — a one-property move, which is what keeps it feeling crisp rather than
 * busy next to the nav.
 */
export function CtaButton({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group bg-accent text-accent-ink inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium",
        "transition-transform duration-200 ease-(--ease-out-expo) hover:scale-[1.03] active:scale-[0.98]",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        ↗
      </span>
    </a>
  );
}
