"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { useReducedMotion } from "./useReducedMotion";

/**
 * Reveals its children once when they scroll into view.
 *
 * `once: true` matters — re-animating on every scroll past is the thing that
 * makes portfolio sites feel restless.
 */
export function FadeIn({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  /** Distance travelled, in px. 0 fades without moving. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Fire slightly before the element is fully on screen, so the motion has
  // finished by the time it is in the reading position.
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return (
      <Static ref={ref as never} className={className}>
        {children}
      </Static>
    );
  }

  return (
    <Component
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1], // --ease-out-expo
      }}
    >
      {children}
    </Component>
  );
}
