"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { useReducedMotion } from "./useReducedMotion";

/**
 * Lenis smooth scrolling, mounted once at the root.
 *
 * Skipped entirely under reduced motion — hijacking the scroll is precisely
 * the kind of motion that setting exists to prevent. Also skipped on touch,
 * where native momentum scrolling is better than anything we'd substitute.
 */
export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native touch scrolling already feels right; Lenis on top of it does not.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return null;
}
