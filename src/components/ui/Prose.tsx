import { cn } from "@/lib/cn";

/**
 * A run of body copy at the reading measure, with links styled once here
 * rather than at every call site.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-ink-muted space-y-4 leading-[1.7]",
        "[&_a]:text-ink [&_a]:decoration-line [&_a]:underline [&_a]:underline-offset-[3px]",
        "[&_a:hover]:decoration-ink [&_a]:transition-colors",
        "[&_strong]:text-ink [&_strong]:font-medium",
        className,
      )}
    >
      {children}
    </div>
  );
}
