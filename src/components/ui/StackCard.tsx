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
        className="focus-visible:outline-ink block rounded-(--radius-card) focus-visible:outline-2 focus-visible:outline-offset-4"
        aria-label={`${title} — ${count} ${count === 1 ? "item" : "items"}`}
      >
        <div className="bg-bg-subtle border-line relative overflow-hidden rounded-(--radius-card) border">
          {/* Folder tab label */}
          <div className="flex items-center gap-2 px-5 pt-5 pb-3">
            <span className="text-ink-faint font-mono text-sm">
              work/
              <span className="text-ink-muted">{path}</span>
            </span>
            <span className="bg-bg-inset text-ink-muted rounded-full px-2 py-0.5 font-mono text-xs tabular-nums">
              {count}
            </span>
          </div>

          {/* The stack */}
          <div className="relative h-[17.5rem] px-5">
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

            {/* Fades the stack into the card so layers do not end abruptly */}
            <div className="from-bg-subtle pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" />

            {/* View pill */}
            <div className="absolute bottom-5 left-5">
              <span className="bg-ink text-bg inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium">
                View
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-(--ease-out-expo) group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-4 px-1">
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
 * One layer of the stack.
 *
 * `index` 0 is the backmost. Depth drives everything: at rest the layers sit
 * tucked almost on top of one another, and on hover they fan sideways like a
 * dealt hand so all three are readable at once. Front layers travel furthest
 * with the pointer, which is the cue that makes the stack read as having
 * depth rather than as three flat rectangles sliding together.
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
  // Back layers move least, so the stack shears instead of sliding as a slab.
  const depth = 3 - index;
  const travel = 6 * depth;

  const pointerX = useTransform(sx, [-0.5, 0.5], [-travel, travel]);
  const pointerY = useTransform(sy, [-0.5, 0.5], [-travel * 0.6, travel * 0.6]);

  // Resting: tucked. Hovered: fanned out and squared up.
  const restY = [18, 9, 0][index];
  const restScale = [0.92, 0.96, 1][index];
  const restRotate = [0, 0, 0][index];

  const openX = [-26, -12, 0][index];
  const openY = [10, 5, 0][index];
  const openRotate = [-5, -2.2, 0][index];

  const settled = reduced || active;

  return (
    <motion.div
      className="absolute inset-x-5 top-0 origin-bottom"
      style={{
        zIndex: index,
        x: reduced ? 0 : pointerX,
        y: reduced ? 0 : pointerY,
      }}
      animate={{
        translateX: settled ? openX : 0,
        translateY: settled ? openY : restY,
        rotate: settled ? openRotate : restRotate,
        scale: settled ? 1 : restScale,
        opacity: settled ? 1 : [0.55, 0.8, 1][index],
      }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="border-line bg-bg overflow-hidden rounded-(--radius) border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-14px_rgba(0,0,0,0.16)]">
        {children}
      </div>
    </motion.div>
  );
}
