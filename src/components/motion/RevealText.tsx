"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/cn";

import { useReducedMotion } from "./useReducedMotion";

/**
 * Headline reveal — words rise into place behind a clipping mask.
 *
 * Split by word, never by character: a screen reader announcing a headline
 * one letter at a time is the classic cost of this effect. Each word keeps
 * its spaces, so text selection and copy-paste still behave.
 */
export function RevealText({
  text,
  className,
  delay = 0,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Tag className={className}>
      {/* The visible text is built from spans; this keeps the full string
          available to assistive tech as a single readable label. */}
      <span className="sr-only">{text}</span>
      <span ref={ref as never} aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : { y: "110%" }}
              transition={{
                duration: 0.8,
                delay: delay + index * 0.045,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word}
              {index < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/**
 * Same reveal, for a block of children rather than a string.
 */
export function RevealBlock({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        initial={{ y: "100%" }}
        animate={inView ? { y: "0%" } : { y: "100%" }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
