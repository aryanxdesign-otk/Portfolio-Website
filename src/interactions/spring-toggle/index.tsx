"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { useReducedMotion } from "@/components/motion/useReducedMotion";

/**
 * A toggle whose knob overshoots slightly and settles.
 *
 * The overshoot is the whole point: a linear slide reads as a state change,
 * a spring reads as a physical object being flicked. Driven by layout rather
 * than by animating `left`, so the knob lands exactly against the track's
 * padding at both ends regardless of size.
 */
export function SpringToggle() {
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Demo toggle"
      onClick={() => setOn((value) => !value)}
      className={`flex h-9 w-16 items-center rounded-full p-1 transition-colors duration-300 ${
        on ? "bg-positive justify-end" : "bg-ink/15 justify-start"
      }`}
    >
      <motion.span
        layout
        className="bg-bg size-7 rounded-full shadow-sm"
        transition={
          reduced
            ? { duration: 0 }
            : // Low damping is what produces the overshoot. Raise it towards
              // 30 and the knob simply arrives.
              { type: "spring", stiffness: 700, damping: 26, mass: 0.7 }
        }
      />
    </button>
  );
}
