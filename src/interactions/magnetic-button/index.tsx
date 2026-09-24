"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef } from "react";

import { useReducedMotion } from "@/components/motion/useReducedMotion";

/**
 * A button that leans toward the cursor as it approaches.
 *
 * The spring matters more than the offset: without it the button snaps to
 * every pointer sample and feels twitchy. With it, the button is always
 * chasing a target it never quite reaches, which is what reads as weight.
 *
 * Bound only for mouse pointers — on touch there is no cursor to lean toward,
 * and the listener would cost work during every scroll.
 */
export function MagneticButtonDemo() {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const config = { stiffness: 200, damping: 15, mass: 0.5 };
  const springX = useSpring(x, config);
  const springY = useSpring(y, config);

  const handleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reduced || event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.4);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.4);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className="bg-ink text-bg rounded-full px-6 py-3 text-sm font-medium"
    >
      Hover me
    </motion.button>
  );
}
