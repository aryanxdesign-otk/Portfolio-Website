"use client";

import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/cn";

export type ClientLogo = {
  name: string | null;
  url?: string | null;
};

/**
 * The scrolling strip of client marks.
 *
 * CSS animation rather than JS — it runs on the compositor, so it does not
 * compete with scrolling for main-thread time. The track is duplicated so
 * translating by exactly -50% loops with no visible seam; the duplicate is
 * aria-hidden and the real list is announced once.
 *
 * Under reduced motion it becomes a static wrapping row, which is the honest
 * version of the same content rather than a frozen animation.
 */
export function LogoMarquee({
  logos,
  label,
  media,
  speed = 45,
  className,
}: {
  logos: ClientLogo[];
  label?: string | null;
  /** Server-rendered logo images, one per client, in the same order. */
  media?: React.ReactNode[];
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const items = logos.filter((logo) => logo.name);

  if (items.length === 0) return null;

  const renderItem = (logo: ClientLogo, index: number) => {
    const node = media?.[index];
    return (
      <span
        key={`${logo.name}-${index}`}
        className="text-ink-faint flex h-8 shrink-0 items-center text-lg font-semibold tracking-tight whitespace-nowrap uppercase opacity-70"
      >
        {node ?? logo.name}
      </span>
    );
  };

  const names = items.map((logo) => logo.name).join(", ");

  if (reduced) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-x-12 gap-y-6",
          className,
        )}
      >
        {label ? <Label>{label}</Label> : null}
        {items.map(renderItem)}
      </div>
    );
  }

  // Both copies are aria-hidden; the sr-only list above carries the content,
  // so a screen reader hears each client once rather than twice.
  const track = (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center gap-x-16 pr-16"
    >
      {items.map(renderItem)}
    </div>
  );

  return (
    <div className={cn("flex items-center gap-10", className)}>
      {label ? <Label>{label}</Label> : null}

      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] select-none">
        <span className="sr-only">{names}</span>
        <div
          className="flex w-max animate-[marquee_linear_infinite]"
          style={{ animationDuration: `${speed}s` }}
        >
          {track}
          {track}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-ink-subtle shrink-0 text-base whitespace-nowrap">
      {children}
    </span>
  );
}
