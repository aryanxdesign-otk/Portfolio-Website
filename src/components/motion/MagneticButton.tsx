"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/cn";

import { useReducedMotion } from "./useReducedMotion";

/**
 * An element that leans toward the cursor as it approaches.
 *
 * Only binds pointer handlers for devices that actually have a hovering
 * pointer — on touch there is no cursor to lean toward, and attaching the
 * listeners anyway just costs work during scroll.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** 0 = no pull, 1 = element follows the cursor exactly. */
  strength?: number;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.6 });

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </motion.div>
  );
}
