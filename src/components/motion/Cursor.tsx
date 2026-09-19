"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

import { useReducedMotion } from "./useReducedMotion";

/** Elements carrying this attribute expand the cursor into a labelled pill. */
export const CURSOR_LABEL_ATTR = "data-cursor-label";

/**
 * The custom cursor: a small dot that trails the pointer, and expands into a
 * labelled pill over anything with a `data-cursor-label` attribute.
 *
 * Three things keep this from being hostile:
 *
 * - It only runs for a fine pointer. On touch there is nothing to follow, and
 *   hiding the native cursor on a hybrid device with a trackpad would be
 *   worse than not having the effect.
 * - It is skipped entirely under reduced motion — a lagging element that
 *   chases the pointer is exactly what that setting is for.
 * - The native cursor is hidden by a class this component adds at runtime, so
 *   a visitor whose JS never runs still has a pointer.
 *
 * The dot blends with `difference` so it inverts against whatever is beneath
 * it — black over the page, white over the footer — which is one rule instead
 * of tracking which section the pointer is over. The pill does not blend,
 * because inverted text at that size is unreadable.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Stiff enough to feel attached, soft enough to read as a follow.
  const springX = useSpring(x, { stiffness: 700, damping: 45, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 700, damping: 45, mass: 0.35 });

  useEffect(() => {
    if (reduced) return;
    const query = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target;
      const hit =
        target instanceof Element
          ? target.closest(`[${CURSOR_LABEL_ATTR}]`)
          : null;
      setLabel(hit?.getAttribute(CURSOR_LABEL_ATTR) ?? null);
    };

    // Leaving the window should take the cursor with it, or it hangs at the
    // last known position until the pointer comes back.
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    return () => root.classList.remove("has-custom-cursor");
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <AnimatePresence mode="popLayout" initial={false}>
          {label ? (
            <motion.span
              key="pill"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-pill text-ink block bg-white/85 px-4 py-2.5 text-base font-medium whitespace-nowrap shadow-[0_2px_12px_rgb(0_0_0/0.12)] backdrop-blur-sm"
            >
              {label}
            </motion.span>
          ) : (
            <motion.span
              key="dot"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="block size-3 rounded-full bg-white mix-blend-difference"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
