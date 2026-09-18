import { cn } from "@/lib/cn";

/**
 * The horizontal frame every section sits in. Gutters are fluid (see
 * --space-gutter), so there is exactly one place to change page margins.
 */
export function Container({
  children,
  className,
  size = "default",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** `prose` narrows to a comfortable reading measure for body copy. */
  size?: "default" | "prose" | "wide";
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-(--space-gutter)",
        size === "default" && "max-w-(--container-max)",
        size === "prose" && "max-w-[68ch]",
        size === "wide" && "max-w-none",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
