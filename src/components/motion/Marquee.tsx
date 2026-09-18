"use client";

import { cn } from "@/lib/cn";

import { useReducedMotion } from "./useReducedMotion";

/**
 * Infinite horizontal word strip.
 *
 * CSS animation rather than JS — it runs on the compositor, so it does not
 * compete with scrolling for main-thread time. The track is duplicated so
 * translating by exactly -50% loops seamlessly.
 */
export function Marquee({
  items,
  className,
  speed = 40,
  separator = "—",
}: {
  items: string[];
  className?: string;
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  separator?: string;
}) {
  const reduced = useReducedMotion();

  if (items.length === 0) return null;

  // Reduced motion: show the words as a static, wrapping list instead.
  if (reduced) {
    return (
      <ul
        className={cn(
          "text-ink-muted flex flex-wrap justify-center gap-x-4 gap-y-1",
          className,
        )}
      >
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  const track = (
    <span
      className="flex shrink-0 items-center gap-8 pr-8"
      // The duplicate is decorative; the first copy carries the real text.
      aria-hidden="true"
    >
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-8">
          <span>{item}</span>
          <span className="text-ink-faint">{separator}</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={cn("relative flex overflow-hidden select-none", className)}>
      <span className="sr-only">{items.join(", ")}</span>
      <div
        className="flex w-max animate-[marquee_linear_infinite]"
        style={{ animationDuration: `${speed}s` }}
      >
        {track}
        {track}
      </div>
    </div>
  );
}
