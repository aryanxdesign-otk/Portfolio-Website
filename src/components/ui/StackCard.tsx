"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";

import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * A folder-style work card holding three stacked layers that respond to the
 * cursor.
 *
 * At rest the layers sit tucked behind one another with a slight offset. On
 * hover they fan out and lean toward the pointer, each layer travelling a
 * little further than the one behind it — the depth cue that makes the stack
 * read as physical rather than as three flat rectangles.
 *
 * Springs rather than transitions: the pointer is a continuous input, so the
 * layers need to chase a moving target and settle, not restart a fixed-length
 * tween on every mousemove.
 *
 * Only mouse pointers drive it. On touch there is no hover state to speak of,
 * and binding pointermove there would cost work during scroll for nothing.
 * Under reduced motion the stack renders in its fanned-out resting state and
 * never moves.
 */
export function StackCard({
  title,
  path,
  count,
  description,
  href,
  layers,
  className,
}: {
  title: string;
  /** The monospace path label, e.g. "work/case-studies". */
  path: string;
  count: number;
  description?: string;
  href: string;
  /** Three nodes, back to front. */
  layers: [React.ReactNode, React.ReactNode, React.ReactNode];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Pointer position relative to the card centre, normalised to -0.5..0.5.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const spring = { stiffness: 150, damping: 20, mass: 0.7 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const active = hovered && !reduced;

  return (
    <motion.div
      ref={ref}
      className={cn("group relative", className)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <Link
        href={href as never}
        className="focus-visible:outline-ink block rounded-(--radius-card) focus-visible:outline-2 focus-visible:outline-offset-8"
        aria-label={`${title} — ${count} ${count === 1 ? "item" : "items"}`}
      >
        {/* Label */}
        <div className="mb-5 flex items-center gap-2">
          <span className="text-ink-faint font-mono text-sm">
            work/
            <span className="text-ink-muted">{path}</span>
          </span>
          <span className="bg-bg-inset text-ink-muted rounded-full px-2 py-0.5 font-mono text-xs tabular-nums">
            {count}
          </span>
        </div>

        {/* The deck, sitting open on the page — no frame, nothing clipping
            the fanned backs. */}
        <div className="relative h-[13.5rem]">
          {layers.map((layer, index) => (
            <Layer
              key={index}
              index={index}
              active={active}
              reduced={reduced}
              sx={sx}
              sy={sy}
            >
              {layer}
            </Layer>
          ))}
        </div>

        {/* Ghost CTA. Fills on hover, and the arrow slides — the same move
            as the header CTA, so both buttons on the page behave alike. */}
        <div className="mt-6">
          <span className="border-line text-ink group-hover:bg-ink group-hover:text-bg group-hover:border-ink inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300">
            View
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>

      <div className="mt-6">
        <h3 className="text-ink font-medium">{title}</h3>
        {description ? (
          <p className="text-ink-muted mt-1 text-sm leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

/**
 * One layer of the deck.
 *
 * `index` 0 is the backmost. The deck is visibly a deck at rest: each layer
 * behind the front one sits up and to the left with a little more rotation,
 * so all three edges read without any interaction. Hover only deepens what
 * is already there — the cards spread further apart and lean toward the
 * pointer, front layers travelling furthest, which is the cue that sells
 * depth rather than three rectangles sliding as one slab.
 *
 * Every layer keeps its own border and shadow. A shared shadow on the group
 * would flatten the deck back into a single silhouette.
 */
function Layer({
  children,
  index,
  active,
  reduced,
  sx,
  sy,
}: {
  children: React.ReactNode;
  index: number;
  active: boolean;
  reduced: boolean;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  // Front layers react most, so the deck shears instead of sliding as a slab.
  const depth = index + 1;
  const travel = 5 * depth;

  const pointerX = useTransform(sx, [-0.5, 0.5], [-travel, travel]);
  const pointerY = useTransform(sy, [-0.5, 0.5], [-travel * 0.6, travel * 0.6]);

  // Rest: an obvious deck, backs peeking up and left.
  const restX = [-12, 3, 18][index];
  const restY = [-18, -9, 0][index];
  const restRotate = [-4.5, -2.2, 0][index];

  // Hover: the same arrangement, opened further.
  const openX = [-24, -3, 21][index];
  const openY = [-27, -13, 2][index];
  const openRotate = [-7, -3.4, 0.8][index];

  const settled = reduced || active;

  return (
    <motion.div
      className="absolute top-[44%] left-1/2 aspect-[5/4] w-[68%] origin-center"
      style={{
        zIndex: index,
        // Centre the layer on the container before any offset is applied.
        marginLeft: "-34%",
        x: reduced ? 0 : pointerX,
        y: reduced ? 0 : pointerY,
      }}
      animate={{
        translateX: settled ? openX : restX,
        translateY: settled ? openY : restY,
        rotate: settled ? openRotate : restRotate,
      }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="border-line bg-bg h-full -translate-y-1/2 overflow-hidden rounded-[0.875rem] border shadow-[0_1px_2px_rgba(0,0,0,0.05),0_12px_28px_-16px_rgba(0,0,0,0.22)]">
        {children}
      </div>
    </motion.div>
  );
}
