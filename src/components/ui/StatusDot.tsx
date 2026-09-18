import { cn } from "@/lib/cn";

/**
 * The availability indicator — a soft pulsing dot, echoing the Framer design.
 *
 * The pulse is decorative, so the ring is aria-hidden and the status is
 * carried by the adjacent text rather than by colour alone.
 */
export function StatusDot({
  tone = "positive",
  className,
}: {
  tone?: "positive" | "muted";
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-flex size-2 shrink-0", className)}
      aria-hidden="true"
    >
      {tone === "positive" ? (
        <span className="bg-positive absolute inset-0 animate-ping rounded-full opacity-60 [animation-duration:2.4s]" />
      ) : null}
      <span
        className={cn(
          "relative inline-flex size-2 rounded-full",
          tone === "positive" ? "bg-positive" : "bg-ink-faint",
        )}
      />
    </span>
  );
}
