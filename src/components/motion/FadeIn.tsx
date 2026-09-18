"use client";

import { motion } from "motion/react";

import { useReducedMotion } from "./useReducedMotion";

/**
 * Reveals its children once when they scroll into view.
 *
 * Uses motion's own `whileInView` rather than a manual IntersectionObserver,
 * and never swaps the rendered element. An earlier version returned a plain
 * <div> under reduced motion and a motion.div otherwise — when the
 * reduced-motion snapshot resolved after hydration the element was replaced,
 * the observer stayed bound to the discarded node, and the content was stuck
 * at opacity 0 forever.
 *
 * `initial={false}` under reduced motion means the element simply renders in
 * its final state: no animation, nothing to get stuck.
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
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      // `once` keeps it from re-animating on every scroll past, which is what
      // makes a page feel restless. The negative margin fires it slightly
      // before the element is fully on screen.
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
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
