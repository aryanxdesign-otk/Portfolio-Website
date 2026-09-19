import { cn } from "@/lib/cn";

/**
 * Stands in for an image that has not been uploaded yet.
 *
 * Every media slot on the page renders one of these when its Sanity image is
 * missing, so the layout, the grid and the card-flight animation are all
 * correct and reviewable before a single asset exists. The label keeps it
 * legible as a deliberate placeholder rather than a broken image.
 */
export function MediaPlaceholder({
  label,
  className,
}: {
  label?: string | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-bg-inset flex h-full w-full items-center justify-center",
        className,
      )}
    >
      {label ? (
        <span className="text-ink-faint px-4 text-center font-mono text-xs tracking-wide">
          {label}
        </span>
      ) : null}
    </div>
  );
}
