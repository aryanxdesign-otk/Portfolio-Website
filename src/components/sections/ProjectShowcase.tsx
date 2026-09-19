"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";

import { CURSOR_LABEL_ATTR } from "@/components/motion/Cursor";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { ArrowUpRight } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * The id of the empty box in the hero that marks where the stack of cards
 * sits before it flies apart.
 *
 * Looked up by id rather than passed as a ref because the anchor lives in the
 * hero, which is a server component in a different part of the tree. Making
 * the ref reachable would mean turning the whole page into one client
 * component to thread it through — a lot of JavaScript shipped to solve a
 * problem that one stable id solves.
 */
export const HERO_STACK_ANCHOR_ID = "hero-stack-anchor";

/**
 * How each of the first four cards sits in the hero stack: an offset from
 * the anchor's centre, a rotation, and a paint order. Beyond the fourth card
 * there is no stack position, so later projects simply don't fly.
 */
const FAN = [
  { dx: -70, dy: -34, rotate: -9, z: 2 },
  { dx: 44, dy: -52, rotate: 6, z: 3 },
  { dx: -34, dy: 34, rotate: -4, z: 5 },
  { dx: 78, dy: 16, rotate: 9, z: 4 },
] as const;

/** How much of the hero anchor's width a stacked card occupies. */
const STACK_FILL = 0.82;

type Metrics = { dx: number; dy: number; heroScale: number };

export type ShowcaseProject = {
  id: string;
  title: string;
  meta: string | null;
  href: string | null;
};

/**
 * The projects grid, and the animation that fills it.
 *
 * The cards are laid out in the grid in normal flow and transformed *up* into
 * the hero, rather than being drawn in the hero and moved down. That ordering
 * matters: it means the server-rendered HTML already has every card in its
 * final position, so the grid is correct before any JavaScript runs, with no
 * measurement, no duplicated nodes, and nothing to clean up if the effect
 * never fires. The animation is then purely a transform applied on top.
 *
 * It is one element throughout — not a copy in the hero crossfading into a
 * copy in the grid — so the landing reads as continuous.
 */
export function ProjectShowcase({
  heading,
  allLabel,
  allHref,
  projects,
  media,
  viewLabel = "View Project",
}: {
  heading: string;
  allLabel?: string | null;
  allHref?: string | null;
  projects: ShowcaseProject[];
  /** Server-rendered cover images, one per project, in the same order. */
  media: React.ReactNode[];
  viewLabel?: string;
}) {
  const reduced = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * Measurements live in a MotionValue rather than in React state.
   *
   * They are DOM geometry feeding an animation, not something the component
   * renders — no markup changes when they update. Keeping them out of state
   * means a re-measure on every resize and every image load costs a transform
   * write instead of a React render of the whole grid.
   */
  const metrics = useMotionValue<(Metrics | null)[]>([]);

  // Progress runs from the grid's top edge reaching the bottom of the
  // viewport, to that same edge reaching the middle — roughly half a screen
  // of scrolling for the whole flight.
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "start center"],
  });

  const measure = useCallback(() => {
    const anchor = document.getElementById(HERO_STACK_ANCHOR_ID);
    if (!anchor) {
      metrics.set([]);
      return;
    }

    const anchorRect = anchor.getBoundingClientRect();
    // Document coordinates, so the delta between the two elements does not
    // change as the page scrolls and never needs recomputing mid-flight.
    const anchorCentreX = anchorRect.left + anchorRect.width / 2;
    const anchorCentreY = anchorRect.top + anchorRect.height / 2;

    metrics.set(
      slotRefs.current.map((slot, index) => {
        const fan = FAN[index];
        if (!slot || !fan) return null;

        const slotRect = slot.getBoundingClientRect();
        if (slotRect.width === 0) return null;

        return {
          dx: anchorCentreX + fan.dx - (slotRect.left + slotRect.width / 2),
          dy: anchorCentreY + fan.dy - (slotRect.top + slotRect.height / 2),
          heroScale: (anchorRect.width * STACK_FILL) / slotRect.width,
        };
      }),
    );
  }, [metrics]);

  useEffect(() => {
    // Under reduced motion nothing flies, so there is nothing to measure.
    if (reduced) return;

    measure();

    // Cover images resolving, fonts swapping and the viewport resizing all
    // move the grid relative to the hero. Observing the grid catches the
    // first two; the resize listener catches the third, since a viewport
    // change need not alter the grid's own box.
    const observer = new ResizeObserver(measure);
    if (gridRef.current) observer.observe(gridRef.current);
    const anchor = document.getElementById(HERO_STACK_ANCHOR_ID);
    if (anchor) observer.observe(anchor);

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, reduced]);

  if (projects.length === 0) return null;

  return (
    <section
      aria-labelledby="latest-projects"
      className="border-line relative z-20 border-t py-(--space-section)"
    >
      <div className="container-page">
        <h2
          id="latest-projects"
          className="text-display tracking-display font-semibold"
        >
          {heading}
        </h2>

        <div
          ref={gridRef}
          className="mt-12 grid grid-cols-1 gap-x-7 gap-y-14 sm:grid-cols-2 md:mt-16"
        >
          {projects.map((project, index) => (
            <article key={project.id}>
              <div
                ref={(node) => {
                  slotRefs.current[index] = node;
                }}
                className="relative aspect-[4/3]"
                style={{ zIndex: FAN[index]?.z ?? 1 }}
              >
                <FlightCard
                  progress={scrollYProgress}
                  metrics={metrics}
                  index={index}
                  rotate={FAN[index]?.rotate ?? 0}
                  enabled={!reduced}
                >
                  <CardSurface
                    href={project.href}
                    title={project.title}
                    viewLabel={viewLabel}
                  >
                    {media[index]}
                  </CardSurface>
                </FlightCard>
              </div>

              {/* The caption never flies — it is already seated while the
                  image is still in transit, which is what makes the landing
                  read as the image arriving somewhere it belongs. */}
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {project.title}
                  </h3>
                  {project.meta ? (
                    <p className="text-ink-muted mt-1 text-sm">
                      {project.meta}
                    </p>
                  ) : null}
                </div>

                {project.href ? (
                  <Link
                    href={project.href as never}
                    className="text-ink hover:text-ink-subtle mt-1 flex shrink-0 items-center gap-1.5 text-sm font-medium transition-colors"
                  >
                    <ArrowUpRight />
                    <span>{viewLabel}</span>
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        {allLabel && allHref ? (
          <div className="mt-16 flex justify-center">
            <Link
              href={allHref as never}
              className="text-ink hover:text-ink-subtle flex items-center gap-1.5 text-sm font-medium tracking-wide uppercase transition-colors"
            >
              <span>{allLabel}</span>
              <ArrowUpRight />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Applies the flight transform to one card.
 *
 * Values are pushed imperatively on each progress change rather than derived
 * with `useTransform`, because the mapping depends on measurements that
 * arrive after mount and change on resize. A `useTransform` closure would
 * capture the metrics from the render that created it and keep using them.
 */
function FlightCard({
  progress,
  metrics,
  index,
  rotate: rotateAtRest,
  enabled,
  children,
}: {
  progress: MotionValue<number>;
  metrics: MotionValue<(Metrics | null)[]>;
  index: number;
  rotate: number;
  enabled: boolean;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);

  const apply = useCallback(
    (p: number) => {
      const measured = enabled ? (metrics.get()[index] ?? null) : null;

      if (!measured) {
        // Not measured yet, reduced motion, or a card with no stack position:
        // it simply sits where the grid put it.
        x.set(0);
        y.set(0);
        rotate.set(0);
        scale.set(1);
        return;
      }

      // p = 0 is fully stacked in the hero, p = 1 is seated in the grid.
      const away = 1 - p;
      x.set(measured.dx * away);
      y.set(measured.dy * away);
      rotate.set(rotateAtRest * away);
      scale.set(1 + (measured.heroScale - 1) * away);
    },
    [enabled, metrics, index, rotateAtRest, x, y, rotate, scale],
  );

  useMotionValueEvent(progress, "change", apply);

  // A re-measure changes where the card should be without the scroll position
  // moving, so the new geometry has to be applied at the current progress.
  useMotionValueEvent(metrics, "change", () => apply(progress.get()));

  // Neither value emits until it next changes, so the initial position has to
  // be applied directly.
  useEffect(() => {
    apply(progress.get());
  }, [apply, progress]);

  return (
    <motion.div
      style={{ x, y, rotate, scale }}
      className="absolute inset-0 will-change-transform"
    >
      {children}
    </motion.div>
  );
}

/** The card itself: rounded, clipped, and the cursor's hover target. */
function CardSurface({
  href,
  title,
  viewLabel,
  children,
}: {
  href: string | null;
  title: string;
  viewLabel: string;
  children: React.ReactNode;
}) {
  const surface = cn(
    "rounded-card bg-bg-inset ring-line/60 block h-full w-full",
    "overflow-hidden shadow-float ring-1",
  );

  if (!href) {
    return <div className={surface}>{children}</div>;
  }

  return (
    <Link
      href={href as never}
      className={surface}
      aria-label={`${viewLabel}: ${title}`}
      {...{ [CURSOR_LABEL_ATTR]: viewLabel }}
    >
      {children}
    </Link>
  );
}
