"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/cn";

import { useReducedMotion } from "./useReducedMotion";

/**
 * Headline reveal — words rise into place behind a clipping mask.
 *
 * Split by word, never by character: a screen reader announcing a headline
 * one letter at a time is the classic cost of this effect. The full string is
 * exposed once via sr-only text and the animated spans are aria-hidden, so
 * the structure is identical whether or not motion is allowed — no element
 * swapping, and nothing that can get stuck mid-reveal.
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
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden align-bottom"
          >
            <motion.span
              className="inline-block"
              initial={reduced ? false : { y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
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

/** The same reveal, for a block of children rather than a string. */
export function RevealBlock({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        initial={reduced ? false : { y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
