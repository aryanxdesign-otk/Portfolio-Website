"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/**
 * Video that starts when it scrolls into view and stops when it leaves.
 *
 * Autoplaying video is muted and looped by necessity (browsers block audible
 * autoplay), and is suppressed entirely under reduced motion — where the
 * poster frame plus real controls is the right answer instead.
 *
 * Pausing off-screen matters on a portfolio page with several clips: without
 * it, every video decodes continuously and the page stutters while scrolling.
 */
export function VideoPlayer({
  src,
  poster,
  autoplay = true,
  className,
  ariaLabel,
}: {
  src: string;
  poster?: string;
  autoplay?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const shouldAutoplay = autoplay && !reduced;

  useEffect(() => {
    const video = ref.current;
    if (!video || !shouldAutoplay) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Can reject if the browser declines autoplay; nothing to recover.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldAutoplay]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={cn("h-full w-full object-cover", className)}
      muted={shouldAutoplay}
      loop={shouldAutoplay}
      playsInline
      preload={shouldAutoplay ? "metadata" : "none"}
      // Without autoplay the visitor needs a way to start it themselves.
      controls={!shouldAutoplay}
      aria-label={ariaLabel}
    />
  );
}
